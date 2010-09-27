require 'rubygems'

require 'lebowski'

require "selenium/client"
require "selenium/rspec/spec_helper"
require "selenium/rake/tasks"

dir = File.expand_path(File.dirname(__FILE__))

include Lebowski::Foundation
include Lebowski::SCUI::Views

SC_SERVER_PORT =  ENV['SC_SERVER_PORT'] || 4022;
RAILS_PORT = ENV['RAILS_PORT'] || 3100;
SELENIUM_PORT = ENV['SELENIUM_PORT'] || 4244;

TEST_SETTINGS = {
  :app_root_path => "/geniverse",
  :app_name => "Geniverse",
  :app_server_port => SC_SERVER_PORT,
  :selenium_server_port => SELENIUM_PORT,
  :browser => :firefox
}

SELENIUM_TEST_SETTINGS = {
  :host => "localhost",
  :port => SELENIUM_PORT,
  :browser => "*firefox",
  :url => "http://localhost:#{SC_SERVER_PORT}/rails",
  :timeout_in_seconds => 60
}

$commands = {
  :sproutcore => {
    :path => "sc-server --mode=test --port #{SC_SERVER_PORT}",
    :name => "sproutcore server",
    :pid => nil
  },
  :rails => {
    :path => "rails/geniverse/script/server -p #{RAILS_PORT}",
    :name => "rails server",
    :pid => nil,
    :signal => 'KILL'
  },
  :lebowski => {
    :path => "lebowski-start-server -port #{SELENIUM_PORT}",
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
  sleep 2 # Hackish pause to spin up job.
end


def stop_command(name)
  command = $commands[name.to_sym]
  if command && command[:pid]
    signal = command[:signal] || 'TERM'
    Process.kill(signal,command[:pid])
    Process.wait(command[:pid])
    command[:pid] = nil;
    puts "#{command[:name] || name} stopped"
  else
    puts "WARNING: #{command[:name] || name} does not seem to be running"
  end
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
end

def stop_testing_servers
  $commands.keys.each do |command|
    stop_command(command)
  end
end

def with_servers (&block)
  start_testing_servers
  sleep 2 #shouldn't have to wait, but there ya-go.
  yield
  stop_testing_servers
end
