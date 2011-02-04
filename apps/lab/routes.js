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
    SC.Logger.log("clazz:",clazz);
    SC.Logger.log("routeParams:",routeParams);

    // Default to mainPage
    var pageName = routeParams.pageName;
    if (!pageName) {
      pageName = 'mainPage';
    }
    SC.Logger.log("page name: ", pageName);

    // Default to mainPane
    var paneName = routeParams.paneName;
    if (!paneName) {
      paneName = 'mainPane';
    }
    SC.Logger.log("pane name: ", paneName);

    // If there is a current pane, remove it from the screen
    if (this._currentPagePane !== null) {
      this._currentPagePane.remove();
      var oldPane = this._currentPagePane;
      oldPane.destroy();
    }

    Lab.infoController.removeView();  // be sure to hide any open info panes

    // Show the specified pane
    var page = clazz[pageName];
    
    SC.Logger.log("Page: ", page); 

    var pane = page[paneName];
    
    if (this._firstHomePane === null && page.get('pagePath') == "Lab.mainPage"){
      this._firstHomePane = pane;
    }
    SC.Logger.log("Pane: ", pane);
    try {
      pane = pane.create();
    } catch(err) {
      // FIXME This shows up consistently when going back to mainPage.mainPane.
      // It turns out that unlike the other pages, the created instance of mainPage.mainPane
      // ends up replacing the designed mainPane... so the second time through, it's already been
      // created. This messes up the links within the page, too.
      SC.Logger.error("Couldn't call 'create' on pane");
      SC.Logger.dir(pane);
      
      // HACK: The version of the home page mainPane that is created after the first time
      // is no longer a SC.mainPane but is instead an object with a type SC.mainPane and
      // no create method. The temporarily fix this, we save the first version of the mainPane
      // that is created and call create on that.
      pane = this._firstHomePane.create();
    }
    pane.set('pageName',pageName);  // must be set so the help button works!
    // SC.Logger.log("Created Pane: ", pane); 
    pane.append();

    // Save the current pane so we can remove it when process the next route
    this._currentPagePane = pane;
  },

  gotoHomePage: function() {
    SC.routes.set('location', '');
  },

  gotoCaseLogPage: function() {
    SC.routes.set('location', 'lab/caselog');
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
