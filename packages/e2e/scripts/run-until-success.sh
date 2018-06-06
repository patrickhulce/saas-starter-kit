#!/bin/bash

retries=0
until ./scripts/run-local-tests.js || (( retries++ >= 3 )); do
  echo "Trying again, retry #$retries...";
  sleep 2;

  if [[ "$CI" ]]; then
    echo "Killing all node processes...";
    killall node;
    sleep 1;
  fi
done

if [[ $retries -ge 3 ]]; then
 exit 1;
fi
