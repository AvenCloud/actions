#!/usr/bin/env bash

set -e

export NODE=/usr/bin/node

if [ ! -x "${NODE}" ]; then
  curl -sL https://deb.nodesource.com/setup_12.x | bash -
  apt-get install -y nodejs
else
  echo "Node $(/usr/bin/node --version) already installed"
fi

# Install npm dependencies if we decide to start copying a package.json too
[ -e package.json ] && npm ci

echo "Running Node..."

# If this is the last command, bash will use its exit status
/usr/bin/node "$(dirname "$0")/index.js" "$@"
