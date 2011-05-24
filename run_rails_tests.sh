#!/bin/bash

# set bash to not abort when a process returns with an error status code
set +e

# if you need to change things like your rvm ruby or gemset, edit the run_set_environment.sh file
source run_set_environment.sh
setTestingEnv

rm -f rerun.txt

#
# The rake task is not generating both junit and html output
# so run the spec tests manually.
#
# Note, there is a hard-coded path to the ci_reporter
# gem -- will need to be updated if the gem is updated
#
CI_RSPEC_LOADER=${GEM_HOME}/gems/ci_reporter-1.6.3/lib/ci/reporter/rake/rspec_loader

cd rails/geniverse

# not using cucumber yet
#Don't know how to build task 'hudson:cucumber'
#rake hudson:cucumber --trace

bundle exec spec --require $CI_RSPEC_LOADER --format CI::Reporter::RSpec --format html:$REPORTS_DIR/spec/report.html spec

exit 0
