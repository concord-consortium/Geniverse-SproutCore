// ==========================================================================
// Project:   Lab.START
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab */

/** @class

  (Document Your State Here)

  @extends SC.Responder
  @version 0.1
*/
Lab.START = SC.Responder.create(
/** @scope Lab.DEFAULT.prototype */ {

  /**
    The next state to check if this state does not implement the action.
  */
  nextResponder: null,
  
  didBecomeFirstResponder: function() {
    SC.Logger.log("START");
  },
  
  gotoActivity: function(routeParams) {
    SC.Logger.log("START gotoActivity");
    Lab.ACTIVITY.set('strand', routeParams.strand);                // heredity, ...
    Lab.ACTIVITY.set('level', routeParams.level);                  // apprentice, journeyman, master
    Lab.ACTIVITY.set('activityType', routeParams.activityType);    // intro, individual, group
    Lab.ACTIVITY.set('activityIndex', routeParams.activityIndex);  // 0,1,2
    
    var isLoggedIn = Lab.LOGIN.checkLoginState();
    if (isLoggedIn){
      Lab.makeFirstResponder(Lab.ACTIVITY);
      Lab.ACTIVITY.gotoActivity();
    } else {
      Lab.routes.gotoLabRoute({pageName: 'loginPage'});
      Lab.makeFirstResponder(Lab.LOGIN);
      Lab.LOGIN.addObserver('userLoggedIn', Lab.ACTIVITY, 'gotoActivity');
    }
  },
  
  gotoHomePage: function() {
    SC.Logger.log("START gotoHomePage");
    var isLoggedIn = Lab.LOGIN.checkLoginState();
    if (isLoggedIn){
      Lab.makeFirstResponder(Lab.ACTIVITY);
      Lab.routes.gotoLabRoute({pageName: 'mainPage'});
    } else {
      Lab.routes.gotoLabRoute({pageName: 'loginPage'});
      Lab.makeFirstResponder(Lab.LOGIN);
      Lab.LOGIN.addObserver('userLoggedIn', this, 'gotoHomePage');
    }
  },
  
  willLoseFirstResponder: function() {
    // Called when this state loses first responder
    // SC.Logger.info("Now removing default page");
    // Lab.getPath('trainingPage.mainPane').remove() ;
  }
  
  // ..........................................................
  // EVENTS
  //
  
  // add event handlers here
  // someAction: function() {
  //   
  // }
  
}) ;
