#!/usr/bin/env rvm-shell

# set bash to not abort when a process returns with an error status code
set +e

# if you need to change things like your rvm ruby or gemset, edit the run_set_environment.sh file
source run_set_environment.sh
setTestingEnv

run_rails_setup() {
  cd rails/geniverse
  rake db:setup --trace
}

if [[ -z $GEM_HOME || $RAILS_GEMSET != ${GEM_HOME##*/} ]]; then
  echo "was using rvm: ${GEM_HOME##*/}"
  echo "Switching to: $RAILS_GEMSET"
  rvm-shell $RAILS_GEMSET $0
else
  run_rails_setup
fi

exit 0
