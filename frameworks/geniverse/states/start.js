// ==========================================================================
// Project:   Geniverse.START
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  The start state. 

  @extends SC.Responder
  @version 0.1
*/
Geniverse.START = SC.Responder.create(
/** @scope Geniverse.START.prototype */ {

  nextResponder: null,
  
  gwtReady: function() {
    Geniverse.gwtController.removeObserver('isReady', this, 'gwtReady');
    Geniverse.set('isLoaded', YES);
    Geniverse.makeFirstResponder(Geniverse.INIT_ACTIVITY);
  },
  
  // To start the application, first load the first activity. Once it has loaded
  // start the login process
  didBecomeFirstResponder: function() {
    // wait for GWT to load
    Geniverse.gwtController.addObserver('isReady', this, 'gwtReady');
  }
  
  // ..........................................................
  // ACTIONS
  //
  
}) ;
