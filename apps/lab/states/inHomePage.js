// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.inHomePage = Ki.State.extend({
  
  enterState: function() { 
    Lab.routes.gotoLabRoute({pageName: 'mainPage'});
  },
  
  gotoActivity: function() {
    Lab.statechart.getState('atLocation').startPage = "activity";
    this.gotoState('inActivity');
  },
  
  exitState: function() { 
  }
  
});