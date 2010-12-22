#!/usr/bin/env rvm-shell

# set bash to not abort when a process returns with an error status code
set +e

# if you need to change things like your rvm ruby or gemset, edit the run_set_environment.sh file
source run_set_environment.sh
setTestingEnv

run_rails_tests() {
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

  # run the rails spec tests
  cd rails/geniverse

  rake db:setup --trace

  # not using cucumber yet
  #RAILS_ENV=cucumber rake gems:install --trace

  #Don't know how to build task 'hudson:cucumber'
  #rake hudson:cucumber --trace

  spec --require $CI_RSPEC_LOADER --format CI::Reporter::RSpec --format html:$REPORTS_DIR/spec/report.html spec
}

if [ $RAILS_GEMSET != ${GEM_HOME##*/} ]; then
  echo "was using rvm: ${GEM_HOME##*/}"
  echo "Switching to: $RAILS_GEMSET"
  rvm-shell $RAILS_GEMSET $0
else
  run_rails_tests
fi

exit 0