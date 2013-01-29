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

  isAccelerated: function() {
    return this.getUserMetadata().accelerated || NO;
  }.property('*user','*user.metadata.accelerated'),

  setAccelerated: function(accel) {
    var meta = this.getUserMetadata();
    meta.accelerated = accel;
    this.setUserMetadata(meta);
    Geniverse.store.commitRecords();
  },

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
    Geniverse.doWhenReadyClean(self,users,sendFoundUser);
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
        Geniverse.doWhenReadyClean(self, user, method);
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

  isUnlocked: function(caseLevel, caseTitle) {
    var meta = this.getUserMetadata();
    if (meta.unlockedCases && meta.unlockedCases[caseLevel]) {
      return meta.unlockedCases[caseLevel][caseTitle] || false;
    }
    return false;
  },

  setUnlocked: function(caseLevel, caseTitle) {
    var meta = this.getUserMetadata();
    if (!meta.unlockedCases) {
      meta.unlockedCases = {};
    }
    if (!meta.unlockedCases[caseLevel]) {
      meta.unlockedCases[caseLevel] = {};
    }
    meta.unlockedCases[caseLevel][caseTitle] = true;
    this.setUserMetadata(meta);
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
    var now = new Date();
    var timeStr = now.format("yyyy-MM-dd ") + now.toTimeString().replace(/ \(.*\)/, '');
    meta.stars[pageId].push({stars: numStars, time: timeStr});

    // TODO Do we bother to convert all the old data to the new format?
    // from; stars[pageId] == [1,3,2,3,2] to stars[pageId] == [{...}, {...}, {...}, {...}]

    Geniverse.userController.setUserMetadata(meta);
  },

  getPageStars: function(pageId) {
    var userMetadata = this.getUserMetadata(),
        stars        = userMetadata.stars || {},
        activityStarsListTemp = stars[pageId] || [],
        activityStarsList = [];

        for (var i = 0; i < activityStarsListTemp.length; i++) {
          var s = activityStarsListTemp[i];
          var d = 0;
          if (typeof(s) == "object") {
            d = s.stars || 0;
          } else if (typeof(s) == "number") {
            d = s;
          }
          activityStarsList.push(d);
        }
    return Math.max.apply([], [0].concat(activityStarsList));
  },

  saveBlogDraft: function(pageId) {
    var meta = Geniverse.userController.getUserMetadata();
    if (!meta.drafts) {
      meta.drafts = {};
    }

    var now = new Date();
    var timeStr = now.format("yyyy-MM-dd ") + now.toTimeString().replace(/ \(.*\)/, '');

    var c1 = Geniverse.blogPostController.get('content1');
    var c2 = Geniverse.blogPostController.get('content2');
    var c3 = Geniverse.blogPostController.get('content3');
    var c4 = Geniverse.blogPostController.get('content4');

    meta.drafts[pageId] = {time: timeStr, content1: c1, content2: c2, content3: c3, content4: c4};

    Geniverse.userController.setUserMetadata(meta);
  },

  getBlogDraft: function(pageId) {
    var userMetadata = this.getUserMetadata(),
        drafts        = userMetadata.drafts || {};
    return drafts[pageId] || {};
  }
}) ;
