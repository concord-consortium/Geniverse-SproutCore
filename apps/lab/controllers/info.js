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
  pane: null,//Lab.InfoView,
  //contentBinding: 'Lab.userController*content.note',
  content: "",//<a href='#lab/caselog'><strong>Info</strong>rmation!</a>",
  isVisible: NO,
  infoButton: null,

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
    console.log("infoView:",infoView);
    this.set('pane',infoView);
    var _pane = this.get('pane');
    console.log("this.get('pane'):",_pane);
    if (!_pane.get('isVisibleInWindow')){
      if(callingView){
        _pane.append();
      }
      this.updateView(this.get('content'));
    }
  },

  contentDidChange: function () {
    var _content = this.get('content');
    this.updateView(_content);
  }.observes('content'),

  removeView: function (callingView){
    if (!!this.get('pane')) {
      this.get('pane').remove();
    }
  },

  updateView: function (newValue) {
    if (!!this.get('pane')) {
      this.pane.contentView.infoView.set('value', newValue);
    }
  }

}) ;
