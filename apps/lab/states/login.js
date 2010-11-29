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
  // TODO: most functionality is in login controller now
  // can we move this loggedIn field too?
  finish: function() {
    this.set('userLoggedIn', YES);
  }
}) ;
