// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.inHomePage = Ki.State.extend({
  dummyActivity: null,

  enterState: function() {
    var dummy = this.get('dummyActivity');
    if (!dummy) {
      dummy = Geniverse.store.createRecord(Geniverse.Activity, {
        title: "Office"
      });
      this.set('dummyActivity', dummy);
    }
    Geniverse.activityController.set('content', dummy);
    Lab.routes.gotoLabRoute({pageName: 'mainPage'});
  },

  exitState: function() {
  }

});
