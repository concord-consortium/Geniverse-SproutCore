#!/usr/bin/env rvm-shell

# set bash to not abort when a process returns with an error status code
set +e

# if you need to change things like your rvm ruby or gemset, edit the run_set_environment.sh file
source run_set_environment.sh
setTestingEnv

run_lebowski_tests() {
  # rvm info

  rm -f rerun.txt

  #
  # The rake task is not generating both junit and html output
  # so run the spec tests manually.
  #
  # Note, there is a hard-coded path to the ci_reporter
  # gem -- will need to be updated if the gem is updated
  #

  CI_RSPEC_LOADER=${GEM_HOME}/gems/ci_reporter-1.6.3/lib/ci/reporter/rake/rspec_loader

  ARG=$1
  if [ -z $1 ]; then
    ARG="spec"
  fi

  # run the top level lebowski integration tests --format html:$REPORTS_DIR/spec/report.html
  rspec --require $CI_RSPEC_LOADER --format CI::Reporter::RSpec $ARG
}

# first set up the rails environment
rvm-shell $RAILS_GEMSET run_rails_setup.sh

if [[ -z $GEM_HOME || $SC_GEMSET != ${GEM_HOME##*/} ]]; then
  echo "was using rvm: ${GEM_HOME##*/}"
  echo "Switching to: $SC_GEMSET"
  rvm-shell $SC_GEMSET $0 $1
else
  run_lebowski_tests $1
fi

exit 0
