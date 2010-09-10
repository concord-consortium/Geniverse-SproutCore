# add the lib folder to the search path ($:)
# $:.unshift File.join(File.dirname(__FILE__), '../capybara-testrunner')

puts "********************************************"
puts "    Running SproutCore unit tests"
puts "********************************************"

require 'trollop'  # For processing command-line options

# to keep this simple only include the command options that are being used
# Process command-line options
@options = Trollop::options do
  opt :tests_dir, "Tests directory", :short => 't', :type => :string, :default => "{apps,frameworks}"
  opt :results_dir, "Results directory", :short => 'o', :type => :string, :default => "results"
  opt :interactive, "Interactive: startup servers and wait, don't run tests", :short => 'i', :default => false
end

require 'daemon_controller'
require 'socket'
require 'fileutils'

port = ENV['SC_SERVER_PORT'] ? ENV['SC_SERVER_PORT'].to_i : 4020
sc_server_cmd = ['sc-server',
       '--daemonize',   # run in the background
       "--pid='#{File.join(Dir.pwd, 'server.pid')}'", # save the pid to the server.pid file
       "--logfile='#{File.join(Dir.pwd, 'server.log')}'", # save the log messages to  server.log
       "--port=#{port}",
       "--host=0.0.0.0"]  # this is necessary on our ci server because otherwise it only binds to ipv6 address
sc_server = DaemonController.new(
   :identifier    => 'SproutCore Server',
   :start_command => sc_server_cmd.join(' '),
   :ping_command  => lambda { TCPSocket.new('localhost', port) },
   :pid_file      => 'server.pid',
   :log_file      => 'server.log',
   :start_timeout => 25
)

# remove old test results rm reports/*.xml
system("git clean -f #{@options[:results_dir]}")

sc_server.start

$:.unshift File.dirname(__FILE__)

require 'apache_config'

apache_port = ENV['APACHE_PROXY_PORT'] ? ENV['APACHE_PROXY_PORT'].to_i : 1234

apache = ApacheConfig.new {
  x_instance_home File.expand_path(File.dirname(__FILE__))
  listen apache_port
  x_proxy "/geniverse/geniverse http://geniverse.dev.concord.org/geniverse/geniverse"
  x_proxy "/chat/      http://geniverse.dev.concord.org/chat/"
  x_proxy "/          http://127.0.0.1:#{ENV['SC_SERVER_PORT'] || 4020}/"
}

apache.controller.start

run_tests_cmd = ["ruby -rubygems 'capybara-testrunner/run-tests.rb'",
                 "-p #{apache_port}",
                 "-r .", # set the root for looking for the tests to be this directory
                 "-i -h",
                 "-t #{@options[:tests_dir]}",
                 "-o #{@options[:results_dir]}"]
if @options[:interactive] 
  require 'highline/import'
  puts "Server running at: http://localhost:#{apache_port}"
  ask('Press enter to continue');
else
  system(run_tests_cmd.join(' '))
end
run_test_result = $?

sc_server.stop

apache.controller.stop

exit(run_test_result.exitstatus)