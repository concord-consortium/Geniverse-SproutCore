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

function build {
  echo "Building application... "
  rm -rf tmp/
  $CMD_PREFIX sc-build
}

function sync {
  echo "Sending files to the server... "
  # If you don't have rsync, use scp instead
  # scp -r tmp/build/static/* $REMOTE_USER@$SERVER:$SERVER_PATH/
  rsync -rqlzP tmp/build/static/* $REMOTE_USER@$SERVER:$SERVER_PATH/
}

function boxsync {
  echo "Sending files to the server... "
  # If you don't have rsync, use scp instead
  # scp -r tmp/build/static/* $REMOTE_USER@$SERVER:$SERVER_PATH/
  rsync -rqlzP tmp/build/* $REMOTE_USER@$SERVER:$SERVER_PATH/
}

function label {
  BUILD_NUM=$($CMD_PREFIX sc-build-number lab)
  echo "Lab build hash: $BUILD_NUM"

  read -p "What label should this be deployed with? " -e -r LABEL

  ssh -t $REMOTE_USER@$SERVER "rm $LABEL_PATH/${LABEL}; ln -s $SERVER_PATH/lab/en/$BUILD_NUM $LABEL_PATH/${LABEL}"
}

function dbdownload {
  echo "Download necessary database files... "
  ./download_db_as_files.rb
}

function package {
  echo "Packaging app... "
  tar -C tmp/build -czf box.tar.gz .
}

function copyindex {
  BUILD_NUM=$($CMD_PREFIX sc-build-number lab)
  cp tmp/build/static/lab/en/$BUILD_NUM/index.html tmp/build/index.html
}

case "$1" in
  production)
    export SERVER=seymour.concord.org
    export SERVER_PATH="/web/production/geniverse/static"
    export LABEL_PATH="/web/production/geniverse"
    export REMOTE_USER="geniverse"
    ;;
  ungamed)
    export SERVER=ungamed.genigames.concord.org
    export SERVER_PATH="/web/static/static"
    export LABEL_PATH="/web/static"
    export REMOTE_USER="deploy"
    ;;
  baseline)
    export SERVER=baseline.genigames.concord.org
    export SERVER_PATH="/web/static/static"
    export LABEL_PATH="/web/static"
    export REMOTE_USER="deploy"
    ;;
  dev)
    export SERVER=otto.concord.org
    export SERVER_PATH="/web/geniverse.dev.concord.org/static"
    export LABEL_PATH="/web/geniverse.dev.concord.org"
    export REMOTE_USER="geniverse"
    ;;
  box)
    export SERVER=otto.concord.org
    export SERVER_PATH="/web/geniverse.inabox"
    export REMOTE_USER="geniverse"
    build
    dbdownload
    copyindex
    boxsync
    exit 0
    ;;
  box-package)
    build
    dbdownload
    copyindex
    package
    exit 0
    ;;
  *)
    echo "Invalid server!"
    exit 1
    ;;
esac

build
sync
label

echo "All done!"
