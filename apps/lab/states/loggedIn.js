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
    inEndingHub: Ki.State.plugin('Lab.inEndingHub'),

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

    gotoEndingHub: function() {
      this.startPage = 'endingHub';
      this.get('statechart').sendAction('gotoRequestedPage');
    },

    gotoRequestedPage: function() {
      console.log("going to page");
      switch (this.startPage || 'home') {
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
        case 'endingHub':
          this.gotoState('inEndingHub');
          break;
        default:
          throw new Error(
            "Lab.statechart.loggedIn.atLocation.startPage was set to an unexpected value, '%@'".fmt(this.startPage));
      }
    },

    exitState: function() {
      // clear start page
      this.startPage = null;
    }

  }),

  enterState: function() {
    console.log("woo!");

    /** WARNING MESSAGE **/

    // reveal warning message
    $('#demo-warning').delay(1000).animate({'top': 0});

    $('.dismiss-warning').click(function(){
      $(this).parent().animate({'top': '-40px'});
    });

  },

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
    // clear fragment identifier from navigation bar
    if (history && history.pushState) {
      history.pushState('', document.title, window.location.pathname);
    } else {
      // this notifies app of statechange so is not as good...
      window.location.hash = '';
    }
  }

});
