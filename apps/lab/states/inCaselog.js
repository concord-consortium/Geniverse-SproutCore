// ==========================================================================
// Project:   Lab
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse Ki*/

Lab.inCaselog = Ki.State.extend({

  enterState: function() {
    var dummy = this.get('dummyActivity');
    if (!dummy) {
      dummy = Geniverse.store.createRecord(Geniverse.Activity, {
        title: "Case Log"
      });
      this.set('dummyActivity', dummy);
    }
    Geniverse.activityController.set('content', dummy);
    Lab.routes.gotoLabRoute({ pageName: 'caselogPage' });
  },

  exitState: function() {
    console.log("Exiting caselog state");
  }

});
