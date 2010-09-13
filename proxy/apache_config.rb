require 'daemon_controller'
require 'socket'
require 'rbconfig'

class ApacheConfig
  attr_reader :config

  def initialize( &blk)
    @config_string = ""
    @config = {}
    @config_file = 'apache.conf'
    x_load_module 'proxy'
    x_load_module 'proxy_connect'
    x_load_module 'proxy_http'
    self.instance_eval(&blk)
    abort("You need to call x_instance_home in your block") unless @instance_home
    listen "#{@host}:#{@port}"
    pidFile  "#{@instance_home}/apache.pid"
    errorLog "#{@instance_home}/apache-error.log"
    lockFile "#{@instance_home}/accept.lock"
  end

  def write_config
    File.open(config_file_path, 'w') do |f|
      f.write(@config_string)
    end
  end

  # use undefined methods to print out apache directive for exmaple listen 1234 becomes 'Listen 1234'
  def method_missing(m, arg)
    @config_string << "#{m.to_s[0..0].upcase}#{m.to_s[1..-1]} #{arg}\n"
    @config[m] = arg
  end

  def x_load_module(name)
    case RbConfig::CONFIG['host_os']
    when /darwin|mac os/
      loadModule "#{name}_module libexec/apache2/mod_#{name}.so"
    when /linux/
      loadModule "#{name}_module modules/mod_#{name}.so"
    end
  end 

  def x_port(port)
    @port = port
  end

  def x_host(host)
    @host = host
  end

  def x_proxy(mapping)
    proxyPass "       #{mapping}"
    proxyPassReverse "#{mapping}"
  end
  
  def x_instance_home(home)
    @instance_home = home
  end
  
  def config_file_path
    File.join(@instance_home, @config_file)
  end
  
  def controller
    DaemonController.new(
       :identifier    => 'Apache web server',
       :start_command => "/usr/sbin/apachectl -f #{config_file_path} -k start",
       :ping_command  => lambda { TCPSocket.new(@host, @port) },
       :pid_file      => @config[:pidFile],
       :log_file      => @config[:errorLog],
       :before_start  => method(:write_config ),
       :timeout       => 25
    )
  end
end
