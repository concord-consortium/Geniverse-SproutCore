#!/bin/sh

rm -rf tmp/
sc-build

# If you don't have rsync, use scp instead
# scp -r tmp/build/static/* otto.concord.org:/web/geniverse.dev.concord.org/static/
rsync -rlzP tmp/build/static/* otto.concord.org:/web/geniverse.dev.concord.org/static/

ssh otto.concord.org "sudo chown -R apache.users /web/geniverse.dev.concord.org/static"
ssh otto.concord.org "sudo chmod -R ug+rw /web/geniverse.dev.concord.org/static"

echo "Geniverse build hash: $(sc-build-number geniverse)"
