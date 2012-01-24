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
    inCaselog:  Ki.State.plugin('Lab.inCaselog'),

    startPage: null,
    
    enterState: function() {
      switch (this.startPage) {
        case 'home':
          this.gotoState('inHomePage');
          break;
        case 'activity':
          this.gotoState('inActivity');
          break;
        case 'caselog':
          this.gotoState('inCaselog');
          break;
        default:
          throw new Error("Lab.loggedIn.atLocation.startPage was set to an unexpected value, '%@'".fmt(this.startPage));
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