#!/bin/bash

# Set the -e option
set -e

# move file
sudo mv /tmp/webapp.zip /opt

# move file
sudo mv /tmp/mywebapp.service /etc/systemd/system

# unzip file
sudo unzip /opt/webapp.zip -d /opt/webapp

# move file
sudo mv /tmp/.env /opt/webapp