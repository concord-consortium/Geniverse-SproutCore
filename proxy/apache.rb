$:.unshift File.dirname(__FILE__)

require 'apache_config'

apache = ApacheConfig.new {
  x_instance_home File.absolute_path(File.dirname(__FILE__))
  x_port 1234
  x_host '0.0.0.0'
  x_proxy "/rails/    http://127.0.0.1:#{ENV['RAILS_PORT'] || 3000}/rails/" 
  x_proxy "/chat/      http://geniverse.dev.concord.org/chat/"
  x_proxy "/geniverse/ http://geniverse.dev.concord.org/geniverse/"
  x_proxy "/          http://127.0.0.1:#{ENV['SC_SERVER_PORT'] || 4020}/"
}

case ARGV[0]
when 'start'
  apache.controller.start
when 'stop'
  apache.controller.stop
when 'config'  
  apache.write_config  
else
  puts "usage #{__FILE__} [start|stop|config]"
end


