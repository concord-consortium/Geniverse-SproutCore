require 'rubygems'

require 'daemon_controller'
require 'socket'
# def interruptable_waitpid(pid)
#   result = nil
#   while !result
#     result = Process.waitpid(pid, Process::WNOHANG)
#     sleep 0.01 if !result
#   end
#   return result
# end

# pid = Process.spawn("bundle exec passenger start /Users/aunger/git/Geniverse-Sproutcore/rails/geniverse -d -e test -p 3100", {})
# ret = interruptable_waitpid(pid)
# puts "Spawned #{pid}"
ROOT = File.expand_path(File.dirname(__FILE__))
RAILS_PORT = 3000
SC_SERVER_PORT = 4022

#d = DaemonController.new(
#    :identifier => "SproutCore App",
#    :start_command => "sc-server --port #{SC_SERVER_PORT} & echo $! > sc-server.pid",
#    :ping_command => lambda { TCPSocket.new('localhost', SC_SERVER_PORT)},
#    :pid_file => "sc-server.pid",
#    :log_file => "sc-server.log",
#    :timeout => 25
#  )

class DaemonController
  def determine_lock_file(identifier, pid_file)
    lock_file = File.expand_path(pid_file + ".lock")
    lock_file = File.expand_path(pid_file + ".lock2") if identifier == "Rails Backend"
    puts "returning lock file: #{lock_file}"
    return LockFile.new(lock_file)
  end
end

def clean_env
  ENV.delete('BUNDLE_GEMFILE')
  DaemonController.class_eval do
    def determine_lock_file(identifier, pid_file)
    lock_file = File.expand_path(pid_file + ".lock")
    puts "returning lock file: #{lock_file}"
    return LockFile.new(lock_file)
    end
  end
end

d = DaemonController.new(
    :identifier => "Rails Backend",
    :before_start => method(:clean_env),
    :start_command => %!cd rails/geniverse && bundle exec passenger start -d -e test -p #{RAILS_PORT}!,
    :ping_command => lambda { TCPSocket.new('localhost', RAILS_PORT)},
    :pid_file => "#{ROOT}/rails/geniverse/passenger.#{RAILS_PORT}.pid",
    :log_file => "#{ROOT}/rails/geniverse/passenger.#{RAILS_PORT}.log",
    :timeout => 250
  )

  d.start

  puts "started"

  d.stop
