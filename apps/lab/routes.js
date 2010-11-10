// ==========================================================================
// Project:   Lab
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/

Lab.routes = SC.Object.create({

  /**
    Property to store the main pane of the page that is currently shown to the user
    */
  currentPagePane: null,

  /**
    Navigate to the specified route
    
    @param {Object} routeParams route parameters are set as properties of this
      object. The parameters are specified when registering the route using 
      SC.routes.add() in main.js.
    */
  gotoRoute: function(routeParams) {
    
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
    var pagePane = Lab.getPath(pagePanePath);
    pagePane.append();
    
    // Save the current pane so we can remove it when process the next route
    this.currentPagePane = pagePane;
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