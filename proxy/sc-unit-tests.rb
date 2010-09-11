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

def find_free_port(initial_port)
  port = initial_port

  until free_port?(port)
    port += 1
  end

  port
end

def free_port?(port)
  s = TCPServer.new('127.0.0.1', port)
  s.close
  # sproutcore binds to 0.0.0.0 by default so make sure that port isn't taken either
  s = TCPServer.new('0.0.0.0', port)
  s.close
  true
rescue SocketError, Errno::EADDRINUSE
  false
end

def get_port(env_variable, default_port)
  if ENV[env_variable]
    sc_server_port = ENV[env_variable].to_i
  else
    sc_server_port = find_free_port(default_port);
  end
end

# remove old test results rm reports/*.xml
system("git clean -f #{@options[:results_dir]}")

sc_server_port = get_port('SC_SERVER_PORT', 4020)
puts "sc-server port: #{sc_server_port}"

sc_server_cmd = ['sc-server',
       '--daemonize',   # run in the background
       "--pid='#{File.join(Dir.pwd, 'server.pid')}'", # save the pid to the server.pid file
       "--logfile='#{File.join(Dir.pwd, 'server.log')}'", # save the log messages to  server.log
       "--port=#{sc_server_port}",
       "--host=127.0.0.1"]  # this used to be 0.0.0.0 but that seems unnecessarily insecure, that 0.0.0.0
                            # was necessary on our ci server because otherwise it only binds to ipv6 address
                            # hopeully 127.0.0.1 will also work
sc_server = DaemonController.new(
   :identifier    => 'SproutCore Server',
   :start_command => sc_server_cmd.join(' '),
   :ping_command  => lambda { TCPSocket.new('127.0.0.1', sc_server_port) },
   :pid_file      => 'server.pid',
   :log_file      => 'server.log',
   :start_timeout => 25
)

sc_server.start

$:.unshift File.dirname(__FILE__)

require 'apache_config'

apache_port = get_port('APACHE_PROXY_PORT', 1234);

apache = ApacheConfig.new {
  x_instance_home File.expand_path(File.dirname(__FILE__))
  x_port apache_port
  x_host '127.0.0.1'
  x_proxy "/geniverse/geniverse http://geniverse.dev.concord.org/geniverse/geniverse"
  x_proxy "/chat/      http://geniverse.dev.concord.org/chat/"
  x_proxy "/          http://127.0.0.1:#{sc_server_port}/"
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
  puts "Server running at: http://127.0.0.1:#{apache_port}"
  ask('Press enter to continue');
else
  system(run_tests_cmd.join(' '))
end
run_test_result = $?

sc_server.stop

apache.controller.stop

exit(run_test_result.exitstatus)