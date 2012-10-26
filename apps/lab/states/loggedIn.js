// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.loggedIn = Ki.State.extend({
  
  substatesAreConcurrent: YES,
  
  atLocation: Ki.State.design({
    
    substatesAreConcurrent: NO,
    initialSubstate: 'empty',

    inHomePage: Ki.State.plugin('Lab.inHomePage'),
    inActivity: Ki.State.plugin('Lab.inActivity'),
    inCaselog:  Ki.State.plugin('Lab.inCaselog'),
    inAvatar:   Ki.State.plugin('Lab.inAvatar'),

    empty: Ki.State.design(),

    startPage: null,
    
    enterState: function() {
      avatar = Geniverse.userController.get('avatar');
      if (typeof(avatar) == "undefined" || avatar === null || avatar === "") {
        Lab.statechart.getState('atLocation').startPage = 'avatar';
      }

      this.get('statechart').sendAction('gotoRequestedPage');
    },
    
    gotoHomePage: function() {
      this.startPage = 'home';
      this.get('statechart').sendAction('gotoRequestedPage');
    },
    
    gotoCaselog: function() {
      this.startPage = 'caselog';
      this.get('statechart').sendAction('gotoRequestedPage');
    },
    
    gotoActivity: function() {
      this.startPage = 'activity';
      this.get('statechart').sendAction('gotoRequestedPage');
    },
    
    gotoAvatarPage: function() {
      this.startPage = 'avatar';
      this.get('statechart').sendAction('gotoRequestedPage');
    },

    gotoRequestedPage: function() {
      console.log("going to page");
      switch (this.startPage) {
        case 'home':
          this.gotoState('inHomePage');
          break;
        case 'caselog':
          this.gotoState('inCaselog');
          break;
        case 'activity':
          this.gotoState('inActivity');
          break;          
        case 'avatar':
          this.gotoState('inAvatar');
          break;
        default:
          throw new Error(
            "Lab.statechart.loggedIn.atLocation.startPage was set to an unexpected value, '%@'".fmt(this.startPage));
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
