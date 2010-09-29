module PortTools
  require 'socket'
  require 'fileutils'

  def self.find_free_port(initial_port)
    port = initial_port

    until free_port?(port)
      port += 1
    end

    port
  end

  def self.free_port?(port)
    s = TCPServer.new('127.0.0.1', port)
    s.close
    # sproutcore binds to 0.0.0.0 by default so make sure that port isn't taken either
    s = TCPServer.new('0.0.0.0', port)
    s.close
    true
  rescue SocketError, Errno::EADDRINUSE
    false
  end

  def self.get_port(env_variable, default_port)
    if ENV[env_variable]
      sc_server_port = ENV[env_variable].to_i
    else
      sc_server_port = find_free_port(default_port);
    end
  end
end