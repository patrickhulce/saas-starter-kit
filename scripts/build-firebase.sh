#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$DIR/.."

cd $ROOT_DIR

if [[ -e dist-firebase ]]; then
  rm -fR dist-firebase
fi

cp -R packages/firebase/ dist-firebase/
rm -fR dist-firebase/node_modules
ln -s $ROOT_DIR/node_modules $ROOT_DIR/dist-firebase/node_modules
ln -s $ROOT_DIR/dist $ROOT_DIR/dist-firebase/dist
