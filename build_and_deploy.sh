#!/bin/sh

rm -rf tmp/
sc-build

# If you don't have rsync, use scp instead
# scp -r tmp/build/static/* otto.concord.org:/web/geniverse.dev.concord.org/static/
rsync -rlzP tmp/build/static/* otto.concord.org:/web/geniverse.dev.concord.org/static/

ssh -t otto.concord.org "sudo chown -R apache.users /web/geniverse.dev.concord.org/static"
ssh -t otto.concord.org "sudo chmod -R ug+rw /web/geniverse.dev.concord.org/static"

echo "Lab build hash: $(sc-build-number lab)"

read -p "What label should this be deployed with? " -e -r LABEL

ssh -t otto.concord.org "rm /web/geniverse.dev.concord.org/sproutcore/${LABEL}; ln -s /web/geniverse.dev.concord.org/static/lab/en/$(sc-build-number lab) /web/geniverse.dev.concord.org/sproutcore/${LABEL}"
