#!/bin/bash

setTestingEnv() {
  ## This script expects the following environment variables. If they aren't set in your environment, you can manually tweak them here.
  if [ -z $TEST_ENV_SET ]; then
    if [ -z $WORKSPACE ]; then
      REL_PATH=$(dirname $0)
      export WORKSPACE=$(cd $REL_PATH; pwd)
      echo "set WORKSPACE: $WORKSPACE"
    fi

    export RAILS_ENV=test
    export REPORTS_DIR="$WORKSPACE/hudson/reports"
    export CI_REPORTS=$REPORTS_DIR/spec/

    # set up bundler
    sh -c 'bundle install'
    sh -c 'cd rails/geniverse && bundle install'

    # make sure the rails db is ready
    sh -c 'cd rails/geniverse && rake db:setup --trace'

    export TEST_ENV_SET="true"
  fi
}
