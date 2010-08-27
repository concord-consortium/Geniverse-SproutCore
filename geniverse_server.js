var g = require('./garcon/lib/garçon'),
    server, myApp;
    
// create a server which will listen on port 8000 by default
server = new g.Server();
// adding an application named 'myapp' tells the server to respond to
// the /myapp url and to create a myapp.html file when saving
myApp = server.addApp({
  name: 'geniverse',
  theme: 'sc-theme',
  buildLanguage: 'english'
});

// myApp needs SproutCore to run
myApp.addSproutcore();

// add other dependencies
myApp.addFrameworks(
  { path: 'frameworks/cc/frameworks/cc_chat' },
  { path: 'frameworks/cc/frameworks/cc' },
  
  // the theme you're using
  { path:'frameworks/sproutcore/themes/standard_theme', combineScripts: true },
  
  // if you're on Quilmes and use Ace, uncomment the next 2 lines instead
  // { path:'frameworks/sproutcore/themes/empty_theme', combineScripts: true },
  // { path:'frameworks/sproutcore/themes/ace', combineScripts: true },
  
  // // finally, the sources for myApp must be added as well
  { path: 'apps/' + myApp.name }
);

// add some html for inside the <head> tag
myApp.htmlHead = '<title>Geniverse</title>';

// add some html for inside the <body> tag
myApp.htmlBody = [
  '<div id="sendButtonContainer" style="visibility: hidden;">button</div>',
  '<script src="/geniverse/geniverse/geniverse.nocache.js" type="text/javascript"></script>',
  '<script src="/chat/comet.js" type="text/javascript"></script>'
].join('\n');

myApp.build(function() {
  // run the server
  server.run();
});

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
  else if (req.url.match(/^\/geniverse\//) || req.url.match(/^\/chat\//)) {
    sys.puts('proxying to geniverse.dev.concord.org: ', req.url);
    req.headers.host = 'geniverse.dev.concord.org';
    proxy.proxyRequest(80,'geniverse.dev.concord.org', req, res);
  }
  else {
    sys.puts('proxying to garcon: ', req.url);
    proxy.proxyRequest(8000, 'localhost', req, res);
  }
}).listen(9000);



