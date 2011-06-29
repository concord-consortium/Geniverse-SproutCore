// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.loggedIn = Ki.State.extend({
  
  substatesAreConcurrent: YES,
  
  atLocation: Ki.State.design({
    
    substatesAreConcurrent: NO,
    
    inHomePage: Ki.State.plugin('Lab.inHomePage'),
    inActivity: Ki.State.plugin('Lab.inActivity'),

    startPage: null,
    
    enterState: function() { 
      if (Lab.statechart.getState('atLocation').startPage === "home"){
        Lab.statechart.getState('atLocation').gotoState('inHomePage');
      } else {
        Lab.statechart.getState('atLocation').gotoState('inActivity');
      }
    }
  }),
  
  showingBlogButton: Ki.State.plugin('Lab.showingBlogButton'),
  
  warningUserBeforeLeaving: Ki.State.plugin('Lab.warningUserBeforeLeaving'),
  
  logOut: function() { 
    SC.Request.postUrl(Lab.loginController.logoutUrl,null).header({'Accept': 'application/json'}).json()
      .notify(this, function(){
        Lab.statechart.gotoState('loggedOut');
        })
      .send();
    
    // rm cookies and blank user object
    Lab.loginController.logout();
  },
  
  exitState: function() { 
  }
  
});