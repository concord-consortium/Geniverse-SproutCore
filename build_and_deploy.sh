#!/bin/sh

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
    export LABEL_PATH="/web/geniverse.dev.concord.org/sproutcore"
    ;;
  demo)
    export SERVER=geniverse-vm1.concord.org
    export SERVER_PATH="/web/geniverse/static"
    export LABEL_PATH="/web/geniverse"
    ;;
  *)
    echo "Invalid server!"
    exit 1
    ;;
esac

rm -rf tmp/
sc-build

# If you don't have rsync, use scp instead
# scp -r tmp/build/static/* geniverse@$SERVER:$SERVER_PATH/
rsync -rlzP tmp/build/static/* geniverse@$SERVER:$SERVER_PATH/

echo "Lab build hash: $(sc-build-number lab)"

read -p "What label should this be deployed with? " -e -r LABEL

ssh -t geniverse@$SERVER "rm $LABEL_PATH/${LABEL}; ln -s $SERVER_PATH/lab/en/$(sc-build-number lab) $LABEL_PATH/${LABEL}"
