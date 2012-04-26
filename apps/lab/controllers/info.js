// ==========================================================================
// Project:   Lab.infoController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */
sc_require('views/info');
sc_require('views/info_button');

/** @class

  Shows and manages content for a pop-up info view

  @extends SC.ObjectController
  @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
*/
Lab.infoController = SC.ObjectController.create(
/** @scope Lab.infoController.prototype */ {
  pane: null,
  content: "",
  isVisible: NO,
  infoButton: null,
	iframe: SC.WebView.create({								//This is an empty iFrame used to make sure the InfoView will be on top of applets
		layoutBinding: 'Lab.InfoView.layout',
		value: static_url('empty.html')}),
	currentPageView: function(){
		var pageType = Geniverse.activityController.get('pageType');
		return Lab[pageType].mainPane;
	}.property(),
	
  /**
   * Makes the infoButton visible and sets the info view
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
   * Makes the infoButton visible, sets the info view
   * content to the message input if it exists, and
   * pops-up the info view.
   * @param message (optional)
   */
  display: function (message){
    this.displayButtonOnly(message);
    this.showPane(this.infoButton);
  },

  showPane: function(callingView) {
//console.log("showPane called by:",callingView);
    //this.set('infoButton', callingView);
    var infoView = Lab.InfoView;//.create();
    this.set('pane',infoView);
    var _pane = this.get('pane');
    if (!_pane.get('isVisibleInWindow')){
			_pane.append();
			if (_pane.get('isVisibleInWindow')) {
				this.get('currentPageView').appendChild(this.get('iframe'));
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
			if (_pane.get('isVisibleInWindow')) {
				this.get('iframe').parentView.removeChild(this.get('iframe'));
			}
      this.get('pane').remove();
    }
  },

  updateView: function (newValue) {
    if (this.get('pane')) {
      this.pane.contentView.infoView.set('value', newValue);
    }
  }

}) ;
