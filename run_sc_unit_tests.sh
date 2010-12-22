#!/usr/bin/env rvm-shell

set +e

# if you need to change things like your rvm ruby or gemset, edit the run_set_environment.sh file
source run_set_environment.sh
setTestingEnv

# rvm info

# remove cached files:
rm -rf tmp

ruby -rubygems proxy/sc-unit-tests.rb -t apps -o $REPORTS_DIR/tests

exit 0