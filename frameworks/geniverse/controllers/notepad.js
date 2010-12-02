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
  wasCommitted: NO,
  lastCommitTime: 0,
  commitDelayPeriod: 10000,
  
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
      alert("You must be logged in first to use your Note Pad.");
    }
  },

  contentDidChange: function() {
//    SC.Logger.log("Geniverse.notepadController.contentDidChange() called");
//    SC.Logger.log("this.content:", this.content);
//    SC.Logger.log("Geniverse.userController.content:", Geniverse.userController.content);
    if(this.wasCommitted != SC.MIXED_STATE){
      var now = new Date().getTime();
      // set this.lastCommitTime if this is the first time it is being used
      if(this.lastCommitTime == 0) this.lastCommitTime = now;
      var elapsedTime = now - this.lastCommitTime;
      SC.Logger.log("elapsedTime:",elapsedTime);
      if(elapsedTime >= this.commitDelayPeriod){
        // TODO: fix bug where the second commit returns __MIXED__ and throws:
        // uncaught exception: SC.Error:sc300:Busy (-1)
        this.wasCommitted = Geniverse.store.commitRecord(
          Geniverse.User,
          Geniverse.userController.get('content').get('id'),
          Geniverse.userController.get('content').get('storeKey')
        );
        SC.Logger.log("after commitRecord: this.wasCommitted:", this.wasCommitted);
      }
    }
    if(this.wasCommitted){
      this.lastCommitTime = new Date().getTime();
    }
  }.observes('content')

}) ;
