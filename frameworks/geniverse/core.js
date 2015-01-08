// ==========================================================================
// Project:   Geniverse
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @namespace

  My cool new app.  Describe your application.

  @extends SC.Object
*/
// an extension of the SC.Page object to allow us to index all created pages
SC.Page = SC.Page.extend({
  init: function() {
    sc_super();

    var pages = SC.Page.instances;
    if (!pages) {
      pages = SC.Page.instances = [];
    }
    pages.push(this);
  }
});

// Monkey-patch xhr requests so they support sending cookies when making a CORS request
SC.XHRResponse.prototype.invokeTransport = function() {

  var rawRequest, transport, handleReadyStateChange, async, headers;

  // Get an XHR object
  function tryThese() {
    for (var i=0; i < arguments.length; i++) {
      try {
        var item = arguments[i]() ;
        return item ;
      } catch (e) {}
    }
    return NO;
  }

  rawRequest = tryThese(
    function() { return new XMLHttpRequest(); },
    function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
    function() { return new ActiveXObject('Microsoft.XMLHTTP'); }
  );

  if ("withCredentials" in rawRequest) {
    rawRequest.withCredentials = true;
  }

  // save it
  this.set('rawRequest', rawRequest);

  // configure async callback - differs per browser...
  async = !!this.getPath('request.isAsynchronous') ;
  if (async) {
    if (!SC.browser.msie && !SC.browser.opera ) {
      SC.Event.add(rawRequest, 'readystatechange', this, 
                   this.finishRequest, rawRequest) ;
    } else {
      transport=this;
      handleReadyStateChange = function() {
        if (!transport) return null ;
        var ret = transport.finishRequest();
        if (ret) transport = null ; // cleanup memory
        return ret ;
      };
      rawRequest.onreadystatechange = handleReadyStateChange;
    }
  }

  // initiate request.
  rawRequest.open(this.get('type'), this.get('address'), async ) ;

  // headers need to be set *after* the open call.
  headers = this.getPath('request.headers') ;
  for (var headerKey in headers) {
    rawRequest.setRequestHeader(headerKey, headers[headerKey]) ;
  }

  // now send the actual request body - for sync requests browser will
  // block here
  rawRequest.send(this.getPath('request.encodedBody')) ;
  if (!async) this.finishRequest() ; // not async

  return rawRequest ;
};

Geniverse = SC.Application.create(
  /** @scope Geniverse.prototype */ {

  NAMESPACE: 'Geniverse',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.

  // store: SC.Store.create().from(SC.Record.fixtures),
  store: SC.Store.create().from('Geniverse.RailsDataSource'),

  userDefaults: SC.UserDefaults.create({appDomain: "Geniverse"}),

  railsBackedTypes: [],

  NEVER_SAVE_MATCH_DRAGONS: YES,

  // TODO: Add global constants or singleton objects needed by your app here.

  isLoaded: NO

}) ;

Geniverse.NO_DRAGON = SC.Object.create({imageURL: sc_static("question-mark.png"), alleles: "" });

Geniverse.doWhenReady = function(context, object, callback) {
  Geniverse.doWhen(context, object, callback, SC.Record.READY);
};

Geniverse.doWhenReadyClean = function(context, object, callback) {
  Geniverse.doWhen(context, object, callback, SC.Record.READY_CLEAN);
};

Geniverse.doWhen = function(context, object, callback, desiredStatus) {
    var self = context;
    var outer = this;
    var checkStatus = function() {
      var status = object.get('status');
      if (status & desiredStatus) {
        object.removeObserver('status', outer, checkStatus);
        callback.call(context);
      }
      else {
        object.addObserver('status', outer, checkStatus);
      }
    };
    checkStatus();
};

(function() {
  var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
  };

  if (typeof(Geniverse.resourcesBase) == "undefined") {
    if (typeof(window.CC_RESOURCES_BASE) !== "undefined") {
      Geniverse.resourcesBase = window.CC_RESOURCES_BASE;
    } else {
      Geniverse.resourcesBase = "http://resources.geniverse.dev.concord.org";
    }
  }

  if (typeof(Geniverse.portalBase) == "undefined") {
    if (typeof(window.CC_PORTAL_BASE) !== "undefined") {
      Geniverse.portalBase = window.CC_PORTAL_BASE;
    } else {
      Geniverse.portalBase = "/portal";
    }
  }

  if (typeof(Geniverse.railsBackendBase) == "undefined") {
    if (typeof(window.CC_RAILS_BACKEND_BASE) !== "undefined") {
      Geniverse.railsBackendBase = window.CC_RAILS_BACKEND_BASE;
      var l = getLocation(Geniverse.railsBackendBase),
          hostOnly = "";

      if (l.hostname) {
        if (l.protocol) {
          hostOnly += l.protocol;
        } else {
          hostOnly += window.location.protocol;
        }
        hostOnly += '//' + l.hostname;
      }
      Geniverse.railsBackendHostOnly = hostOnly;
    } else {
      Geniverse.railsBackendBase = "/rails";
      Geniverse.railsBackendHostOnly = "";
    }
  }
})();

Geniverse.resourceURL = function(path) {
  return Geniverse.resourcesBase + path;
};
