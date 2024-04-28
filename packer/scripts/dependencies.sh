#!/bin/bash

# Set the -e option
set -e

# Install node
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Check node version
node -v
npm -v

# install unzip
sudo yum install unzip -y