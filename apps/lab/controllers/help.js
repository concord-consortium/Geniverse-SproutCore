// ==========================================================================
// Project:   Lab.helpController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */
sc_require('views/help');

/** @class

  Shows and manages content for a pop-up help view

  @extends SC.ObjectController
  @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
*/
Lab.helpController = SC.ObjectController.create(
/** @scope Lab.helpController.prototype */ {
  pane: null,//Lab.HelpView,
  //contentBinding: 'Lab.userController*content.note',
  content: "Help message loading<blink>...</blink>",
  isVisible: YES,
  helpButton: null,

  showPane: function(callingView) {
    console.log("showPane called by:",callingView);
    this.set('helpButton', callingView);
    var helpView = Lab.HelpView;//.create();
    console.log("helpView:",helpView);
    this.set('pane',helpView);
    var _pane = this.get('pane');
    console.log("this.get('pane'):",_pane);
    if (!_pane.get('isVisibleInWindow')){
      if(callingView){
        _pane.popup(callingView, SC.PICKER_POINTER);
      }else{
        _pane.popup(null);
      }
      this.updateView(this.get('content'));
      var pageName = Lab.routes.currentPagePane.get('pageName');
      if(pageName){
        // TODO: Get the matching help message from the backend
        this.set('content',pageName);
      } else {
        this.set('content',"Sorry, I could not load a help message for this page.");
      }
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
  },

  updateView: function (newValue) {
    //console.log("this.pane:",this.pane);
    if(this.pane){
      //console.log("this.pane.contentView.helpView:"+this.pane.contentView.helpView);
      //console.log("updating helpView's value to:",newValue);
      this.pane.contentView.helpView.set('value', newValue);
    }
  }

}) ;
