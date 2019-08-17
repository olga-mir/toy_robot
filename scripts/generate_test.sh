#!/bin/sh
set -eu
[ $# -eq 0 ] && echo "Please provide output filename (with relative path)" && exit 1
output=$1
MAX_X=4
MAX_Y=4
cmds=('place' 'move' 'left' 'move' 'move' 'left' 'right' 'move' 'right' 'move' 'move') # give most weight to 'move' and least to 'place'
ds=('north' 'west' 'south' 'east')
num_cmds=$RANDOM
((num_cmds%=4096))
for((i=0;i<$num_cmds;i++)) do ((n=i%${#cmds[@]})); echo $RANDOM $n ; done | sort | cut -d' ' -f2 |
  while read j; do
  if [[ ${cmds[$j]} == "place" ]] ; then
    ((x=$RANDOM % $MAX_X))
    ((y=$RANDOM % $MAX_Y))
    echo "place $x,$y,${ds[x]}" >> ${output}
  else
    echo ${cmds[$j]} >> ${output}
  fi
done
echo "report" >> ${output}
