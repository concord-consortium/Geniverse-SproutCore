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
  
  // To start the application, first load the first activity. Once it has loaded
  // start the login process
  didBecomeFirstResponder: function() {
    SC.Logger.log("START");
    var activityQuery = Geniverse.ACTIVITIES_QUERY;
    var activities = Geniverse.store.find(activityQuery);

    function setActivity() {
		// using objectAt because "lastObject" seems missing from SC.Enumerable mixin
        Geniverse.activityController.set('content', activities.objectAt(activities.get('length') - 1)); 
        // log in automatically if UserDefaults found, or wait for user to log in
        activities.removeObserver('status', setActivity);
        Geniverse.makeFirstResponder(Geniverse.LOGIN);
    }

    // if activities status is immediately READY_CLEAN, then we are loading from fixtures,
    // so we can begin immediately. Otherwise, wait for activities to be loaded from
    // remote data source
    if (activities.get('status') === SC.Record.READY_CLEAN) {
        setActivity();
    } else {
        activities.addObserver('status', setActivity);
    }
  }
  
  // ..........................................................
  // ACTIONS
  //
  
}) ;
