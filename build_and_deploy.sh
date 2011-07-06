#!/bin/sh

if [ -x $SKIP_BUNDLER ]; then
  CMD_PREFIX="bundle exec"
else
  CMD_PREFIX=""
fi

if [ -x $1 ]; then
  echo "You must specify which server to install to.\nSupported servers: production, dev\n\nUsage: $0 [server]"
  exit 1
fi

case "$1" in
  production)
    export SERVER=seymour.concord.org
    export SERVER_PATH="/web/production/geniverse/static"
    export LABEL_PATH="/web/production/geniverse"
    ;;
  dev)
    export SERVER=otto.concord.org
    export SERVER_PATH="/web/geniverse.dev.concord.org/static"
    export LABEL_PATH="/web/geniverse.dev.concord.org"
    ;;
  *)
    echo "Invalid server!"
    exit 1
    ;;
esac

rm -rf tmp/
$CMD_PREFIX sc-build

# If you don't have rsync, use scp instead
# scp -r tmp/build/static/* geniverse@$SERVER:$SERVER_PATH/
rsync -rlzP tmp/build/static/* geniverse@$SERVER:$SERVER_PATH/

BUILD_NUM=$($CMD_PREFIX sc-build-number lab)
echo "Lab build hash: $BUILD_NUM"

read -p "What label should this be deployed with? " -e -r LABEL

ssh -t geniverse@$SERVER "rm $LABEL_PATH/${LABEL}; ln -s $SERVER_PATH/lab/en/$BUILD_NUM $LABEL_PATH/${LABEL}"

