# ===========================================================================
# Project:   Geniverse
# Copyright: ©2010 The Concord Consortium
# ===========================================================================


config :all, :required => [:geniverse_core, :sproutcore, :cc], :load_fixtures => true

proxy '/geniverse/', :to => 'geniverse.dev.concord.org'
#proxy '/geniverse/', :to => 'localhost:8080'

proxy '/chat/', :to => 'geniverse.dev.concord.org'
#proxy '/chat/', :to => 'localhost:9292'

proxy "/rails", :to => "localhost:3000"
