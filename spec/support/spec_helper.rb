require 'rubygems'

require 'lebowski'

require "selenium/client"
# require "selenium/rspec/spec_helper"
require "selenium/rake/tasks"

$:.unshift File.expand_path(File.join(File.dirname(__FILE__), '..', '..', 'proxy'))

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
  # :browser => "*googlechrome"
  :browser => :firefox
}

SELENIUM_TEST_SETTINGS = {
  :host => "localhost",
  :port => SELENIUM_PORT,
  :browser => "*firefox",
  # :browser => "*googlechrome",
  :url => "http://127.0.0.1:#{APACHE_PORT}/rails/",
  :timeout_in_seconds => 60
}

$commands = {
  :sproutcore => {
    :path => "bundle exec sc-server --port #{SC_SERVER_PORT}",
    :name => "sproutcore server",
    :pid => nil
  },
  :rails => {
    :path => "cd rails/geniverse; unset BUNDLE_GEMFILE; exec bundle exec passenger start -e test -p #{RAILS_PORT} --log-file /dev/null",
    # :path => "mongrel_rails start -c rails/geniverse -e production -n 5 -p #{RAILS_PORT}",
    # :path => "rails/geniverse/script/server -p #{RAILS_PORT}",
    :name => "rails server",
    :pid => nil,
    # :signal => 'KILL'
  },
  :lebowski => {
    # this basically does what lebowski-start-server does, but we want to be able to override the selenium-server jar with a newer one tha supports chrome on os x
    :path => "java -jar #{dir}/selenium-server.jar -userExtensions #{dir}/user-extensions.js -port #{SELENIUM_PORT} -Djava.net.preferIPv4Stack=true",
    :name => "lebowski",
    :pid => nil
  }
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

def start_command(name)
  command = $commands[name.to_sym]
  unless command[:pid]
    command[:pid] = fork do
      puts "Starting process  #{command[:name] || name} with #{command[:path]} #{command[:args]}"
      Signal.trap("HUP") do
        puts "Stopping process #{command[:name] || name}"
        exit
      end
      if (command[:args])
        exec(command[:path] || name, command[:args])
      else
        exec(command[:path])
      end
    end
    puts "Started  #{command[:name] || name} with PID: #{command[:pid]}" 
  else
    puts "WARNING: process  #{command[:name] || name} already started with #{command[:pid]}"
  end
  # sleep 2 # Hackish pause to spin up job.
end


def stop_command(name)
  command = $commands[name.to_sym]
  if command && command[:pid]
    signal = command[:signal] || 'TERM'
    begin
      Timeout.timeout(10, Timeout::Error) do
        send_signal(command[:pid],signal)
      end
      command[:pid] = nil;
      puts "#{command[:name] || name} stopped"
    rescue Timeout::Error
      # ok, the default signal didn't work. let's be more forceful
      if signal == 'TERM'
        puts "Trying SIGABRT #{command[:pid]}: #{command[:name] || name}"
        signal ='ABRT'
        retry
      elsif signal == 'ABRT'
        puts "Forcing stop #{command[:pid]}: #{command[:name] || name}"
        signal = 'KILL'
        retry
      elsif signal == 'KILL'
        puts "Failed to stop #{command[:pid]}: #{command[:name] || name}"
      else
        puts "Trying SIGTERM #{command[:pid]}: #{command[:name] || name}"
        signal = 'TERM'
        retry
      end
    end
  else
    puts "WARNING: #{command[:name] || name} does not seem to be running"
  end
end

def send_signal(pid, signal)
  Process.kill(signal,pid)
  Process.wait(pid)
end

def start_apache
  @apache = ApacheConfig.new {
    x_instance_home File.expand_path(File.dirname(__FILE__))
    x_port APACHE_PORT
    x_host '127.0.0.1'
    x_proxy "/portal/    http://geniverse-portal.dev.concord.org/portal/"
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
    $commands.keys.each do |command|
      start_command(command)
    end
  rescue => e
    stop_testing_servers
    raise "Couldn't start all servers!\n#{e.message}\n#{e.backtrace.join("\n")}"
  end

  sleep 10
  start_apache
end

def stop_testing_servers
  $commands.keys.each do |command|
    stop_command(command)
  end
  
  stop_apache
end

def with_servers (&block)
  start_testing_servers
  # sleep 2 #shouldn't have to wait, but there ya-go.
  yield
  stop_testing_servers
end
