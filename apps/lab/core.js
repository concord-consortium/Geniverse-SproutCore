// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab SC */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Page
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


Lab = SC.Application.create(
/** @scope Lab.prototype */
{

    NAMESPACE: 'Lab',
    VERSION: '0.1.0',

    // This is your application store.  You will use this store to access all
    // of your model data.  You can also set a data source on this store to
    // connect to a backend server.  The default setup below connects the store
    // to any fixtures you define.
    store: SC.Store.create().from(SC.Record.fixtures),

    // TODO: Add global constants or singleton objects needed by your app here.
    userDefaults: SC.UserDefaults.create({appDomain: "Lab"})

});