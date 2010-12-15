# Geniverse
### Copyright: ©2010 Concord Consortium

## Installing

### Checking out the latest code

 $ git clone git@github.com:concord-consortium/Geniverse-SproutCore.git
 $ cd Geniverse-SproutCore
 $ git submodule init
 $ git submodule update

### Installing SproutCore

This project uses the latest available SproutCore gem 

To install the sproutcore gem:
  $ gem install sproutcore
  
To install the lastest from SproutCore (may not be compatible with current application):
	$ git clone git://github.com/sproutit/sproutcore-abbot.git abbot
	$ cd abbot
	$ rake init
	$ cd ..
	$ git clone git://github.com/sproutit/sproutcore-samples.git samples
	$ cd samples
	$ mkdir -p frameworks
	$ cd frameworks
	$ git clone git://github.com/sproutit/sproutcore.git sproutcore
	$ cd ../..
Then put sproutcore-abbot/bin in your PATH 

### Setting up proxies

Although the proxies can be set up in the application's BuildFile, we have generally used Apache to proxy everything.

The default remote proxies you can use are

  /rails/ http://geniverse.dev.concord.org/rails/
  /chat/ http://geniverse.dev.concord.org/chat/
  /geniverse/ http://geniverse.dev.concord.org/geniverse/
  /biologica/ http://geniverse.dev.concord.org/biologica/
  /portal/ http://geniverse-portal.dev.concord.org/
  
### Running Rails backend locally

If you want to run the rails backend locally, the Rails application can be found in Geniverse-SproutCore/rails/geniverse

Set up the database, then
 $ rake db:schema:load
 $ script/server

This should start rails on http://0.0.0.0:3000

Now you can repoint your rails proxy:

   /rails/ http://localhost:3000/rails/
   
## Running Geniverse

Now run the development Geniverse-SproutCore server:

	$ sc-server
  
And then open http://localhost:4020/lab

## Using routes

The Geniverse/Lab application uses routes to display pages and load activities. There are three forms of routes: activity routes, page routes, and fixture routes

### Activity routes

When you create an activity in the database, you can give it any route you like (up to three slashes), and one of five different pageTypes.

If you give your activity the route "hereditry/apprentice/intro", then the url http://geniverse.dev.concord.org/sproutcore/lab/#hereditry/apprentice/intro will load that activity. If you give it "cooldragons" then the url .../lab/#cooldragons will load it.

The activity will then display the pageType selected. This has to be one of "breedingPage," "breedingPageGroup," "breedingPagePaper," "chromosomeTrainingPage" or "chromosomeBreedingPage."

### Page routes

Routes starting with lab/ or geniverse/:pagename will simply display the named page. For example, #lab/chromosomeBreedingPage will display the page Lab.chromosomeBreedingPage

Note that most pages expect to be initialized from an activity, so most of these pages will show up without dragons or other data.

### Fixtures routes

Both of the above routes work with "fixtures/" appended to their start. Instead of using the Rails backend, this will load in the Geniverse Fixtures. The fixtures/lab route will also load in the first fixture activity (unlike the normal /lab route).

So #fixtures/foo/bar will load the activity with the route "foo/bar" in fixtures, and #fixtures/lab/chromosomeBreedingPage will display the chromosomeBreedingPage and load in the first fixture activity.



---



node.js instructions:

* Install node.js from http://github.com/ry/node
  (Note: you'll need python 2.x for python in the path, not 3.x, for the configure script to work)
* Install node package manager 
  curl http://npmjs.org/install.sh | sudo sh
  or
  download from http://github.com/isaacs/npm and 'sudo make install'

(If you've installed node to somewhere like /usr/local/lib/node (the default) you may need to add user-write permissions to /usr/local/lib/node/.npm in order for 'npm help' to work:)
  sudo chmod ugo+w /usr/local/lib/node/.npm

* Install node-http-proxy: 
    sudo npm install http-proxy

* start up the proxy server and sc-server:
  node proxy.js &
  sc-server -v
  
  (in a separate window):
  open http://localhost:9000/geniverse

---

### Running SproutCore QUnit tests with capybara-testrunner ###
# From the top-level Geniverse-SproutCore directory:
rvm ruby-1.8.7-p299@geniverse gemset import

# don't abort on first error
set +e

# remove cached files:
rm -rf tmp

# remove old reports
rm reports/*.xml

# $SC_SERVER_PORT is usually 4020. That environment variable is used so 
# multiple ci server (such as Husdon) job instances don't use the same port
sc-server --port=$SC_SERVER_PORT --host=0.0.0.0 &
sleep 1

# Go into the capybara-testrunner directory and run the tests
pushd capybara-testrunner
ruby -rubygems run-tests.rb -p $SC_SERVER_PORT -i -h -t apps -o ../reports
EXIT_STATUS=$?

# Leave the capybara-testrunner directory
popd

# send a control-c to sc-server
kill -s 2 %1

exit $EXIT_STATUS


==== STATE CHARTS ====

Old state chart:

  START: Wait until GWT is loaded, then go to
  INIT_ACTIVITY: Download activities, load the one we want, then go to
  LOGIN: checkLoginState, when user logged in go to
  LOAD_DATA: Get dragons, eggs, articles etc.

New state chart:

  START: If user logged in, go to ACTIVITY, else go to LOG_IN
  LOG_IN: Show log in view, when user logged in go to ACTIVITY
  ACTIVITY: Load activity, load student data, go to route