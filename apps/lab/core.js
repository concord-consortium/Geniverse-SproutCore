// ==========================================================================
// Project:   Lab
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
Lab = SC.Application.create(
  /** @scope Lab.prototype */ {

  NAMESPACE: 'Lab',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  store: SC.Store.create().from(SC.Record.fixtures),
  
  // TODO: Add global constants or singleton objects needed by your app here.
  routeHandler: function(route) {
    // SC.Logger.dir(route);
    window.route = route;
    if (route.level == "Apprentice") {
      if (route.module == "Heredity") {
        if (route.activity == "Intro") {
          SC.Logger.warn("Matched heredity intro route: " + route);
          Lab.makeFirstResponder(Lab.HEREDITY_INTRO);
        } else if (route.activity == "Individual") {
          SC.Logger.warn("Matched heredity apprentice individual: " + route);
          Lab.makeFirstResponder(Lab.HEREDITY_APPRENTICE_INDIVIDUAL);
        } else {
          SC.Logger.warn("Didn't know route: " + route);
        }
      } else {
        SC.Logger.warn("Didn't know route: " + route);
      }
    } else {
      SC.Logger.warn("Didn't know route: " + route);
    }
  }

}) ;