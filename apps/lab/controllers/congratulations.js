// ==========================================================================
// Project:   Lab.congratulationsController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */
sc_require('views/congratulations');

/** @class

  Shows and manages content for a pop-up congratulations view

  @extends SC.ObjectController
*/
Lab.congratulationsController = SC.ObjectController.create(
/** @scope Lab.congratulationsController.prototype */ {
  pane: null,
  content: "",
  isVisible: NO,
  hideCallback: null,
  iframe: SC.WebView.create({                //This is an empty iFrame used to make sure the CongratulationsView will be on top of applets
    layoutBinding: 'Lab.CongratulationsView.layout',
    value: static_url('empty.html')
  }),

  /**
   * Makes the congratulationsButton visible and sets the congratulations view
   * content to the message input if it exists
   * @param message (optional)
   */
  displayButtonOnly: function (message) {
    this.set('isVisible', YES);
    if(message){
      this.set('content',message);
    }
  },

  /**
   * Makes the congratulationsButton visible, sets the congratulations view
   * content to the message input if it exists, and
   * pops-up the congratulations view.
   * @param message (optional)
   */
  display: function (message, callback){
    this.set('hideCallback', callback);
    this.displayButtonOnly(message);
    this.showPane(this.congratulationsButton);
  },

  showPane: function(callingView) {
//console.log("showPane called by:",callingView);
    //this.set('congratulationsButton', callingView);
    var congratulationsView = Lab.CongratulationsView;//.create();
    this.set('pane',congratulationsView);
    var _pane = this.get('pane');
    if (!_pane.get('isVisibleInWindow')){
      _pane.append();
      if (_pane.get('isVisibleInWindow') && Geniverse.activityController.get('pageContainsApplet')) {
        Geniverse.activityController.get('iframeLayerToAppend').appendChild(this.get('iframe'));
      }
      this.updateView(this.get('content'));
    }
  },

  contentDidChange: function () {
    var _content = this.get('content');
    this.updateView(_content);
  }.observes('content'),

  removeView: function (callingView){
    var _pane = this.get('pane');
    if (this.get('pane')) {
      if (_pane.get('isVisibleInWindow') && Geniverse.activityController.get('pageContainsApplet')) {
        this.get('iframe').parentView.removeChild(this.get('iframe'));
      }
      this.get('pane').remove();
      var callback = this.get('hideCallback');
      if (typeof(callback) == "function") {
        callback();
      }
    }
  },

  updateView: function (newValue) {
    if (this.get('pane')) {
      this.get('pane').contentView.congratulationsView.set('value', newValue);
    }
  }

}) ;
