#!/bin/sh

# Notes
# * avoid printing anything to a console in order to allow automated tests (if any) to pass without error
# * assumes that this script is called from project root directory

count=`npm ls -json 2>/dev/null | egrep "\<resolved\>.*\<inquirer\>" | wc -l`
if [[ $count -lt 1 ]]; then
  npm install > /dev/null 2>&1 && PID=$!
fi
wait $PID
node "toy_robot.js"
