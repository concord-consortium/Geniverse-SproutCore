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
  $CMD_PREFIX sc-build --mode $BUILD_MODE
}

function sync {
  echo "Sending files to the server... "
  # If you don't have rsync, use scp instead
  if [ "$BUILD_MODE" == "debug" ]; then
    # scp -r tmp/debug/build/static/* $REMOTE_USER@$SERVER:$SERVER_PATH/
    rsync -rqlzP tmp/debug/build/static/* $REMOTE_USER@$SERVER:$SERVER_PATH/
    export BUILD_NUM="current"
  else
    # scp -r tmp/build/static/* $REMOTE_USER@$SERVER:$SERVER_PATH/
    rsync -rqlzP tmp/build/static/* $REMOTE_USER@$SERVER:$SERVER_PATH/
    export BUILD_NUM=$($CMD_PREFIX sc-build-number lab)
  fi
}

function boxsync {
  echo "Sending files to the server... "
  # If you don't have rsync, use scp instead
  # scp -r tmp/build/static/* $REMOTE_USER@$SERVER:$SERVER_PATH/
  rsync -rqlzP tmp/build/* $REMOTE_USER@$SERVER:$SERVER_PATH/
}

function s3sync {
  if [ -z "$FOLDER" ]; then
    S3_DEST="s3://$BUCKET"
  else
    S3_DEST="s3://$BUCKET/$FOLDER"
  fi
  echo "Sending files to S3 bucket '$S3_DEST' ..."
  s3cmd sync -P -M --no-mime-magic --no-delete-removed tmp/build/ $S3_DEST/
  s3cmd put -P -m "text/html" tmp/build/static/lab/en/$BUILD_NUM/index.html $S3_DEST/static/lab/en/$BUILD_NUM/index.html
  s3cmd put -P -m "text/html" tmp/build/$LABEL/index.html $S3_DEST/$LABEL/
  if [ -e "tmp/build/index.html" ]; then
    s3cmd put -P -m "text/html" tmp/build/index.html $S3_DEST/
  fi

  echo "Done. Don't forget to invalidate the index files in cloudfront!"
}

function label {
  echo "Lab build hash: $BUILD_NUM"

  read -p "What label should this be deployed with? " -e -r LABEL

  ssh -t $REMOTE_USER@$SERVER "rm $LABEL_PATH/${LABEL}; ln -s $SERVER_PATH/lab/en/$BUILD_NUM $LABEL_PATH/${LABEL}"
}

function dbdownload {
  echo "Download necessary database files... "
  ./download_db_as_files.rb
}

function resourcesdownload {
  echo "Downloading necessary resource files... "
  if [ -e "resources-current.zip" ]; then
    echo "Skipping - already exist!"
  else
    wget http://geniverse-resources.concord.org/resources-current.zip
  fi
  unzip -q -d tmp/build/ resources-current.zip
  echo "Done."
}

function deleteUnneededResources {
  echo "Deleting resources files hosted at common resource site... "
  rm -rf tmp/build/resources/DNA2Protein
  rm -rf tmp/build/resources/help
  rm -rf tmp/build/resources/icons
  rm -rf tmp/build/resources/narative
  rm -rf tmp/build/resources/test
}

function package {
  echo "Packaging app... "
  tar -C tmp/build -czf box.tar.gz .
}

function copyindex {
  BUILD_NUM=$($CMD_PREFIX sc-build-number lab)
  cp tmp/build/static/lab/en/$BUILD_NUM/index.html tmp/build/index.html
}

function copyindexwithlabel {
  BUILD_NUM=$($CMD_PREFIX sc-build-number lab)
  mkdir -p tmp/build/$LABEL/
  cp tmp/build/static/lab/en/$BUILD_NUM/index.html tmp/build/$LABEL/index.html
}

case "$1" in
  production)
    export SERVER=geniverse.concord.org
    export SERVER_PATH="/web/static/static"
    export LABEL_PATH="/web/static"
    export REMOTE_USER="deploy"
    export BUILD_MODE="production"
    ;;
  production_s3)
    export BUCKET=geniverse-lab.concord.org
    export BUILD_MODE="production_s3"
    export LABEL="lab"
    build
    copyindex
    copyindexwithlabel
    s3sync
    exit 0
    ;;
  staging_s3)
    export BUCKET=geniverse-lab.concord.org
    export BUILD_MODE="staging_s3"
    export LABEL="staging"
    build
    copyindexwithlabel
    s3sync
    exit 0
    ;;
  dev)
    export SERVER=otto.concord.org
    export SERVER_PATH="/web/geniverse.dev.concord.org/static"
    export LABEL_PATH="/web/geniverse.dev.concord.org"
    export REMOTE_USER="geniverse"
    export BUILD_MODE="dev"
    ;;
  production-old)
    export SERVER=seymour.concord.org
    export SERVER_PATH="/web/production/geniverse/static"
    export LABEL_PATH="/web/production/geniverse"
    export REMOTE_USER="geniverse"
    export BUILD_MODE="production"
    ;;
  testing)
    export SERVER=geniverse.testing.concord.org
    export SERVER_PATH="/web/static/static"
    export LABEL_PATH="/web/static"
    export REMOTE_USER="deploy"
    export BUILD_MODE="testing"
    ;;
  dev-debug)
    export SERVER=otto.concord.org
    export SERVER_PATH="/web/geniverse.dev.concord.org/static"
    export LABEL_PATH="/web/geniverse.dev.concord.org"
    export REMOTE_USER="geniverse"
    export BUILD_MODE="debug"
    ;;
  demo)
    export BUCKET=models-resources
    export LABEL="lab"
    export FOLDER="geniverse-demo"
    export BUILD_MODE="demo"
    build
    dbdownload
    resourcesdownload
    deleteUnneededResources
    copyindex
    s3sync
    exit 0
    ;;
  box)
    export SERVER=otto.concord.org
    export SERVER_PATH="/web/geniverse.inabox"
    export REMOTE_USER="geniverse"
    export BUILD_MODE="inabox"
    build
    dbdownload
    resourcesdownload
    copyindex
    boxsync
    exit 0
    ;;
  box-package)
    export BUILD_MODE="inabox"
    build
    dbdownload
    resourcesdownload
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
