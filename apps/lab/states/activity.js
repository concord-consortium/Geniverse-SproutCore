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
          // we get the scType and check if each of its parts matches our requested scType.
          // we only look at what is defined in the DB. So an activity with "heredity/training" will
          // be returned for a requested scType of "heredity/training/someLevel/someIndex"
          var matches = true;
          
          var scType = act.get('scType');
          if (!scType){
            matches = false;
          } else {
            scTypeAr = scType.split("/");
            matches = (scTypeAr[0] === strand);
            matches = (matches && !(scTypeAr.length > 1 && scTypeAr[1] !== level));
            matches = (matches && !(scTypeAr.length > 2 && scTypeAr[2] !== activityType));
            matches = (matches && !(scTypeAr.length > 3 && scTypeAr[3] !== activityIndex));
          }
          
          var title = act.get('title');
          if (matches) {
            SC.Logger.info("Using activity named: %s, with scType: %s", title, scType);
            return YES;
          } else {
            SC.Logger.info("found non-matching activitiy named: %s, with scType: %s ", title, scType);
          }
        });
        if (!found) {
          SC.Logger.info("Could not find activity with scType: "+strand+"/"+level+"/"+activityType+"/"+activityIndex);
          found = last;
        }
        Geniverse.activityController.set('content', found);
        activities.removeObserver('status', setActivity);
        
        Lab.ACTIVITY.loadData();
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
  
  loadData: function() {
    SC.Logger.log("ACTIVITY loadData");
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
          SC.Logger.info("Found "+Geniverse.challengePoolController.get('content').length()+" challenge dragons");
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
    var organismConfigurations = Geniverse.activityController.getConfigurationForRoomMember(group,member);
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
  },
  
  gotoActivityRoute: function() {
    
    var strand = this.get('strand');
    var level = this.get('level');
    var activityType = this.get('activityType');
    var activityIndex = this.get('activityIndex');
    
    SC.Logger.log("ACTIVITY gotoActivityRoute: "+strand+"/"+level+"/"+activityType+"/"+activityIndex);
    
    switch(strand) {
      case 'heredity':
        switch (level) {
          case 'training':
            Lab.routes.gotoLabRoute({pageName: 'chromosomeTrainingPage'});
            break;
          case 'apprentice':
            switch (activityType) {
              case 'intro':
                Lab.routes.gotoLabRoute({pageName: 'breedingPage'});
                break;
              case 'individual':
                // Lab.routes.gotoLabRoute({pageName: 'breedingPagePaper'});
                Lab.routes.gotoLabRoute({pageName: 'breedingPage'});
                break;
              case 'group':
                SC.Logger.log("going to group page");
                Lab.routes.gotoLabRoute({pageName: 'breedingPageGroup'});
                break;
            }
            break;
        }
        break;
    }
  },
  
  logout: function() {
    SC.Logger.info("logging out %s", CcChat.chatController.get('username'));
    
    CcChat.chatController.set('username', '');
    Lab.LOGIN.set('userLoggedIn', NO);
    
    Lab.userDefaults.writeDefault('username', '');
    Lab.userDefaults.writeDefault('chatroom', '');
    
    Lab.makeFirstResponder(Lab.START);
    
    SC.routes.set('location', '');
    window.location.reload();
  }
  
}) ;
