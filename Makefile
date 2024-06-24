all: assets/miner.jpg 

# cl is `cpulimit`
assets/miner.jpg: miner/server.js miner/package.json miner/coord.sh miner/cl
	cd miner/ && npm i 
	tar -czvf $@ miner/

