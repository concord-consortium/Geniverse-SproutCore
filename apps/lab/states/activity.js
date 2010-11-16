// ==========================================================================
// Project:   Lab.ACTIVITY
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab */

/** @class

  (Document Your State Here)

  @extends SC.Responder
  @version 0.1
*/
Lab.ACTIVITY = SC.Responder.create(
/** @scope Lab.DEFAULT.prototype */ {

  strand: null,
  level: null,
  activityType: null,
  activityIndex: null,
  
  /**
    The next state to check if this state does not implement the action.
  */
  nextResponder: null,
  
  didBecomeFirstResponder: function() {
    SC.Logger.log("ACTIVITY");
  },
  
  willLoseFirstResponder: function() {
    // Called when this state loses first responder
    // SC.Logger.info("Now removing default page");
    // Lab.getPath('trainingPage.mainPane').remove() ;
  },
  
  // ..........................................................
  // EVENTS
  //
  
  gotoActivity: function() {
    Lab.makeFirstResponder(this);
    
    SC.Logger.log("ACTIVITY gotoActivity");
    if (this.get('level') === 'training'){
      Lab.routes.gotoLabRoute({pageName: 'chromosomeTrainingPage'});
    } else {
      Lab.routes.gotoLabRoute({pageName: 'breedingPage'});
    }
  },
  
  logout: function() {
    SC.Logger.info("logging out %s", CcChat.chatController.get('username'));
    
    CcChat.chatController.set('username', '');
    Lab.LOGIN.set('userLoggedIn', NO);
    
    Lab.userDefaults.writeDefault('username', '');
    Lab.userDefaults.writeDefault('chatroom', '');
    
    Lab.makeFirstResponder(Lab.START);
    
    SC.routes.set('location', '');
    window.location.reload();
  }
  
}) ;
