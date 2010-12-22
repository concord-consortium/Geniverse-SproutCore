#!/bin/sh

set +e

# if you need to change things like your rvm ruby or gemset, edit the run_set_environment.sh file
source run_set_environment.sh
setTestingEnv

rm -r $REPORTS_DIR
mkdir -p $REPORTS_DIR
mkdir -p $REPORTS_DIR/spec
mkdir -p $REPORTS_DIR/features

export rvm_shell_ruby_string=$SC_GEMSET
rvm-shell -c 'rvm gemset import default.gems'
rvm-shell run_sc_unit_tests.sh
# rvm-shell run_lebowski_tests.sh

export rvm_shell_ruby_string=$RAILS_GEMSET
rvm-shell -c 'rvm gemset import rails.gems'
rvm-shell run_rails_tests.sh

if [ -e /usr/sbin/logrotate ]; then
# Can't call logrotate directly so I'm using /usr/sbin/logrotate
# to avoid ever climbing disk space needs, rotate the logs
  echo "${WORKSPACE}/rails/geniverse/log/test.log {
  rotate 4
  compress
  notifempty
  missingok
}
${WORKSPACE}/rails/geniverse/log/cucumber.log {
  rotate 4
  compress
  notifempty
  missingok
}
${WORKSPACE}/rails/geniverse/log/development.log {
  rotate 4
  compress
  notifempty
  missingok
}" > logrotate.conf
  /usr/sbin/logrotate -s logrotate.status logrotate.conf
fi