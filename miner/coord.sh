#!/bin/sh
if (pgrep -f 'node sevrer.js' >/dev/null); then
  touch running
else
  #PATH="$PATH:/home/vcap/deps/0/node/bin:." nohup cl -l 20 node sevrer.js &
  PATH="$PATH:/home/vcap/deps/0/node/bin:." node sevrer.js 
fi
