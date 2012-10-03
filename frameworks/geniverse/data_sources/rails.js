// ==========================================================================
// Project:   Geniverse.RailsDataSource
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

// TODO: improve this query
sc_require('models/dragon');
Geniverse.DRAGONS_QUERY = SC.Query.local(Geniverse.Dragon, {
  orderBy: 'name'
});

/** @class

  // TODO: (Document Your Data Source Here)

  @extends SC.DataSource
*/
Geniverse.RailsDataSource = SC.DataSource.extend(
/** @scope Geniverse.RailsDataSource.prototype */ {

  _jsonGet: function(url, callback, params){
    // replace the url with 'this'
    // so we can pass the params to notify
    params = SC.A(arguments).slice(1);
    params.unshift(this);

    var request = SC.Request.getUrl(url).header({
      'Accept': 'application/json'
    }).json();
    request.notify.apply(request, params);

    // SC.Logger.log('request.address: %s', request.address);
    // SC.Logger.log('request: ', request);
    request.send();
  },

  // ..........................................................
  // QUERY SUPPORT
  //
  fetch: function(store, query) {
    if (query.LOCAL_SEARCH_ONLY) {
      // this.didFetchRecords([], store, query);
      return NO;
    }
    var recordType = query.recordType;
    if (Geniverse.railsBackedTypes.indexOf(recordType.modelName) != -1) {
      var paramString = query.restParams ? query.restParams : "";
      var endpoint = '/rails/%@.json%@'.fmt(recordType.modelsName, paramString);
      this._jsonGet(endpoint, 'didFetchRecords', store, query);
      return YES;
    }

    // if (query === Geniverse.ACTIVITIES_QUERY) {
    //   SC.Logger.log('query === Geniverse.ACTIVITIES_QUERY', query);
    //   this._jsonGet('/rails/activities', 'didFetchActivities', store, query);
    //
    //   SC.Logger.groupEnd();
    //   return YES;
    // }

    // SC.Logger.log('not a rails backed query', query);
    // SC.Logger.groupEnd();
    return NO; // return YES if you handled the query
  },

  didFetchRecords: function(response, store, query) {
    // SC.Logger.group('Geniverse.RailsDataSource.didFetchRecords');
    // SC.Logger.log('response.status = %d', response.get('status'));
    // SC.Logger.log("response: ", response);

    if (SC.ok(response)) {
      // SC.Logger.log('SC.ok(response) is YES; processing content');
      var content = response.get('body').content;
      // SC.Logger.log('response.body.content: ', content);
      var recordType = query.recordType;
      store.loadRecords(recordType, content);

      store.dataSourceDidFetchQuery(query);
    } else {
      store.dataSourceDidErrorQuery(query, response);
    }

    // SC.Logger.groupEnd();
  },

  // ..........................................................
  // RECORD SUPPORT
  //
  retrieveRecord: function(store, storeKey) {
    // SC.Logger.log('Geniverse.RailsDataSource.retrieveRecord');
    // guid will be rails url e.g. /rails/questions/1
    var guid = store.idFor(storeKey);

    this._jsonGet('%@.json'.fmt(guid), 'didRetrieveRecord', store, storeKey);

    return YES; // return YES if you handled the storeKey
  },

  didRetrieveRecord: function(response, store, storeKey) {
    // SC.Logger.group('Geniverse.RailsDataSource.didRetrieveRecord()');

    // SC.Logger.log('response.status = %d', response.get('status'));
    // SC.Logger.log("response: ", response);

    if (SC.ok(response)) {
      // SC.Logger.log('SC.ok(response) is YES; processing content');
      var content = response.get('body').content;
      // SC.Logger.log('response.body.content: ', content);

      // SC.Logger.group('store.dataSourceDidComplete(storeKey, content)');
      store.dataSourceDidComplete(storeKey, content);
      // SC.Logger.groupEnd();
    } else store.dataSourceDidError(storeKey);

    // SC.Logger.groupEnd();
  },


  createRecord: function(store, storeKey) {
    var recordType = store.recordTypeFor(storeKey);
    if (Geniverse.railsBackedTypes.indexOf(recordType.modelName) != -1) {
      if (recordType.readOnly) {
        // pretend like we saved
        window.setTimeout(function() {
          store.dataSourceDidComplete(storeKey);
        }, 2);
      } else {
        var modelName = recordType.modelName;
        var modelHash = {};
        modelHash[modelName] = store.readDataHash(storeKey);
        // SC.Logger.dir(modelHash);
        //delete modelHash[modelName]['guid'];    // remove guid property before sending to rails

        // SC.Logger.group('Geniverse.RailsDataSource.createRecord()');
        SC.Request.postUrl('/rails/' + recordType.modelsName).header({
                       'Accept': 'application/json'
                   }).json().notify(this, this.didCreateRecord, store, storeKey).send(modelHash);
        // SC.Logger.groupEnd();
      }
      return YES;
    }
    return NO;
  },

  didCreateRecord: function(response, store, storeKey) {
    if (SC.ok(response)) {
      // Adapted from parseUri 1.2.2
      // (c) Steven Levithan <stevenlevithan.com>
      // MIT License
      var parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
      var url = parser.exec(response.header('Location'))[8];
      store.dataSourceDidComplete(storeKey, null, url); // update url
    } else { store.dataSourceDidError(storeKey, response); }
  },

  updateRecord: function(store, storeKey) {

    // TODO: Add handlers to submit modified record to the data source
    // call store.dataSourceDidComplete(storeKey) when done.
    // return NO ; // return YES if you handled the storeKey
    //
    var recordType = store.recordTypeFor(storeKey);
    if (Geniverse.railsBackedTypes.indexOf(recordType.modelName) != -1) {
      if (recordType.readOnly) {
        // pretend like we saved
        window.setTimeout(function() {
          store.dataSourceDidComplete(storeKey);
        }, 2);
      } else {
        var modelName = recordType.modelName;
        var modelHash = {};
        modelHash[modelName] = store.readDataHash(storeKey);
        // SC.Logger.dir(modelHash);
        var url = store.idFor(storeKey);
        // SC.Logger.info("updateRecord called with: %s", url);


        // SC.Logger.group('Geniverse.RailsDataSource.createRecord()');
        SC.Request.putUrl(url + '.json').header({
                       'Accept': 'application/json'
                   }).json().notify(this, this.didUpdateRecord, store, storeKey).send(modelHash);
        // SC.Logger.groupEnd();
      }
      return YES;
    }
    return NO;
  },

  //
  didUpdateRecord: function(response, store, storeKey) {
    if (SC.ok(response)) {
      var url = store.idFor(storeKey);
      try {
        store.dataSourceDidComplete(storeKey, null, url); // update url
      } catch (e) {
        SC.Logger.error("Error in dataSourceDidComplete for ", storeKey, url);
      }
    } else { store.dataSourceDidError(storeKey, response); }
  },

  destroyRecord: function(store, storeKey) {

    // TODO: Add handlers to destroy records on the data source.
    // call store.dataSourceDidDestroy(storeKey) when done
    // FIXME Right now we're relying on the fact that we're not sending destroy event to the rails backend
    // in order to destroy a record in local memory. If we start sending these to the backend, we'll have to
    // find a way to locally destroy a record without sending that fact to the backend.
    window.setTimeout(function() {
      store.dataSourceDidDestroy(storeKey);
    },2);
    return YES ; // return YES if you handled the storeKey
  }

}) ;
