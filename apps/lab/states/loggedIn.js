// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.loggedIn = Ki.State.extend({
  
  substatesAreConcurrent: NO,
  
  inHomePage: Ki.State.plugin('Lab.inHomePage'),
  
  inActivity: Ki.State.plugin('Lab.inActivity'),
  
  startPage: null,
  
  enterState: function() { 
    if (Lab.statechart.get('loggedIn').startPage === "home"){
      this.gotoHomePage();
    } else {
      this.gotoState('inActivity');
    }
  },
  
  gotoHomePage: function() {
    Lab.statechart.get('loggedIn').startPage = "home";
    this.gotoState('inHomePage');
  },
      
  gotoActivity: function() {
    Lab.statechart.get('loggedIn').startPage = "activity";
    this.gotoState('inActivity');
  },
  
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