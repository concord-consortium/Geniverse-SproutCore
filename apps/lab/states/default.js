// ==========================================================================
// Project:   Lab.DEFAULT
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab */

/** @class

  (Document Your State Here)

  @extends SC.Responder
  @version 0.1
*/
Lab.DEFAULT = SC.Responder.create(
/** @scope Lab.DEFAULT.prototype */ {

  /**
    The next state to check if this state does not implement the action.
  */
  nextResponder: null,
  
  didBecomeFirstResponder: function() {
    // Called when this state becomes first responder
    SC.Logger.info("Now showing default page");
    Lab.getPath('trainingPage.mainPane').append() ;
  },
  
  willLoseFirstResponder: function() {
    // Called when this state loses first responder
    SC.Logger.info("Now removing default page");
    Lab.getPath('mainPage.mainPane').remove() ;
  }
  
  // ..........................................................
  // EVENTS
  //
  
  // add event handlers here
  // someAction: function() {
  //   
  // }
  
}) ;
