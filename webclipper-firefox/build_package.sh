#!/bin/bash

VERSION=$(awk -F\" '/"version":/ {print $4}' manifest.json)

if [[ "${VERSION}" == "" ]]; then
    echo "Couldn't find version in manifest.json"
    exit
fi

ZIPFILE="send-tab-url_${VERSION}.zip"

echo "Building zip file ${ZIPFILE} in parent directory"

rm ../${ZIPFILE} 2>/dev/null

zip -r -FS ../${ZIPFILE} * \
    --exclude .git \
    --exclude *.swp \
    --exclude README.md \
    --exclude build_package.sh

