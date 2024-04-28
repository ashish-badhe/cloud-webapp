#!/bin/bash

# Set the -e option
set -e

sudo systemctl daemon-reload

sudo systemctl enable mywebapp.service