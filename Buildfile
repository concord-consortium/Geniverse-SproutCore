# ===========================================================================
# Project:   Geniverse
# Copyright: ©2010 The Concord Consortium
# ===========================================================================

config :all,
  :required => [:geniverse, :sproutcore, :cc, :ki],
  :load_fixtures => true

mode :production do
  config :lab,
    :google_analytics_id => "UA-6899787-33",
    :portal_base => "http://geniverse.concord.org/portal",
    :rails_backend_base => "http://geniverse.concord.org/rails",
    :resources_base => "http://resources.geniverse.concord.org"
end

mode :production_s3 do
  config :lab,
    :google_analytics_id => "UA-6899787-33",
    :portal_base => "https://learn.concord.org",
    :rails_backend_base => "https://learn.concord.org/geniverse",
    :resources_base => "//geniverse-resources.concord.org",
    :use_full_url_for_resources => true
end

mode :staging_s3 do
  config :lab,
    :google_analytics_id => nil,
    :portal_base => "https://learn.staging.concord.org",
    :rails_backend_base => "https://learn.staging.concord.org/geniverse",
    :resources_base => "//geniverse-resources.concord.org",
    :use_full_url_for_resources => true
end

mode :inabox do
  config :lab,
    :google_analytics_id => nil,
    :resources_base => ""
end

mode :demo do
  config :lab,
    :google_analytics_id => "UA-6899787-32",
    :resources_base => ""
end

mode :dev do
  config :lab,
    :google_analytics_id => nil,
    :portal_base => "https://learn.staging.concord.org",
    :rails_backend_base => "https://learn.staging.concord.org/geniverse",
    :resources_base => "http://resources.geniverse.dev.concord.org"
end

mode :testing do
  config :lab,
    :google_analytics_id => nil,
    :portal_base => "http://geniverse.testing.concord.org/portal",
    :rails_backend_base => "http://geniverse.testing.concord.org/rails",
    :resources_base => "http://resources.geniverse.testing.concord.org"
end

mode :debug do
  config :lab,
    :google_analytics_id => nil,
    :portal_base => "https://learn.staging.concord.org",
    :rails_backend_base => "https://learn.staging.concord.org/geniverse",
    :resources_base => "http://resources.geniverse.dev.concord.org"
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
  proxy '/geniverse/', :to => 'geniverse.dev.concord.org'
  proxy '/chat/', :to => 'geniverse.dev.concord.org'
  proxy "/rails", :to => "geniverse-rails.dev.concord.org"
  proxy "/portal", :to=> "geniverse-portal.dev.concord.org"
end
