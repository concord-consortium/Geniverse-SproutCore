// ==========================================================================
// Project:   Lab
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse Ki*/

Lab.inCaselog = Ki.State.extend({

  enterState: function() {
    console.log("Entering caselog state");
    if (Geniverse.activityController.get('title')) {
      Geniverse.activityController.set('title', "Case Log")
    } else {
      Geniverse.activityController.set('content', Geniverse.store.createRecord(Geniverse.Activity, {
        title: "Case Log"
      }));
    }
    Lab.routes.gotoLabRoute({ pageName: 'caselogPage' });
  },

  exitState: function() {
    console.log("Exiting caselog state");
  }

});
