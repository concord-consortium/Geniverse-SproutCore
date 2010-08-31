require 'rubygems'

require 'rake'

require "selenium/client"
require "selenium/rspec/spec_helper"
require "selenium/rake/tasks"

dir = File.dirname(__FILE__) 

Rake.application.rake_require(File.join(dir,'selenium-rc'))

TEST_PORT =  ENV['TEST_PORT'] || 4022;
RAILS_PORT = ENV['RAILS_PORT'] || 3100;
SELENIUM_PORT = ENV['SELENIUM_PORT'] || 4244;

TEST_SETTINGS = {
  :host => "localhost",
  :port => SELENIUM_PORT,
  :browser => "*firefox",
  :url => "http://localhost:#{TEST_PORT}/rails",
  :timeout_in_seconds => 60
}


$commands = {
  :sproutcore => {
    :path => "sc-server --mode=test --port #{TEST_PORT}",
    :name => "sproutcore server",
    :pid => nil
  },
  :rails => {
    :path => "rails/geniverse/script/server -p #{RAILS_PORT}",
    :name => "rails server",
    :pid => nil,
    :signal => 'KILL'
  }
}

# create a new started test applicaion 
# configured with mysystem settings
def new_test
  return Selenium::Client::Driver.new TEST_SETTINGS
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
    Rake.application.invoke_task("selenium:rc:start")
  rescue => e
    stop_testing_servers
    raise "Couldn't start all servers!\n#{e}"
  end
end

def stop_testing_servers
  $commands.keys.each do |command|
    stop_command(command)
  end
  Rake.application.invoke_task("selenium:rc:stop")
end

def with_servers (&block)
  start_testing_servers
  sleep 2 #shouldn't have to wait, but there ya-go.
  yield
  stop_testing_servers
end
