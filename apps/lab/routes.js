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
  currentPagePane: null,
  
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
    
    @param {Object} routeParams route parameters are set as properties of this
      object. The parameters are specified when registering the route using 
      SC.routes.add() in main.js.
    */
  gotoRoute: function(clazz, routeParams) {
    SC.Logger.log("Lab.routes.gotoRoute: function(clazz, routeParams) called.");
    console.log("clazz:",clazz);
    console.log("routeParams:",routeParams);

    // Default to mainPage
    var pageName = routeParams.pageName;
    if (!pageName) {
      pageName = 'mainPage';
    }
    
    // Default to mainPane
    var paneName = routeParams.paneName;
    if (!paneName) {
      paneName = 'mainPane';
    }

    // If there is a current pane, remove it from the screen
    if (this.currentPagePane !== null) {
      this.currentPagePane.remove();
    }
        
    // Show the specified pane
    var pagePanePath = pageName + '.' + paneName;
    console.log("pagePanePath:",pagePanePath);
    var pagePane = clazz.getPath(pagePanePath);
    console.log("pagePane:",pagePane);    
    pagePane.append();
    
    // Save the current pane so we can remove it when process the next route
    this.currentPagePane = pagePane;
  },

  gotoHomePage: function() {
    SC.routes.set('location', '');
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