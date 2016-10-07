#!/bin/sh

# uninstalle dependencies

npm uninstall inquirer > /dev/null 2>&1 && PID=$!
wait $PID
rm -rf node_modules
