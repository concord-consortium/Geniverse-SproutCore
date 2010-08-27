// use node-http-proxy to proxy as follows:

//   proxy '/geniverse/', :to => 'geniverse.dev.concord.org'
//   proxy '/chat/', :to => 'geniverse.dev.concord.org'
//   proxy "/rails", :to => "localhost:3000"


var http = require('http'),
    httpProxy = require('http-proxy'),
    sys = require('sys');

// create a proxy server with custom application logic
httpProxy.createServer(function (req, res, proxy) {
  if (req.url.match(/^\/rails/)) {
    sys.puts('proxying to rails: ', req.url);
    proxy.proxyRequest(3000, 'localhost', req, res);
  }
  else if (req.url.match(/^\/geniverse\/(:?geniverse)|(:?cache)\//) || req.url.match(/^\/chat\//)) {
    sys.puts('proxying to geniverse.dev.concord.org: ', req.url);
    req.headers.host = 'geniverse.dev.concord.org';
    proxy.proxyRequest(80,'geniverse.dev.concord.org', req, res);
  }
  else {
    //sys.puts('proxying to sc-server: ', req.url);
    proxy.proxyRequest(4020, 'localhost', req, res);
  }
}).listen(9000);



