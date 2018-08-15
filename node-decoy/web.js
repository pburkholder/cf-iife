var http = require('http');
var url = require('url');
var os = require('os');
var port = process.env.PORT || 5000;

function mySlowFunction(baseNumber) {
    var result = 0;    
    for (var i = Math.pow(baseNumber, 10); i >= 0; i--) {        
        result += Math.atan(i) * Math.tan(i);
    };
    return result;
}

http.createServer(function (req, res) {
  var queryData = url.parse(req.url, true).query;
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World from NodeJS on port ' + port + ' from container ' + os.hostname() + '\n');
  if (queryData.slow) {
    var slow = parseInt(queryData.slow, 10);
    if ([1,2,3,4,5,6,7,8,9].indexOf(slow) > -1) {
      mySlowFunction(slow);
    }
  }
}).listen(port, function() {
  console.log("Listening on " + port);
});
