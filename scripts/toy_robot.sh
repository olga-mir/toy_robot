#!/bin/sh
set -eu
# note - this script is a util script, it assumes to get input from a valid generator and IT DOES NOT VALIDATE INPUT
[ $# -eq 0 ] && echo "Please provide input test filename" && exit 1
input=$1
output_ext="out_sh"
re="^([^ ]+)(.*)$"
re2="^ ([0-9]+),([0-9]+),(.*)"
init=0
x=0
y=0
MAX_X=4
MAX_Y=4
while read -r line; do
  line=$(echo $line | tr '[:upper:]' '[:lower:]') # ${line,,} ??
  if [[ $line =~ $re ]]; then
    cmd=${BASH_REMATCH[1]}
    if [[ $cmd == "place" ]]; then
      init=1
      if [[ ${BASH_REMATCH[2]} =~ $re2 ]]; then
        x=${BASH_REMATCH[1]}
        y=${BASH_REMATCH[2]}
        d=${BASH_REMATCH[3]}
      fi
    else
      if [[ $init -eq 1 ]]; then
        case $cmd in
          left)
            if [[ $d == "north" ]]; then d="west";  continue; fi
            if [[ $d == "west" ]];  then d="south"; continue; fi
            if [[ $d == "south" ]]; then d="east";  continue; fi
            if [[ $d == "east" ]];  then d="north"; continue; fi
            ;;
          right)
            if [[ $d == "north" ]]; then d="east";  continue; fi
            if [[ $d == "west" ]];  then d="north"; continue; fi
            if [[ $d == "south" ]]; then d="west";  continue; fi
            if [[ $d == "east" ]];  then d="south"; continue; fi
            ;;
          move)
            if [[ $d == "north" ]]; then y=$((y+1 > MAX_Y ? MAX_Y : y+1)); continue; fi
            if [[ $d == "west" ]];  then x=$((x-1 < 0 ? 0 : x-1)); continue; fi
            if [[ $d == "south" ]]; then y=$((y-1 < 0 ? 0 : y-1)); continue; fi
            if [[ $d == "east" ]];  then x=$((x+1 > MAX_X ? MAX_X : x+1)); continue; fi
            ;;
          report)
            echo "$x,$y,$(echo $d| tr '[:lower:]' '[:upper:]')" > ${input}.${output_ext}
        esac
      fi
    fi
  fi
done < $input
