require 'rubygems'

require 'lebowski'

require "selenium/client"
# require "selenium/rspec/spec_helper"
require "selenium/rake/tasks"

ROOT = File.expand_path(File.join(File.dirname(__FILE__), '..', '..'))
$:.unshift File.expand_path(File.join(ROOT, 'proxy'))

Dir.chdir(ROOT)

require 'apache_config'
require 'port_tools'

dir = File.expand_path(File.dirname(__FILE__))

require "#{dir}/helpers.rb"

USE_CHROME = ENV['USE_CHROME'] || false

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
  :browser => (USE_CHROME ? "*googlechrome" : :firefox)
}

SELENIUM_TEST_SETTINGS = {
  :host => "localhost",
  :port => SELENIUM_PORT,
  :browser => (USE_CHROME ? "*googlechrome" : "*firefox"),
  :url => "http://127.0.0.1:#{APACHE_PORT}/rails/",
  :timeout_in_seconds => 60
}

require 'open-uri'
require 'daemon_controller'
require 'socket'

# monkey-patch so that launching passenger will work
# class DaemonController
#   def determine_lock_file(identifier, pid_file)
#     return LockFile.new(File.expand_path(pid_file + ".lock2")) if identifier == "Rails Backend"
#     return LockFile.new(File.expand_path(pid_file + ".lock"))
#   end
# end

$daemons = {
  :rails => DaemonController.new(
    :identifier => "Rails Backend",
    :start_command => "cd rails/geniverse-3.2; unset BUNDLE_GEMFILE; bundle exec passenger start -d -e test -p #{RAILS_PORT}",
    :stop_command => "cd rails/geniverse-3.2; unset BUNDLE_GEMFILE; bundle exec passenger stop -p #{RAILS_PORT}",
    # :ping_command => lambda { TCPSocket.new('localhost', RAILS_PORT).close },
    :ping_command => lambda { open("http://localhost:#{RAILS_PORT}/").read },
    :pid_file => "#{ROOT}/rails/geniverse-3.2/tmp/pids/passenger.#{RAILS_PORT}.pid",
    :lock_file => "#{ROOT}/rails.lock",
    :log_file => "#{ROOT}/rails/geniverse-3.2/log/passenger.#{RAILS_PORT}.log",
    :log_file_activity_timeout => 25,
    :start_timeout => 25
  ),
  :sproutcore => DaemonController.new(
    :identifier => "SproutCore App",
    :start_command => "bundle exec sc-server --port #{SC_SERVER_PORT} 2> #{ROOT}/sc-server.log & echo $! > #{ROOT}/sc-server.pid",
    :ping_command => lambda { TCPSocket.new('localhost', SC_SERVER_PORT).close },
    :pid_file => "#{ROOT}/sc-server.pid",
    :lock_file => "#{ROOT}/sc-server.lock",
    :log_file => "#{ROOT}/sc-server.log",
    :log_file_activity_timeout => 25,
    :start_timeout => 25
  ),
  :lebowski => DaemonController.new(
    :identifier => "Lebowski Server",
    # :path => "java -jar #{dir}/selenium-server.jar -userExtensions #{dir}/user-extensions.js -port #{SELENIUM_PORT} -Djava.net.preferIPv4Stack=true",
    # :start_command => "bundle exec lebowski-start-server -port #{SELENIUM_PORT} -log lebowski.log -Djava.net.preferIPv4Stack=true & echo $! > lebowski.pid",
    :start_command => "java -jar spec/support/selenium-server.jar -userExtensions spec/support/user-extensions.js -port #{SELENIUM_PORT} -Djava.net.preferIPv4Stack=true & echo $! > lebowski.pid",
    :ping_command => lambda { TCPSocket.new('localhost', SELENIUM_PORT).close },
    :pid_file => "lebowski.pid",
    :lock_file => "lebowski.lock",
    :log_file => "lebowski.log",
    :log_file_activity_timeout => 25,
    :start_timeout => 25
  ),
}

# create a new started test applicaion 
# configured with mysystem settings
def new_test(opts = {})
  app =  MainApplication.new TEST_SETTINGS.merge(opts)
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

def start_apache(fake_authentication = true)
  $apache = ApacheConfig.new {
    x_instance_home File.expand_path(File.dirname(__FILE__))
    x_port APACHE_PORT
    x_host '127.0.0.1'
    x_proxy "/portal/blog/post_blog    http://geniverse.dev.concord.org/portal/dummy_blog_response.txt"
    x_proxy "/portal/verify_cc_token   http://geniverse.dev.concord.org/portal/fake_token.txt" if fake_authentication
    x_proxy "/portal/    http://geniverse-portal.dev.concord.org/portal/"
    x_proxy "/biologica/ http://geniverse.dev.concord.org/biologica/"
    x_proxy "/chat/      http://geniverse.dev.concord.org/chat/"
    x_proxy "/resources/ http://geniverse.dev.concord.org/resources/"
    x_proxy "/rails/     http://127.0.0.1:#{RAILS_PORT}/rails/"
    x_proxy "/           http://127.0.0.1:#{SC_SERVER_PORT}/"
  }

  $apache.controller.start
end

def stop_apache
  $apache.controller.stop
end

def start_testing_servers(fake_authentication = true)
  start_apache(fake_authentication)
  begin
    $daemons.each do |key, daemon|
      puts "Starting: #{key.to_s}"
      # if defined? Bundler
      #   Bundler.with_clean_env do
      #     puts "bundler defined"
      #     daemon.start
      #   end
      # else
      begin
        daemon.start
      rescue DaemonController::AlreadyStarted
        puts "It was already started."
      end
      # end
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
    begin
      daemon.stop
    rescue DaemonController::StopError
      puts "... it was already stopped?"
    end
  end
  
  stop_apache
end

def with_servers (&block)
  start_testing_servers
  yield
  stop_testing_servers
end
