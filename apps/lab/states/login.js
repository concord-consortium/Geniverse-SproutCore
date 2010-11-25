// ==========================================================================
// Project:   Lab.LOGIN
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat SHA256 */

/** @class

  (Document Your State Here)

  @extends SC.Responder
  @version 0.1
*/
Lab.LOGIN = SC.Responder.create(
/** @scope Lab.DEFAULT.prototype */ {

  /**
    The next state to check if this state does not implement the action.
  */
  nextResponder: null,
  
  userLoggedIn: NO,
  didBecomeFirstResponder: function() {
    SC.Logger.log("LOGIN");
    Lab.loginController.showCheckPanel();
  },

  willLoseFirstResponder: function() {
    // Called when this state loses first responder
  },
  
  // ..........................................................
  // EVENTS
  //
  
  start: function() {
    var user = Geniverse.userController.get('content');
    SC.Logger.log("starting up");
    Lab.userDefaults.writeDefault('username', user.get('username'));
    Lab.userDefaults.writeDefault('groupNumber',Lab.loginController.get('groupNumber')); 
    Lab.userDefaults.writeDefault('memberNumber',Lab.loginController.get('memberNumber'));
    
    CcChat.chatController.set('username', user.get('username'));
    Lab.loginController.set('loggedIn', YES);
    
    this.set('userLoggedIn', YES);
    Lab.loginController.hidePanel();
  }
}) ;
