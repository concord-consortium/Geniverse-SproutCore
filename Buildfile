# ===========================================================================
# Project:   Geniverse
# Copyright: ©2010 The Concord Consortium
# ===========================================================================

config :all, 
  :required => [:geniverse_core, :sproutcore, :cc], 
  :load_fixtures => true

config :geniverse,
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
