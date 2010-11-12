// ==========================================================================
// Project:   Geniverse
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
// an extension of the SC.Page object to allow us to index all created pages
SC.Page = SC.Page.extend({
  init: function() {
    sc_super();
    
    var pages = SC.Page.instances;
    if (!pages) {
      pages = SC.Page.instances = [];
    }
    pages.push(this);
  }
});

Geniverse = SC.Application.create(
  /** @scope Geniverse.prototype */ {

  NAMESPACE: 'Geniverse',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  
  // store: SC.Store.create().from(SC.Record.fixtures),
  store: SC.Store.create().from('Geniverse.RailsDataSource'),
  
  userDefaults: SC.UserDefaults.create({appDomain: "Geniverse"}),
  
  railsBackedTypes: [],
  
  // TODO: Add global constants or singleton objects needed by your app here.
  
  isLoaded: NO

}) ;

Geniverse.NO_DRAGON = {imageURL: sc_static("question-mark.png") };
