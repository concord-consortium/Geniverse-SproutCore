// ==========================================================================
// Project:   Lab.helpController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */
sc_require('views/help');

/** @class

  Loads, shows, and manages content for a pop-up help view

  @extends SC.ObjectController
  @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
*/
Lab.helpController = SC.ObjectController.create(
/** @scope Lab.helpController.prototype */ {
  pane: null,//Lab.HelpView,
  content: "Help message loading...",
  isVisible: YES,
  helpButton: null,

  showPane: function(callingView) {
    //console.log("showPane called by:",callingView);
    this.set('helpButton', callingView);
    var helpView = Lab.HelpView;//.create();
    //console.log("helpView:",helpView);
    this.set('pane',helpView);
    var _pane = this.get('pane');
    //console.log("this.get('pane'):",_pane);
    if (!_pane.get('isVisibleInWindow')){
      if(callingView){
        _pane.popup(callingView, SC.PICKER_POINTER);
      }else{
        _pane.popup(null);
      }
      this.set('content', "Help message loading...");
      this.updateView(this.get('content'));
      var pageName = Lab.routes._currentPagePane.get('pageName');
      //console.log("pageName:",pageName);
      if (pageName) {
        // TODO: Get the matching help message from the backend
        var helpMessageFound = function(helpMessage) {
          var message = null;
          if (typeof helpMessage == 'undefined') {
            // No helpMessage exists with that pageName.
            SC.Logger.info("No helpMessage exists with that pageName.");
            message = "Sorry, a help message for this page was not found.<br/>pageName:"+pageName;
          } else {
            message = helpMessage.get('message');
          }
          if(!message){
            SC.Logger.warn("Failed to get message property of helpMessage:",helpMessage);
            message = "Sorry, a proper help message for this page was not found.<br/>pageName:"+pageName;
          }
          Lab.helpController.set('content', message);
        };
        this.findHelpMessage(pageName, helpMessageFound);
      } else {
        this.set('content',
          "Sorry, a help message could not be loaded because the name of your page was not available.");
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
  },

  findHelpMessage: function (pageName, callback) {
    var self = this;
    //console.log("self:", self);
    var query = SC.Query.local(Lab.HelpMessage, {conditions: 'pageName = "' + pageName + '"'});
    //console.log("query:", query);
    //console.log("query.recordType:", query.recordType);
    var helpMessages = Geniverse.store.find(query);
    //console.log("helpMessages:", helpMessages);
    var sendFoundHelpMessage = function() {
      var status = helpMessages.get('status');
      //console.log("status:", status);
      var helpMessage = helpMessages.firstObject();
      //console.log("helpMessage:", helpMessage);
      callback(helpMessage);
    };
    self.doWhenReady(self, helpMessages, sendFoundHelpMessage);
  },

  doWhenReady: function(context, field, method) {
    var self = context;
    //console.log("self = context:", self);
    var status = field.get('status');
    //console.log("status:", status, "SC.Record.READY:", SC.Record.READY);
    if (status & SC.Record.READY == SC.Record.READY) {
      //console.log("calling field.removeObserver('status', method);");
      field.removeObserver('status', method);
      //console.log("method.call(context);");
      method.call(context);
    }
    else {
      //console.log("calling field.addObserver('status', context, method);");
      field.addObserver('status', context, method);
    }
  }
}) ;
