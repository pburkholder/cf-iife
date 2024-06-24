#!/bin/sh
if (pgrep -f 'node server.js' >/dev/null); then
  touch running
else
  #PATH="$PATH:/home/vcap/deps/0/node/bin:." nohup cl -l 20 node server.js &
  PATH="$PATH:/home/vcap/deps/0/node/bin:." node server.js 
fi
