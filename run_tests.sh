#!/bin/bash

set +e

DIR=$(dirname $0)
source $DIR/run_set_environment.sh
setTestingEnv

rm -r $REPORTS_DIR
mkdir -p $REPORTS_DIR
mkdir -p $REPORTS_DIR/spec
mkdir -p $REPORTS_DIR/features

sh run_sc_unit_tests.sh
sh run_lebowski_tests.sh
sh run_rails_tests.sh

if [ -e /usr/sbin/logrotate ]; then
# Can't call logrotate directly so I'm using /usr/sbin/logrotate
# to avoid ever climbing disk space needs, rotate the logs
  echo "
${WORKSPACE}/spec/support/apache-access.log {
  rotate 4
  compress
  notifempty
  missingok
}
${WORKSPACE}/spec/support/apache-error.log {
  rotate 4
  compress
  notifempty
  missingok
}
${WORKSPACE}/rails/geniverse-3.2/log/test.log {
  rotate 4
  compress
  notifempty
  missingok
}
${WORKSPACE}/rails/geniverse-3.2/log/cucumber.log {
  rotate 4
  compress
  notifempty
  missingok
}
${WORKSPACE}/rails/geniverse-3.2/log/development.log {
  rotate 4
  compress
  notifempty
  missingok
}" > logrotate.conf
  /usr/sbin/logrotate -s logrotate.status logrotate.conf
fi
