// ==========================================================================
// Project:   Geniverse.INIT_ACTIVITY
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your State Here)

  @extends SC.Responder
  @version 0.1
*/
Geniverse.INIT_ACTIVITY = SC.Responder.create(
/** @scope Geniverse.INIT_ACTIVITY.prototype */ {

  /**
    The next state to check if this state does not implement the action.
  */
  nextResponder: null,

  didBecomeFirstResponder: function() {
    SC.Logger.log("INIT_ACTIVITY");
    var activityQuery = Geniverse.ACTIVITIES_QUERY;
    var activities = Geniverse.store.find(activityQuery);

    function setActivity() {
      if (activities.get('status') === SC.Record.READY_CLEAN) {
        // using objectAt because "lastObject" seems missing from SC.Enumerable mixin
        //Geniverse.activityController.set('content', activities.lastObject() );
        //
        //Try to find the activity matching our title
        var last  = activities.lastObject();
        var found = activities.find(function(act) {
          var title = act.get('title');
          if (title == Geniverse.activityController.get('activityTitle')) {
            SC.Logger.info("Using activity named: %s", title);
            return YES;
          } else {
            SC.Logger.info("found non-matching activitiy named:_%s_", title);
          }
        });
        if (found === null || found === undefined) {
          SC.Logger.info("Could not find activity matching: %s", Geniverse.activityController.get('activityTitle'));
          found = last;
        }
        Geniverse.activityController.set('content', found);
        // log in automatically if UserDefaults found, or wait for user to log in
        activities.removeObserver('status', setActivity);
        Geniverse.makeFirstResponder(Geniverse.LOGIN);
      }
    }

    // if activities status is immediately READY_CLEAN, then we are loading from fixtures,
    // so we can begin immediately. Otherwise, wait for activities to be loaded from
    // remote data source
    if (activities.get('status') === SC.Record.READY_CLEAN) {
        setActivity();
    } else {
        activities.addObserver('status', setActivity);
    }
  },

  willLoseFirstResponder: function() {
    // Called when this state loses first responder
  }

}) ;
