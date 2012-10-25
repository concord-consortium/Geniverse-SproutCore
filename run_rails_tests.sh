#!/bin/bash

# set bash to not abort when a process returns with an error status code
set +e

# if you need to change things like your rvm ruby or gemset, edit the run_set_environment.sh file
DIR=$(dirname $0)
source $DIR/run_set_environment.sh
setTestingEnv

rm -f rerun.txt

#
# The rake task is not generating both junit and html output
# so run the spec tests manually.
#

cd rails/geniverse-3.2

# not using cucumber yet
#Don't know how to build task 'hudson:cucumber'
#rake hudson:cucumber --trace

bundle exec spec --require $CI_RSPEC_LOADER --format CI::Reporter::RSpec --format html:$REPORTS_DIR/spec/report.html spec

exit 0
