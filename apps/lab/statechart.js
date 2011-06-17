// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab SC Ki console*/

Lab.statechart = Ki.Statechart.create({

  initialState: 'loggedOut',

  'loggedOut': Ki.State.design({
    
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
  }),

  'loggedIn': Ki.State.design({
    
    startPage: null,
    
    enterState: function() { 
      if (Lab.statechart.get('loggedIn').startPage === "home"){
        this.gotoHomePage();
      } else {
        this.gotoActivity();
      }
    },
    
    gotoHomePage: function() {
      Lab.statechart.get('loggedIn').startPage = "home";
      Lab.makeFirstResponder(Lab.ACTIVITY);
      Lab.routes.gotoLabRoute({pageName: 'mainPage'});
    },
        
    gotoActivity: function() {
      Lab.statechart.get('loggedIn').startPage = "activity";
      Lab.ACTIVITY.gotoActivity();
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
      // remove the main pane 
    }
    
  })

});