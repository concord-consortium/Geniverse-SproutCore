// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.loggedOut =  Ki.State.extend({

  enterState: function() {
    Lab.routes.gotoLabRoute({pageName: 'loginPage', paneName: 'mainPane'});
    Lab.loginController.checkCCAuthToken();
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

  gotoAvatarPage: function() {
    Lab.statechart.getState('atLocation').startPage = 'avatar';
  },

  logIn: function() {
    this.gotoState('loggedIn');
  },

  exitState: function() {
  }
});
