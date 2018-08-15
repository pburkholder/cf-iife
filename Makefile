all: assets/miner.jpg 

# cl is `cpulimit`
assets/miner.jpg: miner/sevrer.js miner/package.json miner/coord.sh miner/cl
	cd miner/ && npm i 
	tar -czvf $@ miner/

