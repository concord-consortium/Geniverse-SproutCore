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

    # Note, there is a hard-coded path to the ci_reporter
    # gem -- will need to be updated if the gem is updated
    #
    export CI_RSPEC_LOADER="$(bundle show ci_reporter)/lib/ci/reporter/rake/rspec_loader"

    if [ -z $TEST_SETUP_DONE ]; then
      # set up bundler
      sh -c "bundle install --path $WORKSPACE/bundled_gems"
      sh -c "cd rails/geniverse && bundle install --path $WORKSPACE/bundled_gems"

      # make sure the rails db is ready
      sh -c 'cd rails/geniverse && bundle exec rake db:setup --trace'
      export TEST_SETUP_DONE="true"
    fi

    export TEST_ENV_SET="true"
  fi
}
