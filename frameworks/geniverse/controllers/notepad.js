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
  pane: Geniverse.NotepadView,
  contentBinding: 'Geniverse.userController*content.note',

  showPane: function() {
    SC.Logger.log("Geniverse.notepadController.showPane called");
    var username = Geniverse.userController.get('username');
    SC.Logger.log("Geniverse.userController.get('username'):",username);
    if(username){
      var note = Geniverse.userController.get('note');
      SC.Logger.log("user's note:",note);
      if (!this.get('pane').get('isVisibleInWindow')){
        this.get('pane').append();
        this.updateView(this.get('content'));
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

  // TODO: Persist linefeeds properly
  commitAndRemoveView: function (){
    var _content = this.get('content');
    var _userNote = Geniverse.userController.get('note');
    if(_userNote != _content){
      //console.warn("Geniverse.userController.get('note'):",_userNote);
      //console.warn("was NOT equal to this.get('content'):",_content);
      //console.warn("calling Geniverse.userController.set('note', this.get('content'));");
      Geniverse.userController.set('note', _content);
    }
    //console.log("Geniverse.userController.note:", Geniverse.userController.get('note'));
    var wasCommitted = Geniverse.store.commitRecords();
    //console.log("Geniverse.store.commitRecords() returned this.wasCommitted:", this.wasCommitted);
    var receiver = this.pane.remove();
    //console.log("this.pane.remove() returned receiver:", receiver);
  },

  updateView: function (newValue) {
    //console.log("updating view's value to:",newValue);
    this.pane.contentView.notepadView.set('value', newValue);
  }

}) ;
