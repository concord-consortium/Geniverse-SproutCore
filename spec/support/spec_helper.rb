require 'rubygems'

require 'lebowski'

require "selenium/client"
# require "selenium/rspec/spec_helper"
require "selenium/rake/tasks"

ROOT = File.expand_path(File.join(File.dirname(__FILE__), '..', '..'))
$:.unshift File.expand_path(File.join(ROOT, 'proxy'))

require 'apache_config'
require 'port_tools'

dir = File.expand_path(File.dirname(__FILE__))

require "#{dir}/helpers.rb"

include Helpers

include Lebowski::Foundation
include Lebowski::SCUI::Views

SC_SERVER_PORT =  PortTools.get_port('SC_SERVER_PORT', 4022);
RAILS_PORT = PortTools.get_port('RAILS_PORT', 3100);
SELENIUM_PORT = PortTools.get_port('SELENIUM_PORT', 4244);
APACHE_PORT = PortTools.get_port('APACHE_PROXY_PORT', 1234);

TEST_SETTINGS = {
  :app_root_path => "/lab",
  :app_name => "Lab",
  :app_server_host => "127.0.0.1",
  :app_server_port => APACHE_PORT,
  :selenium_server_host => "127.0.0.1",
  :selenium_server_port => SELENIUM_PORT,
  :browser => :firefox
}

SELENIUM_TEST_SETTINGS = {
  :host => "localhost",
  :port => SELENIUM_PORT,
  :browser => "*firefox",
  :url => "http://127.0.0.1:#{APACHE_PORT}/rails/",
  :timeout_in_seconds => 60
}

require 'daemon_controller'
require 'socket'

# monkey-patch so that launching passenger will work
class DaemonController
  def determine_lock_file(identifier, pid_file)
    return LockFile.new(File.expand_path(pid_file + ".lock2")) if identifier == "Rails Backend"
    return LockFile.new(File.expand_path(pid_file + ".lock"))
  end
end

$daemons = {
  :rails => DaemonController.new(
    :identifier => "Rails Backend",
    :start_command => "cd rails/geniverse; unset BUNDLE_GEMFILE; bundle exec passenger start -d -e test -p #{RAILS_PORT}",
    :ping_command => lambda { TCPSocket.new('localhost', RAILS_PORT)},
    :pid_file => "#{ROOT}/rails/geniverse/passenger.#{RAILS_PORT}.pid",
    :log_file => "#{ROOT}/rails/geniverse/passenger.#{RAILS_PORT}.log",
    :timeout => 25
  ),
  :sproutcore => DaemonController.new(
    :identifier => "SproutCore App",
    :start_command => "bundle exec sc-server --port #{SC_SERVER_PORT} & echo $! > sc-server.pid",
    :ping_command => lambda { TCPSocket.new('localhost', SC_SERVER_PORT)},
    :pid_file => "sc-server.pid",
    :log_file => "sc-server.log",
    :timeout => 25
  ),
  :lebowski => DaemonController.new(
    :identifier => "Lebowski Server",
    :start_command => "bundle exec lebowski-start-server -port #{SELENIUM_PORT} -log lebowski.log -Djava.net.preferIPv4Stack=true & echo $! > lebowski.pid",
    :ping_command => lambda { TCPSocket.new('localhost', SELENIUM_PORT)},
    :pid_file => "lebowski.pid",
    :log_file => "lebowski.log",
    :timeout => 25
  ),
}

# create a new started test applicaion 
# configured with mysystem settings
def new_test
  app =  MainApplication.new TEST_SETTINGS
  app.start
  app.maximize  # TODO: Seems like dragging doesn't work unless we are maximized.
  sleep 2       # TODO: hackish pause, CanvasView is not ready otherwise..
  if block_given?
    yield app
  end
  return app
end

def new_selenium_test
  return Selenium::Client::Driver.new SELENIUM_TEST_SETTINGS
end

def start_apache
  @apache = ApacheConfig.new {
    x_instance_home File.expand_path(File.dirname(__FILE__))
    x_port APACHE_PORT
    x_host '127.0.0.1'
    x_proxy "/portal/    http://geniverse-portal.dev.concord.org/"
    x_proxy "/biologica/ http://geniverse.dev.concord.org/biologica/"
    x_proxy "/chat/      http://geniverse.dev.concord.org/chat/"
    x_proxy "/resources/ http://geniverse.dev.concord.org/resources/"
    x_proxy "/rails/     http://127.0.0.1:#{RAILS_PORT}/rails/"
    x_proxy "/           http://127.0.0.1:#{SC_SERVER_PORT}/"
  }

  @apache.controller.start
end

def stop_apache
  @apache.controller.stop
end

def start_testing_servers
  begin
    $daemons.each do |key, daemon|
      puts "Starting: #{key.to_s}"
      if defined? Bundler
        Bundler.with_clean_env do
          puts "bundler defined"
          daemon.start
        end
      else
        daemon.start
      end
    end

    start_apache
  rescue => e
    $stderr.puts "Couldn't start all servers!\n#{e.message}\n#{e.backtrace.join("\n")}"
    stop_testing_servers
    raise "Couldn't start all servers!\n#{e.message}\n#{e.backtrace.join("\n")}"
  end

end

def stop_testing_servers
  $daemons.each do |key, daemon|
    puts "Stopping #{key.to_s}"
    daemon.stop
  end
  
  stop_apache
end

def with_servers (&block)
  start_testing_servers
  yield
  stop_testing_servers
end
