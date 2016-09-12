# Geniverse
### Copyright: ©2016 Concord Consortium

## Installing

### Checking out the latest code

    $ git clone git@github.com:concord-consortium/Geniverse-SproutCore.git
    $ cd Geniverse-SproutCore
    $ git submodule init
    $ git submodule update

### Installing/Configuring RVM

Although not strictly required, RVM (Ruby Version Manager) makes it possible to install and use multiple Ruby versions and multiple sets of gems for use in different contexts. Since Geniverse was developed using an older version of SproutCore which requires an older version of Ruby, RVM makes it possible to set up a Geniverse development environment without affecting the Ruby instance installed on your system or the standard set of gems.

Instructions on installing RVM are available at https://rvm.io/rvm/install.

Install Ruby (cf. https://rvm.io/rubies/installing):
    ```rvm install 1.9.3```

Create a Geniverse gemset (cf. https://rvm.io/gemsets/creating):
    ```rvm gemset create geniverse```

Use the Geniverse gemset (cf. https://rvm.io/gemsets/using):
    ```rvm gemset use geniverse```

### Installing SproutCore

This project uses the SproutCore 1.4.5 gem.

To install the sproutcore gem:
    ```$ gem install sproutcore --version 1.4.5```
  
### Setting up proxies

Although the proxies can be set up in the application's `BuildFile`, we have generally used Apache to proxy everything.

Place the following in your `/etc/apache2/extra/httpd-vhosts.conf` file (replacing `{path-to-dev-workspace}` with the local path to your development workspace):
```
<VirtualHost *:80>
  ServerName sc.local.concord.org
  DocumentRoot {path-to-dev-workspace}/Geniverse-SproutCore/tmp/cache/static
  <Directory {path-to-dev-workspace}/Geniverse-SproutCore/tmp/cache/static>
     AllowOverride all
     Options -MultiViews
  </Directory>

  ProxyPass        /rails/ http://learn.concord.org/geniverse/
  ProxyPassReverse /rails/ http://learn.concord.org/geniverse/

  ProxyPass        /chat/ http://geniverse.concord.org/chat/
  ProxyPassReverse /chat/ http://geniverse.concord.org/chat/

  ProxyPass        /geniverse/ http://geniverse.concord.org/geniverse/
  ProxyPassReverse /geniverse/ http://geniverse.concord.org/geniverse/

  ProxyPass        /portal/verify_cc_token http://127.0.0.1:4020/static/lab/en/current/resources/fake-token
  ProxyPassReverse /portal/verify_cc_token http://127.0.0.1:4020/static/lab/en/current/resources/fake-token

  ProxyPass        /portal/ http://learn.concord.org/
  ProxyPassReverse /portal/ http://learn.concord.org/

  ProxyPass        /resources/ http://geniverse.concord.org/resources/ retry=1
  ProxyPassReverse /resources/ http://geniverse.concord.org/resources/

  ProxyPass        /blog/ http://geniverse.buddypress.staging.concord.org/
  ProxyPassReverse /blog/ http://geniverse.buddypress.staging.concord.org/

  # Sproutcore
  ProxyPass        / http://127.0.0.1:4020/ retry=1
  ProxyPassReverse / http://127.0.0.1:4020/
</VirtualHost>
```

Make sure the following lines are enabled (uncommented) in your `/etc/apache2/httpd.conf` (cf. http://stackoverflow.com/a/1997047):
```
    LoadModule proxy_module /usr/lib/apache2/modules/mod_proxy.so
    LoadModule proxy_http_module /usr/lib/apache2/modules/mod_proxy_http.so

    Include /private/etc/apache2/extra/httpd-vhosts.conf
```

You may also need to add a `ServerName` declaration to `/etc/apache2/httpd.conf` to avoid warnings on Mac OS X:
    ```ServerName localhost```

Add a line like the following to your /etc/hosts file:
    ```127.0.0.1 localhost sc.local.concord.org```

Restart apache so that the changes take effect:
    ```apachectl -k graceful```

## Running Geniverse

Now run the development Geniverse-SproutCore server:
```
    $ sc-server
```
  
And then open http://sc.local.concord.org/lab in your browser.

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