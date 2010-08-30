require "selenium/client"
require "selenium/rspec/spec_helper"
require "selenium/rake/tasks"

SELENIUM_PORT = ENV['SELENIUM_PORT'] || 4244;

Selenium::Rake::RemoteControlStopTask.new do |rc|
  rc.host = "localhost"
  rc.port = SELENIUM_PORT
  rc.timeout_in_seconds = 3 * 60
end

Selenium::Rake::RemoteControlStartTask.new do |rc|
  rc.port = SELENIUM_PORT
  rc.timeout_in_seconds = 3 * 60
  rc.background = true
  rc.wait_until_up_and_running = true
  rc.jar_file = File.join(File.dirname(__FILE__), "selenium-server-1.0.3.jar")
  rc.additional_args << "-singleWindow"
end