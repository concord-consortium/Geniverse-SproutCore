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
  // TODO: (1) Set this to YES when info for display is available
  isVisible: YES,
  //infoButton: null,

  showPane: function(callingView) {
    //console.log("showPane called by:",callingView);
    //this.set('infoButton', callingView);
    var infoView = Lab.InfoView;//.create();
    console.log("infoView:",infoView);
    this.set('pane',infoView);
    var _pane = this.get('pane');
    console.log("this.get('pane'):",_pane);
    if (!_pane.get('isVisibleInWindow')){
      _pane.popup(callingView, SC.PICKER_POINTER);
      this.updateView(this.get('content'));
      //callingView.set('isEnabled', NO); // disable calling infoButton
    }
  },

  contentDidChange: function () {
    var _content = this.get('content');
    //console.log("contentDidChange to:",_content);
    this.updateView(_content);
  }.observes('content'),

  removeView: function (callingView){
    //console.log("removeView called by:",callingView);
    var _content = this.get('content');
    //console.log("content:", _content);
    var receiver = this.pane.remove();
    //console.log("this.pane.remove() returned receiver:", receiver);
/*
    console.log("this.infoButton:",this.infoButton)
    if(this.infoButton) {
      this.infoButton.set('isEnabled', YES); // enable calling button
      console.log("this.infoButton.isEnabled:",this.infoButton.get('isEnabled'));
    }
*/
  },

  updateView: function (newValue) {
    //console.log("this.pane:",this.pane);
    if(this.pane){
      //console.log("this.pane.contentView.infoView:"+this.pane.contentView.infoView);
      //console.log("updating infoView's value to:",newValue);
      this.pane.contentView.infoView.set('value', newValue);
    }
  }

}) ;
