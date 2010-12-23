#!/usr/bin/env rvm-shell

set +e

# if you need to change things like your rvm ruby or gemset, edit the run_set_environment.sh file
source run_set_environment.sh
setTestingEnv

run_sc_unit_tests() {
  # rvm info

  # remove cached files:
  rm -rf tmp

  ruby -rubygems proxy/sc-unit-tests.rb -t apps -o $REPORTS_DIR/tests
}

if [[ -z $GEM_HOME || $SC_GEMSET != ${GEM_HOME##*/} ]]; then
  echo "was using rvm: ${GEM_HOME##*/}"
  echo "Switching to: $SC_GEMSET"
  rvm-shell $SC_GEMSET $0
else
  run_sc_unit_tests
fi

exit 0