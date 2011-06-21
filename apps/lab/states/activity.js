// ==========================================================================
// Project:   Lab.ACTIVITY
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window*/

/** @class

  (Document Your State Here)

  @extends SC.Responder
  @version 0.1
*/
Lab.ACTIVITY = SC.Responder.create(
/** @scope Lab.DEFAULT.prototype */ {

  strand: null,
  level: null,
  activityType: null,
  activityIndex: null,
  
  /**
    The next state to check if this state does not implement the action.
  */
  nextResponder: null,
  
  didBecomeFirstResponder: function() {
    SC.Logger.log("ACTIVITY");
  },
  
  hasLoadedActivityData: NO,
  
  willLoseFirstResponder: function() {
    // Called when this state loses first responder
    // SC.Logger.info("Now removing default page");
    // Lab.getPath('trainingPage.mainPane').remove() ;
  },
  
  // ..........................................................
  // EVENTS
  //
  
  gotoActivity: function() {
    Lab.makeFirstResponder(this);
    SC.Logger.log("ACTIVITY gotoActivity");
    
    this.set('hasLoadedActivityData', NO);
    
    // this is hard-coded for now, but will; be switched with a system that looks up
    // the appropriate activity and goes to the route specified
    
    if (Geniverse.gwtController.get('isReady')){
      this.initActivity();
    } else {
      Geniverse.gwtController.addObserver('isReady', this, 'initActivity');
    }
    
  },
  
  initActivity: function() {
    SC.Logger.log("ACTIVITY initActivity");
    var activityQuery = Geniverse.ACTIVITIES_QUERY;
    var activities = Geniverse.store.find(activityQuery);
    
    var strand = this.get('strand');
    var level = this.get('level');
    var activityType = this.get('activityType');
    var activityIndex = this.get('activityIndex');

    function setActivity() {
      if (activities.get('status') === SC.Record.READY_CLEAN) {
        
        //Try to find the activity matching our scType
        var last  = activities.lastObject();
        var found = activities.find(function(act) {
          // we get the route and check if each of its parts matches our requested route.
          // we only look at what is defined in the DB. So an activity with "heredity/training" will
          // be returned for a requested route of "heredity/training/someLevel/someIndex"
          var matches = true;
          
          var route = act.get('route');
          if (!route){
            matches = false;
          } else {
            var routeArr = route.split("/");
            matches = (routeArr[0] === strand);
            matches = (matches && !(route.length > 1 && routeArr[1] !== level));
            matches = (matches && !(route.length > 2 && routeArr[2] !== activityType));
            matches = (matches && !(route.length > 3 && routeArr[3] !== activityIndex));
          }
          
          var title = act.get('title');
          if (matches) {
            SC.Logger.info("Using activity named: %s, with route: %s", title, route);
            return YES;
          } else {
            SC.Logger.info("found non-matching activitiy named: %s, with route: %s ", title, route);
          }
          return NO;
        });
        if (!found) {
          SC.Logger.info("Could not find activity with route: "+strand+"/"+level+"/"+activityType+"/"+activityIndex);
          found = last;
        }
        Geniverse.activityController.set('content', found);
        activities.removeObserver('status', setActivity);
        
        Lab.ACTIVITY.initChatChannels();
        Lab.ACTIVITY.reloadData();
        Lab.ACTIVITY.gotoActivityRoute();
      }
    }

    // if activities status is immediately READY_CLEAN, then we are loading from fixtures,
    // so we can begin immediately. Otherwise, wait for activities to be loaded from
    // remote data source
    if (activities.get('status') === SC.Record.READY_CLEAN) {
        setActivity();
    } else {
        activities.addObserver('status', this, setActivity);
    }
  },
  
  initChatChannels: function() {
    
    var user = Geniverse.userController.get('content');
    var username = user.get('username');
    var activity = Geniverse.activityController.get('content');
    
    var activityChannel = Geniverse.activityController.get('baseChannelName');
    var className = user.get('className');
    var groupChannel = activityChannel+"-"+className+"-"+user.get('groupId');
    
    CcChat.chatController.set('username', username);
    CcChat.chatController.initChat(groupChannel);
    
    SC.Logger.info("logged into %s",groupChannel);
  },
  
  loadData: function() {
    SC.Logger.log("ACTIVITY loadData");
    
    this.set('hasLoadedActivityData', NO);
    
    var user = Geniverse.userController.get('content');
    var activity = Geniverse.activityController.get('content');
    
    // Clear all data jumping between activities
    Geniverse.stableOrganismsController.set('content', null);
    Geniverse.eggsController.set('content',null);
    Geniverse.challengePoolController.set('content', null);
    
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
    // Geniverse.EGGS_QUERY = SC.Query.local('Geniverse.Dragon', {
    //     conditions: 'bred = true AND isEgg = true AND user = {user} AND isInMarketplace = false AND activity = {activity}',
    //     user: user,
    //     activity: activity,
    //     orderBy: 'storeKey',
    //     restParams: Geniverse.makeRestParams({
    //       bred: 'true',
    //       isEgg: 'true',
    //       isInMarketplace: 'false',
    //       user: user,
    //       activity: activity
    //     })
    // });
    // var eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
     Geniverse.eggsController.set('content',[]);
    
    // sell any existing eggs on startup
    // function eggsReady() {
    //   eggs.forEach(function(egg){
    //     egg.set('isEgg', false);
    //     egg.set('isInMarketplace', true);
    //   });
    //   // eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
    //   Geniverse.eggsController.set('content',eggs);
    // }
    // 
    // if (eggs.get('status') & SC.Record.READY === SC.Record.READY) {
    //   eggsReady();
    // } else {
    //   eggs.addObserver('status', eggsReady);
    // }
    
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
      conditions: 'activity = {activity} AND accepted = true',
      activity: activity, 
      orderBy: 'time'
    });
    var articles = Geniverse.store.find(articlesQuery);
    Geniverse.publishedArticlesController.set('content', articles);
    
    var myArticlesQuery = SC.Query.local(Geniverse.Article, {
      conditions: 'group = {group} AND activity = {activity} AND submitted = false AND accepted = false',
      group: user.get('groupId'),
      activity: activity,
      orderBy: 'time'
    });
    var myArticles = Geniverse.store.find(myArticlesQuery);
    
    Geniverse.articleController.set('content', myArticles);
    
    /////////////////// Challenge dragons
    SC.Logger.log("LOAD: challenge dragons");
    var challengePoolQuery = SC.Query.local('Geniverse.Dragon', {
      conditions: 'bred = false AND isInMarketplace = false AND isMatchDragon = false AND user = {user} AND activity = {activity} AND mother = {mother} AND father = {father}',
      user: user,
      activity: activity,
      mother: null,
      father: null,
      orderBy: 'name, storeKey',
      restParams: Geniverse.makeRestParams({
        mother_id: 'null',
        father_id: 'null',
        bred: 'false',
        isInMarketplace: 'false',
        isMatchDragon: 'false',
        user: user,
        activity: activity
      })
    });
    
    var challengeDragons = Geniverse.store.find(challengePoolQuery);
    var self = this;
    
    function challengeDragonsReady() {
      self.initDragons(challengeDragons, this, false, self);
    }
    
    if ((challengeDragons.get('status') & SC.Record.READY) === SC.Record.READY) {
      challengeDragonsReady();
    } else {
      challengeDragons.addObserver('status', challengeDragonsReady);
    }
    
     /////////////////// Match dragons
      SC.Logger.log("LOAD: match dragons");
      var matchPoolQuery = SC.Query.local('Geniverse.Dragon', {
        conditions: 'bred = false AND isMatchDragon = true AND user = {user} AND activity = {activity} AND isInMarketplace = false AND mother = {mother} AND father = {father}',
        user: user,
        activity: activity,
        mother: null,
        father: null,
        orderBy: 'name, storeKey',
        restParams: Geniverse.makeRestParams({
          mother_id: 'null',
          father_id: 'null',
          bred: 'false',
          user: user,
          isMatchDragon: 'true',
          isInMarketplace: 'false',
          activity: activity
        })
      });

      var matchDragons = Geniverse.store.find(matchPoolQuery);
      
      function matchDragonsReady() {
        self.initDragons(matchDragons, this, true, self);
      }
      
      if ((matchDragons.get('status') & SC.Record.READY) === SC.Record.READY) {
        matchDragonsReady();
      } else {
        matchDragons.addObserver('status', matchDragonsReady);
      }
      
      this.set('hasLoadedActivityData', YES);
  },
  
  initDragons: function(dragons, observer, isMatchDragons, self) {
    if ((dragons.get('status') & SC.Record.READY) === SC.Record.READY) {
      dragons.removeObserver('status', observer);
      var controller;
      if (isMatchDragons){
        controller = Geniverse.matchController;
      } else {
        controller = Geniverse.challengePoolController;
      }
      controller.set('content', dragons);
      var dragonsRequired = self.getOrganismConfigurations(isMatchDragons).length;
      var currentDragons = controller.get('content').length();
      if (currentDragons != dragonsRequired) {
        SC.Logger.info("Regenerating dragons for "+isMatchDragons);
        // get rid of existing drakes
        SC.RunLoop.begin();
          var length = controller.get('length');
          for (var i = 0; i < length; i++){
            controller.objectAt(i).set('isInMarketplace', YES);
          }
        SC.RunLoop.end();
        
        self.initDragonsFromJson(isMatchDragons, dragonsRequired);
      } else {
        SC.Logger.info("Found "+controller.get('content').length()+" dragons for "+isMatchDragons);
      }
    }
  },

  initDragonsFromJson: function(isMatchDragons, count) {
    function handleDragon(dragon) { 
      SC.RunLoop.begin();
      if (isMatchDragons){
        dragon.set('isMatchDragon', YES);     //prevent it from showing up in other controllers
        dragon.set('isInMarketplace', NO);
      } else {
        dragon.set('isInMarketplace', NO);
      }
      SC.Logger.info("created dragon");
      SC.Logger.dir(dragon.attributes());
      SC.RunLoop.end();
    }
    SC.Logger.info("Creating defaults");
    var organismConfigurations = this.getOrganismConfigurations(isMatchDragons);
    SC.Logger.info("Found " + organismConfigurations.length + " defaults");
    
    var dragonsRequired = !!count ? count : organismConfigurations.length;
    for (var i = 0; i < dragonsRequired; i++) {
      var conf = organismConfigurations[i];
      var name = (typeof conf.name != "undefined") ? conf.name : ('Starter'+i);

      // prefix the name with the order number so that we can sort by
      // name and always get dragons in the same order
      if (i < 10) {
        name = "0" + i + " - " + name;
      } else {
        name = "" + i + " - " + name;
      }
      Geniverse.gwtController.generateDragonWithAlleles(conf.alleles, conf.sex, name, handleDragon, true);
    }
  },
  
  getOrganismConfigurations: function(isMatchDragons) {
    var user = Geniverse.userController.get('content');
    var group = user.get('groupId')  - 1; // the numbers 1 - 3, but need to 0 based
    var member = user.get('memberId')- 1;
    return Geniverse.activityController.getConfigurationForRoomMember(group,member, isMatchDragons);  
  },
  
  reloadData: function() {
    SC.Logger.log("Lab.Activity.reloadData");
    
    this.set('hasLoadedActivityData', NO);
    
    SC.RunLoop.begin();
    // for (var i = 0; i < Geniverse.matchController.get('length'); i++){
    //   var dragon = Geniverse.matchController.objectAt(i);
    //   dragon.set('isInMarketplace', YES);
    // }
    // for (var i = 0; i < Geniverse.challengePoolController.get('length'); i++){
    //   var dragon = Geniverse.challengePoolController.objectAt(i);
    //   dragon.set('isInMarketplace', YES);
    // }
    
    Geniverse.matchController.set('content', []);
    Geniverse.challengePoolController.set('content', []);
    Geniverse.breedDragonController.reset();
    Geniverse.articleController.set('article', null);
    Geniverse.articleController.set('started', NO);

    Lab.infoController.removeView();  // be sure to hide any open info panes

    SC.RunLoop.end();
    this.loadData();
  },
  
  sellAllUsersDrakes: function() {
    SC.Logger.log("selling owned drakes");
    
    var user = Geniverse.userController.get('content');
    var activity = Geniverse.activityController.get('content');
    
    
    // getting all owned dragons like so caused hundreds of POSTS and made script
    // crash. Still don't understand why. So we do it twice, once for the stable
    // dragons and once for the challange dragons. Annoying and not DRY
    
    // var ownedDragonsQuery = SC.Query.local('Geniverse.Dragon', {
    //   conditions: 'user = {user} AND activity = {activity} AND isInMarketplace = false',
    //   user: user,
    //   activity: activity,
    //   orderBy: 'storeKey',
    //   restParams: Geniverse.makeRestParams({
    //     user: user,
    //     activity: activity,
    //     isInMarketplace: 'false'
    //   })
    // });
    // var ownedDragons = Geniverse.store.find(ownedDragonsQuery);
    
    // first sell stable drakes in the activity user is currently viewing
    var stableDragons = Geniverse.stableOrganismsController.get('arrangedObjects');
    
    function dragonsReadyToBeSold() {
      stableDragons.removeObserver('status', dragonsReadyToBeSold);
      SC.RunLoop.begin();
      stableDragons.setEach('isInMarketplace', true);
      SC.RunLoop.end();
      SC.Logger.log("done selling stable dragons");
    }
    
    if (stableDragons.get('status') & SC.Record.READY === SC.Record.READY) {
      dragonsReadyToBeSold();
    } else {
      stableDragons.addObserver('status', dragonsReadyToBeSold);
    }
    
    // then sell challange drakes in the activity user is currently viewing
    var challangeDragons = Geniverse.challengePoolController.get('arrangedObjects');
    
    function dragonsReadyToBeSold2() {
      challangeDragons.removeObserver('status', dragonsReadyToBeSold);
      SC.RunLoop.begin();
      challangeDragons.setEach('isInMarketplace', true);
      SC.RunLoop.end();
      SC.Logger.log("done selling stable dragons");
    }
    
    if (challangeDragons.get('status') & SC.Record.READY === SC.Record.READY) {
      dragonsReadyToBeSold2();
    } else {
      challangeDragons.addObserver('status', dragonsReadyToBeSold2);
    }
    
  },
  
  gotoActivityRoute: function() { 
    var pageType = Geniverse.activityController.get('pageType');
    
    SC.Logger.log("ACTIVITY finding page type: "+pageType);
    
    Lab.routes.gotoLabRoute({pageName: pageType});

    // If a message has been authored for this Activity, display it now
    var message = Geniverse.activityController.get('message');
    if (message){
      Lab.infoController.display(message);
    }
  }
}) ;
