#!/bin/bash

retries=0
until ./scripts/run-local-tests.js || (( retries++ >= 3 )); do
  echo "Trying again, retry #$retries...";
  sleep 2;
done
