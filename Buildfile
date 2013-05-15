# ===========================================================================
# Project:   Geniverse
# Copyright: ©2010 The Concord Consortium
# ===========================================================================

config :all, 
  :required => [:geniverse, :sproutcore, :cc, :ki], 
  :load_fixtures => true

mode :production do
  config :lab,
    :google_analytics_id => "null",
    :resources_base => "/"
end

mode :inabox do
  config :lab,
    :google_analytics_id => nil,
    :resources_base => ""
end

mode :demo do
  config :lab,
    :google_analytics_id => "null",
    :resources_base => "/"
end

mode :dev do
  config :lab,
    :google_analytics_id => nil,
    :resources_base => "/"
end

mode :debug do
  config :lab,
    :google_analytics_id => nil,
    :resources_base => "/"
end

config :geniverse,
  :layout => 'lib/index.rhtml',
  :test_layout => 'lib/index.rhtml'
  
config :lab,
  :layout => 'lib/index.rhtml',
  :test_layout => 'lib/index.rhtml'

# INFORMATIONAL ONLY; in development mode, proxy using 'node proxy.js' or some alternative reverse proxy (Apache)

# proxy '/geniverse/', :to => 'geniverse.dev.concord.org'
# proxy '/geniverse/', :to => 'localhost:8080'
# proxy '/chat/', :to => 'geniverse.dev.concord.org'
# proxy '/chat/', :to => 'localhost:9292'
# proxy "/rails", :to => "localhost:3000"

mode :test do
  proxy '/rails', :to => "localhost:#{ENV['RAILS_PORT'] || '3100'}"
end

mode :remote do
#  proxy '/geniverse/', :to => 'geniverse.dev.concord.org'
#  proxy '/resources/', :to => 'geniverse.dev.concord.org'
#  proxy '/static/', :to => 'geniverse.dev.concord.org'
#  proxy '/chat/', :to => 'geniverse.dev.concord.org'
#  proxy "/rails", :to => 'geniverse.dev.concord.org' #"localhost:3000"
#  proxy "/portal", :to=> "geniverse-portal.dev.concord.org"
end
