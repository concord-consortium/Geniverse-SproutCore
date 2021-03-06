# Geniverse
### Copyright: ©2017 Concord Consortium

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
```
rvm install 1.9.3
```

Create a Geniverse gemset (cf. https://rvm.io/gemsets/creating):
```
rvm gemset create geniverse
```

Use the Geniverse gemset (cf. https://rvm.io/gemsets/using):
```
rvm gemset use geniverse
```

### Installing SproutCore

This project uses the `SproutCore 1.4.5` gem. Installing SproutCore is sufficient to support basic development and testing.

To install the sproutcore gem:
```
gem install sproutcore --version 1.4.5
```

This installs the appropriate SproutCore build tools.

### Installing Development/Testing/Deployment Gems

For automated testing and deployment scripts, a larger set of gems is required. You can skip this step for simple development and testing.

If you followed the instructions above, then you're running `Ruby 1.9.3` in rvm with a custom gemset. In the console, cd to the root of the `Geniverse-SproutCore` directory. If it isn't already installed, install `bundler`:
```
gem install bundler
```

If you get an error like:
```
ERROR:  Could not find a valid gem 'bundler' (>= 0), here is why:
          Unable to download data from https://rubygems.org/ - SSL_connect returned=1 errno=0 state=error: certificate verify failed (https://api.rubygems.org/specs.4.8.gz)
```
You may need to follow the instructions at [OpenSSL Errors and Rails – Certificate Verify Failed](http://railsapps.github.io/openssl-certificate-verify-failed.html) to update your SSL certificates.

At this point `bundle install` should install all of the gems that are required:
```
bundle install
```

When all dependencies are installed, `bundle install` returns something like
```
Bundle complete! 7 Gemfile dependencies, 36 gems now installed.
Use `bundle show [gemname]` to see where a bundled gem is installed.
Post-install message from ...
```

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
```
ServerName localhost
```

Add a line like the following to your `/etc/hosts` file:
```
127.0.0.1 localhost sc.local.concord.org
```

Restart apache so that the changes take effect:
```
apachectl -k graceful
```

## Running Geniverse Locally

Now run the development Geniverse-SproutCore server:
```
sc-server
```

And then open http://sc.local.concord.org/lab in your browser.

If you are unable to log in successfully, try opening a separate browser tab to http://learn.staging.concord.org and logging in manually there.

## Deploying Geniverse

### Installing and Configuring s3cmd Tools

Download `s3cmd` from http://s3tools.org/download and follow the included installation instructions.

Run `s3cmd --configure` to configure it. You will need your AWS account credentials (Access Key and Secret Access Key).

### Installing Gems

If you haven't already, follow the instructions above for installing the gems required to support the deployment script.

### Deploying Geniverse to Staging

To deploy Geniverse to staging, run the build and deploy script specifying the staging target:
```
./build_and_deploy.sh staging_s3
```

This can take several minutes. If everything completes successfully, the script will end with a message like:
```
Public URL of the object is: http://geniverse-lab.concord.org.s3.amazonaws.com/staging/index.html
Done. Don't forget to invalidate the index files in cloudfront!
```

Ultimately, the new deployment can be tested at http://geniverse-lab.concord.org/staging. The warning about invalidating the index files is because deployed changes won't be visible immediately. See the section on CloudFront Invalidation below for details.

### Deploying Geniverse to Production

To deploy Geniverse to production, run the build and deploy script specifying the production target:
```
./build_and_deploy.sh production_s3
```

Ultimately, the new deployment can be tested at http://geniverse-lab.concord.org. The same cache issues that arise when deploying to staging apply when deploying to production as well.

Note that when deploying to production, a new build is performed, so care must be taken to make sure that what is deployed is identical to what has most recently been tested on staging. In theory if a build has already been deployed to staging, deploying to production could be done by simply changing a few symbolic links which would avoid the risks associated with conducting a new build.

### Deploying Geniverse Demo or creating a self-contained package

The inabox branch contains a version of Geniverse that uses only static files, and requires no connection to any database:

```
git checkout inabox
```

Update `inabox` with any new features from `master`, either by cherry-picking the relevant commits, or with a merge.

To merge and create a Pull Request for the merge:
```
git checkout -b [newBranchForMergeCommit]
git merge master
[... resolve any conflicts ...]
git commit
git push origin
```
Then visit https://github.com/concord-consortium/Geniverse-SproutCore to create the Pull Request. When configuring the PR, specify `inabox` as the base branch and `[newBranchForMergeCommit]` as the target branch.

Test the `inabox` branch by running locally. To test even more completely, build a self-contained package:

```
./build_and_deploy.sh box-package
```

Unzip the generated file, and test it using `live-server` or `python -m SimpleHTTPServer`. If it is working correctly, this self-contained zip contains all the files needed for local hosting at, e.g. a conference.

Finally, re-build it for the demo site (this removes some resources shared at geniverse-resources.concord.org from the build) and deploy to S3:

```
./build_and_deploy.sh demo
```

The deployment can be tested at http://demo.geniverse.concord.org.

## Deploying the "What is Meiosis?"/"Meiosis Lab" Activity (incomplete)

A meiosis-only subset of Geniverse is linked from the [What is Meiosis?](https://concord.org/stem-resources/what-is-meiosis) activity. This page links to a deployed instance of Geniverse at http://meiosis.geniverse.concord.org/. It appears that this version of Geniverse is based on the `meiosis-demo` branch of the Github repository. As of this writing (2017) no one who was involved with the original deployment of the Meiosis Lab is still with the Concord Consortium and so figuring out how to update this deployment (e.g. to fix bugs such as the recently fixed meiosis animation issue) requires some sleuthing. From the AWS management console it is clear that http://meiosis.geniverse.concord.org/ is an [S3 bucket](https://console.aws.amazon.com/s3/home?region=us-east-1#&bucket=meiosis.geniverse.concord.org&prefix=) distributed as a [CloudFront distribution](https://console.aws.amazon.com/cloudfront/home?region=us-east-1#distribution-settings:EHZLIKE96RKN8). Therefore, it is likely that the `build_and_deploy.sh` script on the `meiosis-demo` branch could be updated -- using the deployment of `staging_s3` and `production_s3` on the `master` branch as guides -- to deploy the `meiosis-demo` branch to http://meiosis.geniverse.concord.org/. Similarly, there is also presumably a variant of the CloudFront invalidation paths that could be determined as well.

### CloudFront Invalidation

Staging and Production deployments are hosted on [CloudFront](https://aws.amazon.com/cloudfront/), which caches files until the cache expires. The default cache expiration period is [24 hours](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html). [Invalidation](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html) can be used to clear the cache, thus making deployed changes "live" sooner. The first 1,000 path invalidations per month are free, after which there is a [nominal fee](https://aws.amazon.com/cloudfront/pricing/) (currently $0.005 per path). It is unlikely Concord Consortium is approaching this limit, however. (Invalidating staging invalidates 19 paths.)

#### GUI Invalidation

1. Log in to the [Concord AWS Console](https://concord.signin.aws.amazon.com/console)
2. Choose `CloudFront` under the `Storage & Content Delivery` section
3. Type `geniverse` into the filter field
4. Select the distribution whose Origin is `geniverse-lab.concord.org...` (ID is `E3GYOSZWPRMV40`)
5. Click the `Distribution Settings` button
6. Click the `Invalidations` tab
7. Click the `Create Invalidation` button
8. Enter the paths of the files/objects to invalidate in the resulting dialog
   - To invalidate staging, enter
     - `/staging/index.html`
   - To invalidate production (and staging), enter
     - `/staging/index.html`
     - `/lab/index.html`
     - `/index.html`
     - `/`
9. Click the `Invalidate` button

As an alternative to steps 7-8 above, one can select an existing invalidation from the list that contains the appropriate paths (use the `Details` button to check), and then use the `Copy` button to create a new invalidation with the same paths as the invalidation that was copied.

You can monitor the status of the invalidation on the `Invalidations` tab.

#### CLI Invalidation

To install and configure the `AWS Command Line Interface`:

1. Follow the instructions at http://docs.aws.amazon.com/cli/latest/userguide/installing.html to install the `AWS Command Line Interface`
2. Run `aws configure`
   - Provide the Access Key ID and Secret Access Key when asked
   - Use region name: `us-east-1`
   - Default output format: `json`

To invalidate staging:
```
aws cloudfront create-invalidation --distribution-id E3GYOSZWPRMV40 --paths /staging/index.html
```

To invalidate production (and staging):
```
aws cloudfront create-invalidation --distribution-id E3GYOSZWPRMV40 --paths /staging/index.html /lab/index.html /index.html /
```

Invalidation can take 10-15 minutes or more. To check the status of the invalidation so you can tell when it's done:
```
s3cmd cfinvalinfo cf://E3GYOSZWPRMV40
```

This will give you a list of all invalidations for Geniverse, both current and historical. The top one will look something like:
```
URI:            cf://E3GYOSZWPRMV40/IF6GIGHTMJ517
Status:         InProgress
Created:        2016-10-03T21:24:17.257Z
Nr of paths:    19
Reference:      cli-1475529855-341133
```

This indicates that the invalidation is still being processed. To see the status of only the `InProgress` request, replace the partial URI from the previous command with the full URI from the initial response. For the example above it would be:
```
s3cmd cfinvalinfo cf://E3GYOSZWPRMV40/IF6GIGHTMJ517
```

When the request has been fully processed, the response will look like:
```
URI:            cf://E3GYOSZWPRMV40/IF6GIGHTMJ517
Status:         Completed
Created:        2016-10-03T21:24:17.257Z
Nr of paths:    19
Reference:      cli-1475529855-341133
```

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
