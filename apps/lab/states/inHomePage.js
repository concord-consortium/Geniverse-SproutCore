// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.inHomePage = Ki.State.extend({

  enterState: function() {
    Lab.routes.gotoLabRoute({pageName: 'mainPage'});
  },

  exitState: function() {
  }

});
