// ==========================================================================
// Project:   Lab.HEREDITY_APPRENTICE_INDIVIDUAL
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab */

/** @class

  (Document Your State Here)

  @extends SC.Responder
  @version 0.1
*/
Lab.HEREDITY_APPRENTICE_INDIVIDUAL = SC.Responder.create(
/** @scope Lab.HEREDITY_APPRENTICE_INDIVIDUAL.prototype */ {

  /**
    The next state to check if this state does not implement the action.
  */
  nextResponder: null,
  
  didBecomeFirstResponder: function() {
    // Called when this state becomes first responder
    SC.Logger.info("Now showing heredity apprentice individual page");
    Lab.getPath('heredityApprenticeIndividualPage.mainPane').append();
  },
  
  willLoseFirstResponder: function() {
    // Called when this state loses first responder
    SC.Logger.info("Now removing heredity apprentice individual page");
    Lab.getPath('heredityApprenticeIndividualPage.mainPane').remove();
  },
  
  // ..........................................................
  // EVENTS
  //
  
  // add event handlers here
  someAction: function() {
    
  }
  
}) ;
