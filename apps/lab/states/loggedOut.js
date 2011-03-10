// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.loggedOut =  Ki.State.extend({
  
  // showCheckPanel() will handle logging in. This logic
  // may be moved into here later
  enterState: function() {
    Lab.routes.gotoLabRoute('loginPage');
    Lab.loginController.autoLogin("User", "User", "user");
  },
  
  // this and gotoActivity just set this property for later
  gotoHomePage: function() {
    Lab.statechart.getState('atLocation').startPage = 'home';
  },
  
  gotoCaselog: function() {
    Lab.statechart.getState('atLocation').startPage = 'caselog';
  },

  gotoActivity: function() {
    Lab.statechart.getState('atLocation').startPage = 'activity';
  },
   
  logIn: function() { 
    this.gotoState('loggedIn');
  },
  
  exitState: function() { 
  }
});
