#!/bin/sh

# Terminate the script on a first error, disallow unbound variables.
set -eu

# Create directory for logs.
mkdir -p /myapp/var/log

# Load cron configuration.
crontab /myapp/etc/crontab
echo "Cron has been configured." >> /myapp/var/log/cron.log

# Start cron as a daemon.
cron
echo "Cron has been started." >> /myapp/var/log/cron.log

# Main app
echo "Starting web server (Caddy)..."
cd /myapp/etc/caddy
caddy run
