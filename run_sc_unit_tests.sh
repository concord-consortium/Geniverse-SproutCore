#!/bin/bash

set +e

DIR=$(dirname $0)
source $DIR/run_set_environment.sh
setTestingEnv

# remove cached files:
rm -rf tmp

bundle exec ruby -rubygems proxy/sc-unit-tests.rb -t apps -o $REPORTS_DIR/tests

exit 0
