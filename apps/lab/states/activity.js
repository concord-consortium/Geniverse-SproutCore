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
    
    Lab.LOGIN.removeObserver('userLoggedIn', Lab.ACTIVITY, 'gotoActivity');
    
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
      if ((challengeDragons.get('status') & SC.Record.READY) === SC.Record.READY) {
        challengeDragons.removeObserver('status', challengeDragonsReady);
        Geniverse.challengePoolController.set('content', challengeDragons);
        if (Geniverse.challengePoolController.get('content').length() < 1) {
          SC.Logger.info("No challenge dragons");
          self.initDragonsFromJson(false);
        } else {
          SC.Logger.info("Found "+Geniverse.challengePoolController.get('content').length()+" challenge dragons");
        }
      }
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
        orderBy: 'storeKey',
        restParams: Geniverse.makeRestParams({
          mother_id: 'null',
          father_id: 'null',
          bred: 'false',
          user: user,
          activity: activity
        })
      });

      var matchDragons = Geniverse.store.find(matchPoolQuery);
      
      // we should be able to DRY this up with challengeDragonsReady, but we'd need to
      // pass in some variables, and I can't figure out how to do this if this gets called
      // by an observer
      function matchDragonsReady() {
        SC.Logger.info("match dragons observer called");
        if ((matchDragons.get('status') & SC.Record.READY) === SC.Record.READY) {
          matchDragons.removeObserver('status', matchDragonsReady);
          Geniverse.matchController.set('content', matchDragons);
          if (Geniverse.matchController.get('content').length() < 1) {
            SC.Logger.info("No match dragons");
            self.initDragonsFromJson(true);
          } else {
            SC.Logger.info("Found "+Geniverse.matchController.get('content').length()+" match dragons");
          }
        }
      }
      
      if ((matchDragons.get('status') & SC.Record.READY) === SC.Record.READY) {
        matchDragonsReady();
      } else {
        matchDragons.addObserver('status', matchDragonsReady);
      }
      
      this.set('hasLoadedActivityData', YES);
  },

  initDragonsFromJson: function(isMatchDragons) {
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
    //var organismConfigurations = Geniverse.activityController.getConfigurationForRoom(CcChat.chatRoomController.get('channelIndex'));
    var user = Geniverse.userController.get('content');
    var group = user.get('groupId')  - 1; // the numbers 1 - 3, but need to 0 based
    var member = user.get('memberId')- 1;
    var organismConfigurations = Geniverse.activityController.getConfigurationForRoomMember(group,member, isMatchDragons);
    SC.Logger.info("Found " + organismConfigurations.length + " defaults");
    for (var i = 0; i < organismConfigurations.length; i++) {
      var conf = organismConfigurations[i];
      var name = (typeof conf.name != "undefined") ? conf.name : ('Starter'+i);
      SC.Logger.info("Creating " + conf.sex + ": " + name + " ( " + conf.alleles + ")" + " defaults");
      Geniverse.gwtController.generateDragonWithAlleles(conf.alleles, conf.sex, name, handleDragon, true);
    }
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
      while (Geniverse.stableOrganismsController.get('length') > 0){
        SC.Logger.log("selling drake");
        SC.RunLoop.begin();
        if (stableDragons.lastObject().get('status') & SC.Record.READY === SC.Record.READY){
          stableDragons.lastObject().set('isInMarketplace', true);
        }
        SC.RunLoop.end();
      }
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
      while (Geniverse.challengePoolController.get('length') > 0){
        SC.Logger.log("selling drake");
        SC.RunLoop.begin();
        if (challangeDragons.lastObject().get('status') & SC.Record.READY === SC.Record.READY){
          challangeDragons.lastObject().set('isInMarketplace', true);
        }
        SC.RunLoop.end();
      }
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
