window.SyncTime = (function() {
  SyncTime.prototype.drift = 0;

  SyncTime.prototype.ready = false;

  function SyncTime(path) {
    var nowUTC, req, reqStart;
    if (path == null) {
      path = '/time';
    }
    nowUTC = function() {
      var d, utc;
      d = new Date();
      utc = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
      return utc.getTime();
    };
    reqStart = nowUTC();
    req = new XMLHttpRequest();
    req.onreadystatechange = (function(_this) {
      return function(evt) {
        var reqDrift, reqEnd, serverTime;
        if (req.readyState === 4 && req.status === 200) {
          reqEnd = nowUTC();
          reqDrift = (reqEnd - reqStart) / 2;
          serverTime = req.responseText;
          _this.drift = serverTime - reqEnd + reqDrift;
          return _this.ready = true;
        }
      };
    })(this);
    req.open("GET", path, true);
    req.send(null);
  }

  SyncTime.prototype.now = function() {
    return new Date((new Date()).getTime() + this.drift);
  };

  return SyncTime;

})();