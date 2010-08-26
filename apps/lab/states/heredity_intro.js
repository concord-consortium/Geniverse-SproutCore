// ==========================================================================
// Project:   Lab.HEREDITY_INTRO
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab */

/** @class

  (Document Your State Here)

  @extends SC.Responder
  @version 0.1
*/
Lab.HEREDITY_INTRO = SC.Responder.create(
/** @scope Lab.HEREDITY_INTRO.prototype */ {

  /**
    The next state to check if this state does not implement the action.
  */
  nextResponder: null,
  
  didBecomeFirstResponder: function() {
    // Called when this state becomes first responder
    SC.Logger.info("Now showing heredity intro page");
    Lab.getPath('mainPage.mainPane').remove();
    Lab.getPath('heredityIntroPage.mainPane').append();
  },
  
  willLoseFirstResponder: function() {
    // Called when this state loses first responder
  }
  
  // ..........................................................
  // EVENTS
  //
  
  // add event handlers here
  // someAction: function() {
  //     
  //   }
  
}) ;
