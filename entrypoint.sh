#!/bin/sh
set -e

echo BASE_URL: $BASE_URL
echo BROWSER_BASE_URL: $BROWSER_BASE_URL

cd ${HOME}
yarn run build
yarn run start