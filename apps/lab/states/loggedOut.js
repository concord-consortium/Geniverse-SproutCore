// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.loggedOut =  Ki.State.extend({

  enterState: function() {
    Lab.routes.gotoLabRoute({pageName: 'loadAssetsPage', paneName: 'mainPane'});
    this.get('statechart').sendAction('loadAssets');
  },

  loadAssets: function() {
    var _this = this;
    var assets = $.preloadCssImages({
      statusTextEl: "#loadingStatus",
      showImageName: false,
      onComplete: function() {
        _this.get('statechart').sendAction('gotoLogin');
      }
    });
  },

  gotoLogin: function() {
    if ($.cookie("avatar")) {
      Lab.loginController.autoLogin("User", "User", "user");
    } else {
      Lab.routes.gotoLabRoute({pageName: 'loginPage', paneName: 'mainPane'});
    }
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

  gotoEndingHub: function() {
    Lab.statechart.getState('atLocation').startPage = 'endingHub';
  },

  logIn: function() {
    this.gotoState('loggedIn');
  },

  exitState: function() {
  }
});
