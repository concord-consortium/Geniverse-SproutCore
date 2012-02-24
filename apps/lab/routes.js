// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse */

/** @namespace

  Manages routes for the Lab application.
  
  @extends SC.Object
*/
Lab.routes = SC.Object.create({

  /**
    Property to store the main pane of the page that is currently shown to the user
    */
  _currentPagePane: null,
  _firstHomePane: null,
  
  openHomePageRoute: function() {
    SC.routes.set('location', '');
  },
      
  gotoHomePage: function(routeParams) {
    Lab.statechart.sendAction('gotoHomePage');
  },
  
  openCaselogRoute: function() {
    SC.routes.set('location', 'caselog');
  },

  gotoCaselog: function(routeParams) {
    var level = routeParams.level;  // empty ('') or 'training', 'apprentice', 'journeyman', 'master', 'meiosis', 'dna'
    
    if (level) Lab.caselogController.set('currentLevelName', level);
    Lab.statechart.sendAction('gotoCaselog');
  },
  
  gotoActivity: function(routeParams) { 
    Lab.ACTIVITY.set('strand', routeParams.strand);                // heredity, ...
    Lab.ACTIVITY.set('level', routeParams.level);                  // apprentice, journeyman, master
    Lab.ACTIVITY.set('activityType', routeParams.activityType);    // intro, individual, group
    Lab.ACTIVITY.set('activityIndex', routeParams.activityIndex);  // 0,1,2
      
    Lab.statechart.sendAction('gotoActivity');
  },
  
  gotoLabRoute: function(routeParams) {
    this.gotoRoute(Lab, routeParams);
  },
  
  gotoGeniverseRoute: function(routeParams) {
    this.gotoRoute(Geniverse, routeParams);
  },
  
  gotoLabRouteWithFixtures: function(routeParams) {
    SC.Logger.log("fixtures: going to ");
    SC.Logger.dir(routeParams);
  
    function loadFixtureData() {
      Geniverse.set('store', SC.Store.create().from(SC.FixturesDataSource.create()));
      // SC.FixturesDataSource.simulateRemoteResponse = YES;
      // SC.FixturesDataSource.latency = 1000;
      
      // set up defaults
      var activities = Geniverse.store.find(Geniverse.ACTIVITIES_QUERY);
      Geniverse.activityController.set('content', activities.lastObject());
      Geniverse.userController.set('content', Geniverse.store.find(Geniverse.User, 1));
      Lab.ACTIVITY.loadData();
    }
    
    if (Geniverse.gwtController.get('isReady')){
      loadFixtureData();
    } else {
      Geniverse.gwtController.addObserver('isReady', loadFixtureData);
    }
    this.gotoLabRoute(routeParams);
  },
  
  gotoActivityRouteWithFixtures: function(routeParams) {
    SC.Logger.log("fixtures: going to ");
    SC.Logger.dir(routeParams);
    
    Geniverse.set('store', SC.Store.create().from(SC.FixturesDataSource.create()));
    Lab.START.gotoActivity(routeParams);
  },

  /**
    Navigate to the specified route
    
    @param {SC.Object} pageOwner The object (Lab or Geniverse, generally) which has the page routeParams.pageName
    
    @param {Object} routeParams route parameters are set as properties of this object. The parameters are specified 
      when registering the route using SC.routes.add() in main.js.
  */
  gotoRoute: function(pageOwner, routeParams) {
    var pageName = routeParams.pageName || 'mainPage',
        paneName = routeParams.paneName || 'mainPane',
        page     = pageOwner[pageName],
        pane     = page.get(paneName);

    console.log("BEGIN Lab.routes.gotoRoute(pageOwner, routeParams)");
    
    // If there is a current pane, remove it from the screen.
    if (this._currentPagePane !== null) {
      this._currentPagePane.remove();
    }

    // Be sure to hide any open info panes.
    Lab.infoController.removeView();

    // Show the specified pane...
    pane.set('pageName', pageName);  // This must be set so the help button works!
    pane.append();
    
    // ...and save the current pane so we can remove it when process the next route.
    this._currentPagePane = pane;
    
    // Don't bother with SC.logger.log(). console.log() logs an inspectable object instead of forcibly converting
    // all its arguments to strings.
    console.log("  pageOwner: %s", pageOwner && pageOwner.toString(), pageOwner);
    console.log("  routeParams: %s", routeParams && routeParams.toString(), routeParams);
    console.log("  pageName: %s", pageName);
    console.log("  paneName: %s", paneName);
    console.log("  page: %s", page && page.toString(), page);
    console.log("  pane: %s", pane && pane.toString(), pane);
    console.log("END Lab.routes.gotoRoute()");
  }

});


// OLD Routes code, may still use:

// routeHandler: function(route) {
//     // SC.Logger.dir(route);
//     window.route = route;
//     if (route.level == "Apprentice") {
//         if (route.module == "Heredity") {
//             if (route.activity == "Intro") {
//                 SC.Logger.log("Matched heredity intro route:", route);
//                 Lab.makeFirstResponder(Lab.HEREDITY_INTRO);
//             } else if (route.activity == "Individual") {
//                 SC.Logger.log("Matched heredity apprentice individual: ", route);
//                 Lab.makeFirstResponder(Lab.HEREDITY_APPRENTICE_INDIVIDUAL);
//             } else {
//                 SC.Logger.warn("Didn't know activity of route:", route);
//             }
//         } else {
//             SC.Logger.warn("Didn't know module of route:", route);
//         }
//     } else {
//         SC.Logger.warn("Didn't know level of route:", route);
//     }
// }
