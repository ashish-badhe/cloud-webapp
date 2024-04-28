#!/bin/bash

# Set the -e option
set -e

curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh

sudo bash add-google-cloud-ops-agent-repo.sh --also-install

# move file
sudo mv /tmp/config.yaml /etc/google-cloud-ops-agent

sudo mkdir -p /tmp/webapp
sudo touch /tmp/webapp/webapp.log

sudo mv /tmp/webapp /var/log

# Give ownership to user 
sudo chown -R csye6225:csye6225 /var/log/webapp

sudo systemctl restart google-cloud-ops-agent