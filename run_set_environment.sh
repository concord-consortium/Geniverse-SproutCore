#!/bin/sh

setTestingEnv() {
  ## This script expects the following environment variables. If they aren't set in your environment, you can manually tweak them here.
  if [ -z $TEST_ENV_SET ]; then
    if [ -z $WORKSPACE ]; then
      export WORKSPACE=$(dirname $0)
      echo "set WORKSPACE: $WORKSPACE"
    fi

    if [ -z $SC_GEMSET ]; then
      export SC_GEMSET="ruby-1.9.2-p0@geniverse"
      echo "set SC_GEMSET: $SC_GEMSET"
    fi
  
    if [ -z $RAILS_GEMSET ]; then
      export RAILS_GEMSET="ruby-1.8.7-p302@geniverse-rails"
      echo "set RAILS_GEMSET: $RAILS_GEMSET"
    fi

    export RAILS_ENV=test
    export REPORTS_DIR="$WORKSPACE/hudson/reports"
    export CI_REPORTS=$REPORTS_DIR/spec/
    # make sure rvm-shell is on the path
    export PATH=${HOME}/.rvm/bin:$PATH
    export TEST_ENV_SET="true"
  fi
}