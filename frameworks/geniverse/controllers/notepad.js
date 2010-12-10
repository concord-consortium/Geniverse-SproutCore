// ==========================================================================
// Project:   Geniverse.notepadController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  Shows and manages content for a pop-up notepad

  @extends SC.ObjectController
  @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
*/
sc_require('views/notepad');

Geniverse.notepadController = SC.ObjectController.create(
/** @scope Geniverse.notepadController.prototype */ {
  pane: null,//Geniverse.NotepadView,
  contentBinding: 'Geniverse.userController*content.note',
  isEnabledButton: YES,

  /**
   *
   * @param callingView
   */
  showPane: function(callingView) {
    //SC.Logger.log("Geniverse.notepadController.showPane called with callingView:", callingView);
    var username = Geniverse.userController.get('username');
    //SC.Logger.log("Geniverse.userController.get('username'):",username);
    if(username){
      var note = Geniverse.userController.get('note');
      //SC.Logger.log("user's note:",note);
      // Create a new NotepadView instance each time the pane is shown to avoid Firefox TextArea focus bug
      var notepadView = Geniverse.NotepadView.create();
      //console.log("created notepadView:",notepadView);
      this.set('pane',notepadView);
      var _pane = this.get('pane');
      //console.log("this.get('pane'):",_pane);
      if (!_pane.get('isVisibleInWindow')){
        _pane.append();
        this.updateView(this.get('content'));
        this.set('isEnabledButton', NO);
      }
    }else {
      alert("You must be logged in first to use your Note Pad.");
    }
  },

  contentDidChange: function () {
    var _content = this.get('content');
    //console.log("contentDidChange to:",_content);
    this.updateView(_content);
  }.observes('content'),

  /**
   * fixes Firefox bug: \n line breaks don't make it to the backend,
   * so replace them with \r which do get persisted properly
   * @return a String with \n replaced with \r, if input was null or undefined it is simply returned back
   * TODO: Move this method into a utility class
   */
  fixLineBreaks:function (text) {
    if(text){
      var textString = text.toString();
      if(textString){
        return textString.replace(/\n/g, "\r");
      }
    }
    return text;
  },

  commitAndRemoveView: function (){
    var _content = this.get('content');
    var _userNote = Geniverse.userController.get('note');
    if(_userNote != _content){
      //console.warn("Geniverse.userController.get('note'):",_userNote);
      //console.warn("was NOT equal to this.get('content'):",_content);
      //console.warn("calling Geniverse.userController.set('note', this.get('content'));");
      Geniverse.userController.set('note', _content);
    }
    Geniverse.userController.set('note', this.fixLineBreaks(Geniverse.userController.get('note')));
    //console.log("Geniverse.userController.note:", Geniverse.userController.get('note'));
    var wasCommitted = Geniverse.store.commitRecords();
    //console.log("Geniverse.store.commitRecords() returned this.wasCommitted:", this.wasCommitted);
    var receiver = this.pane.remove();
    //console.log("this.pane.remove() returned receiver:", receiver);
    this.set('isEnabledButton', YES);
  },

  updateView: function (newValue) {
    //console.log("this.pane:",this.pane);
    if(this.pane){
      //console.log("updating notepadView's value to:",newValue);
      this.pane.contentView.notepadView.set('value', newValue);
    }
  }

}) ;
