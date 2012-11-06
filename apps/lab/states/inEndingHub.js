// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.inEndingHub = Ki.State.extend({
  enterState: function() {
    Lab.routes.gotoLabRoute({pageName: 'mainPage'});
    var unlocked = Geniverse.unlockablesController.unlockFor('endingHub', true);
    if (unlocked.length > 0) {
      Geniverse.unlockablesController.set('selectedUnlockable', unlocked[0]);
    }
    Geniverse.store.commitRecords();
  },

  exitState: function() {
  }

});
