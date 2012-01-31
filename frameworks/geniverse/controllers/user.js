// ==========================================================================
// Project:   Geniverse.userController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse SHA_1_sha1Hash SHA256 */

/** @class

  //TODO: (Document Your Controller Here)

  @extends SC.ObjectController
*/
Geniverse.userController = SC.ObjectController.create(
/** @scope Geniverse.userController.prototype */ {

  // TODO: Add your own code here.
  usernameBinding: '*user.username',

  createUser: function (username, password){
    if (!password) { password = ""; }
    var passwordHash = SHA256(password);
    var user = Geniverse.store.createRecord(Geniverse.User, {
      username: username,
      passwordHash: passwordHash,
      groupId: 1,
      memberId: 1,
      note: ""
    });
    this.set('content', user);
    Geniverse.store.commitRecords();
    return user;
  },
  
  findUser: function (username, callback) {
    var self = this;
    var query = SC.Query.local(Geniverse.User, 
      {
        conditions: 'username = "' + username + '"',
        restParams: Geniverse.makeRestParams({
          username: username
        })
    });
    var users = Geniverse.store.find(query);
    var sendFoundUser = function() {
        var user = users.firstObject();
        callback(user);
    };
    self.doWhenReady(self,users,sendFoundUser);
  },

  doWhenReady: function(context, field, method) {
    var self = context;
    var outer = this;
    var checkStatus = function() {
      var status = field.get('status');
      if (status & SC.Record.READY_CLEAN) {
        field.removeObserver('status', outer, checkStatus);
        method.call(context);
      }
      else {
        field.addObserver('status', outer, checkStatus);
      }
    };
    checkStatus();
  },

  findOrCreateUser: function(username, callback) {      
    var self = this;
    var nextMethod = function(user) {
      if (user) {
        SC.Logger.log("found user %@", user);
        callback(user);
      }
      else {
        user = self.createUser(username);
        SC.Logger.log("couldn't find user %@", username);
        var method = function() {
          SC.Logger.log("created username %@", username);
          callback(user);
        };
        self.doWhenReady(self, user, method);
      }
    };
    self.findUser(username,nextMethod);
  },

  getUserMetadata: function() {
    var meta = this.get('metadata');
    if (!meta) {
      meta = {};
    }
    return meta;
  },

  setUserMetadata: function(metadata) {
    var user = this.get('content');
    user.set('metadata', metadata);
    user.recordDidChange();
  },

  // this could get moved into its own controller, if we want
  setPageStars: function(pageId, numStars) {
    var meta = Geniverse.userController.getUserMetadata();
    if (!meta.stars) {
      meta.stars = {};
    }
    if (!meta.stars[pageId]) {
     meta.stars[pageId] = [];
    }
    meta.stars[pageId].push(numStars);
    Geniverse.userController.setUserMetadata(meta);
  }
}) ;
