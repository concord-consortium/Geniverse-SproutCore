// ==========================================================================
// Project:   Geniverse.LOAD_DATA
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse CcChat */

/** @class

  The load data state.

  @extends SC.Responder
  @version 0.1
*/
Geniverse.makeRestParams = function(elems) {
  var paramString = "";
  var params = [];
  var key;
  for (key in elems) {
    if (typeof key === 'string') {
      var item = elems[key];
      var keyst = key;
      // assume SC.Record TODO: big assumption
      if (typeof item === 'object') {
        try{
          item = item.get('id');
          // strip out the actual ID from the url
          // TODO: This assumes a lot about our backend.
          var parts = item.split("/");
          var last = parts[parts.length -1];
          item = last;
          keyst = "%@_id".fmt(key);
        }
        catch(error) {
          SC.Logger.error("Error: %s", error);
          SC.Logger.error("Oops, %s didn't have an detectable id", item);
          continue;
        }
      }
      params.push("%@=%@".fmt(keyst,item));
    }
  }
  paramString = "?%@".fmt(params.join("&"));
  return paramString;
};

Geniverse.LOAD_DATA = SC.Responder.create(
/** @scope Geniverse.LOGIN.prototype */ {

  nextResponder: null,

  //
  didBecomeFirstResponder: function() {
    SC.Logger.log("LOAD");
    var user = Geniverse.userController.get('content');
    var activity = Geniverse.activityController.get('content');

    /////////////////// Stable
    SC.Logger.log("LOAD: stable");
    var stableQuery = SC.Query.local(Geniverse.Dragon, {
        conditions: 'bred = true AND isEgg = false AND user = {user} AND isInMarketplace = false AND activity = {activity}',
        user: user,
        activity: activity,
        orderBy: 'stableOrder',
        restParams: Geniverse.makeRestParams({
          bred: 'true',
          isEgg: 'false',
          isInMarketplace: 'false',
          user: user,
          activity: activity
        })
    });
    var stableOrganisms = Geniverse.store.find(stableQuery);
    Geniverse.stableOrganismsController.set('content', stableOrganisms);

    /////////////////// Eggs
    SC.Logger.log("LOAD: eggs");
    Geniverse.EGGS_QUERY = SC.Query.local('Geniverse.Dragon', {
        conditions: 'bred = true AND isEgg = true AND user = {user} AND isInMarketplace = false AND activity = {activity}',
        user: user,
        activity: activity,
        orderBy: 'storeKey',
        restParams: Geniverse.makeRestParams({
          bred: 'true',
          isEgg: 'true',
          isInMarketplace: 'false',
          user: user,
          activity: activity
        })
    });
    // var eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
    Geniverse.eggsController.set('content',[]);

    /////////////////// Chats
    SC.Logger.log("LOAD: chats");
    var chatQuery = SC.Query.local(CcChat.ChatMessage, {
        orderBy: 'time'
    });
    var chats = CcChat.store.find(chatQuery);
    Geniverse.chatListController.set('content', chats);

    /////////////////// Articles
    SC.Logger.log("LOAD: articles");
    var articlesQuery = SC.Query.local(Geniverse.Article, {
        orderBy: 'time'
    });
    var articles = Geniverse.store.find(articlesQuery);
    Geniverse.publishedArticlesController.set('content', articles);

    /////////////////// Challenge dragons
    SC.Logger.log("LOAD: challenge dragons");
    var challengePoolQuery = SC.Query.local('Geniverse.Dragon', {
      conditions: 'bred = false AND user = {user} AND activity = {activity} AND mother = {mother} AND father = {father}',
      user: user,
      activity: activity,
      mother: null,
      father: null,
      orderBy: 'storeKey',
      restParams: Geniverse.makeRestParams({
        mother_id: 'null',
        father_id: 'null',
        bred: 'false',
        user: user,
        activity: activity
      })
    });

    var challengeDragons = Geniverse.store.find(challengePoolQuery);
    var self = this;

    function challengeDragonsReady() {
      SC.Logger.info("challenge dragons observer called");
      if (challengeDragons.get('status') & SC.Record.READY === SC.Record.READY) {
        SC.Logger.info("Results ready.");
        challengeDragons.removeObserver('status', challengeDragonsReady);
        Geniverse.challengePoolController.set('content', challengeDragons);
        if (Geniverse.challengePoolController.get('content').length() < 1) {
          SC.Logger.info("No challenge dragons");
          self.initChallengeDragons();
        } else {
          SC.Logger.info("Found challenge dragons");
        }
      } else { SC.Logger.info("Results not ready."); }
    }

    if (challengeDragons.get('status') & SC.Record.READY === SC.Record.READY) {
      SC.Logger.log('already ready to go!');
      challengeDragonsReady();
    } else {
      SC.Logger.log('adding challenge dragons observer');
      challengeDragons.addObserver('status', challengeDragonsReady);
    }
  },

  initChallengeDragons: function() {
    function handleDragon(dragon) {
      SC.RunLoop.begin();
      SC.Logger.info("created dragon");
      SC.Logger.dir(dragon.attributes());
      SC.RunLoop.end();
    }
    SC.Logger.info("Creating defaults");
    //var organismConfigurations = Geniverse.activityController.getConfigurationForRoom(CcChat.chatRoomController.get('channelIndex'));
    var group = Geniverse.loginController.get('groupNumber')  - 1; // the numbers 1 - 3, but need to 0 based
    var member = Geniverse.loginController.get('memberNumber')- 1;
    var organismConfigurations = Geniverse.activityController.getConfigurationForRoomMember(group,member, false);
    SC.Logger.info("Found " + organismConfigurations.length + " defaults");
    for (var i = 0; i < organismConfigurations.length; i++) {
      var conf = organismConfigurations[i];
      var name = (typeof conf.name != "undefined") ? conf.name : ('Starter'+i);
      SC.Logger.info("Creating " + conf.sex + ": " + name + " ( " + conf.alleles + ")" + " defaults");
      Geniverse.gwtController.generateDragonWithAlleles(conf.alleles, conf.sex, name, handleDragon);
    }
    if (organismConfigurations.length === 0) {
      SC.Logger.info("No configurations. Creating defaults.");
      Geniverse.gwtController.generateDragon(1, 'Mother', handleDragon);
      Geniverse.gwtController.generateDragon(0, 'Father', handleDragon);
    }
  }

}) ;


Geniverse.EGGS_QUERY = null;
