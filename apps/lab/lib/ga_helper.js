(function () {
Lab.GAHelper = {};

_gaq = window._gaq;

_timeStart = {};

Lab.GAHelper.Category = {
  NAVIGATION: "Navigation",
  CHALLENGE: "Challenge",
  JOURNAL: "Journal",
  HELP: "Help or Instructions"
}

Lab.GAHelper.trackEvent = function(category, action, label, value) {
  if (!_gaq) return;

  var evt = ['_trackEvent', category, action];
  if (label) {
    evt.push(label);
    if (value) {
      evt.push(value);
    }
  }
  _gaq.push(evt);
};

Lab.GAHelper.trackTimingStart = function(category) {
  if (!_gaq) return;

  _timeStart[category] = new Date().getTime();
};

Lab.GAHelper.trackTimingEnd = function(category) {
  if (!_gaq || !_timeStart[category]) return;

  var timeSpent = new Date().getTime() - _timeStart[category];
  _timeStart[category] = null;

  var evt = ['_trackTiming', category, "Time spent", timeSpent];
  _gaq.push(evt);
};

})();