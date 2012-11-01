// ==========================================================================
// Project:   Geniverse.LOGIN
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  The login state.

  @extends SC.Responder
  @version 0.1
*/
Geniverse.LOGIN = SC.Responder.create(
/** @scope Geniverse.LOGIN.prototype */ {

  nextResponder: null,

  //
  didBecomeFirstResponder: function() {
    SC.Logger.log("LOGIN");
    function loadData() {
      if (Geniverse.appController.get('userLoggedIn')){
        Geniverse.appController.removeObserver('loggedIn', loadData);
        Geniverse.makeFirstResponder(Geniverse.LOAD_DATA);
      }
    }

    Geniverse.appController.addObserver('userLoggedIn', loadData);
    Geniverse.appController.checkLoginState();
  }

}) ;
