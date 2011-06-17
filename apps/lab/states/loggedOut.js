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
    Lab.loginController.showCheckPanel();
  },
  
  // this and gotoActivity just set this property for later
  gotoHomePage: function() {
    Lab.statechart.get('loggedIn').startPage = 'home';
  },

  gotoActivity: function() {
    Lab.statechart.get('loggedIn').startPage = 'activity';
  },
   
  logIn: function() { 
    this.gotoState('loggedIn');
  },
  
  exitState: function() { 
  }
});