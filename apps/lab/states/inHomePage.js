// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.inHomePage = Ki.State.extend({

  enterState: function() {
    if (Geniverse.activityController.get('title')) {
      Geniverse.activityController.set('title', "Office");
    } else {
      Geniverse.activityController.set('content', Geniverse.store.createRecord(Geniverse.Activity, {
        title: "Office"
      }));
    }
    Lab.routes.gotoLabRoute({pageName: 'mainPage'});
  },

  exitState: function() {
  }

});
