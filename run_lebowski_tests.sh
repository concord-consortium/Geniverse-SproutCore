#!/bin/bash

# set bash to not abort when a process returns with an error status code
set +e

source run_set_environment.sh
setTestingEnv

rm -f rerun.txt

#
# The rake task is not generating both junit and html output
# so run the spec tests manually.
#

# either run the spec file/dir passed in, or default to the whole spec suite
ARG=$1
if [ -z $1 ]; then
  ARG="spec"
fi

# run the top level lebowski integration tests --format html:$REPORTS_DIR/spec/report.html
bundle exec rspec --require $CI_RSPEC_LOADER --format CI::Reporter::RSpec $ARG

exit 0
