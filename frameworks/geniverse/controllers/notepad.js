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
  contentBinding: 'Geniverse.userController.content.note',
  
  showPane: function() {
    var username = Geniverse.loginController.username;
    if(username){
      SC.Logger.log("showPane called with username:",username);
      var note = Geniverse.userController.get('content').get('note');
      SC.Logger.log("user's note:",note);
      if (!this.get('pane').get('isVisibleInWindow')){
        this.get('pane').append();
      }
    }else {
      alert("You must be logged in first to use the Note Pad.");
    }
  }
}) ;
