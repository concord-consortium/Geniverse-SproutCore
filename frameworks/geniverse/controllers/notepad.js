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
  store: Geniverse.store,
  
  showPane: function() {
    var username = Geniverse.loginController.username;
    if(username){
      SC.Logger.log("showPane called with username:",username);
      var query = SC.Query.local(Geniverse.NoteRecord, {conditions: 'username = "' + username + '"'});
      SC.Logger.log("findNoteRecord: about to call find with query:",query);
      var noteRecords = this.store.find(query);
      SC.Logger.log("noteRecords:",noteRecords);
      SC.Logger.log("noteRecords.get('status'):",noteRecords.get('status'));
      var noteRecord = noteRecords.firstObject();
      SC.Logger.log("noteRecord:",noteRecord);
      if(noteRecord == undefined){
        SC.Logger.warn("noteRecord was undefined so setting Note Pad content to empty string");
        this.set('content', "");
      }else{
        this.set('content', noteRecord.text);
      }
      SC.Logger.log("this.get('content'):",this.get('content'));
      if (!this.get('pane').get('isVisibleInWindow')){
        this.get('pane').append();
      }
    }else {
      alert("You must be logged in first to use the Note Pad.");
    }
  }
}) ;
