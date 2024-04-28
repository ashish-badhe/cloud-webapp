#!/bin/bash

# Set the -e option
set -e


# Add user with nologin shell
sudo adduser csye6225 --shell /usr/sbin/nologin

# Give ownership to user 
sudo chown csye6225:csye6225 /opt/webapp.zip

# Give ownership to user 
sudo chown -R csye6225:csye6225 /opt/webapp


