// ==========================================================================
// Project:   Lab
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Lab.main = function main() {
  
  // *** setup routes ***
  
  // activity routes (require login)
  SC.routes.add(':strand/:level/:activityType/:activityIndex', Lab.START, 'gotoActivity');
  SC.routes.add(':strand/:level/:activityType', Lab.START, 'gotoActivity');
  SC.routes.add(':strand/:level', Lab.START, 'gotoActivity');
  
  // routes that do not require login
  // add routes to catch urls of the form #lab/chromosomeTrainingPage, and #lab/chromosomeTrainingPage/mainPane
  SC.routes.add('lab/:pageName/:paneName', Lab.routes, 'gotoLabRoute');
  SC.routes.add('lab/:pageName', Lab.routes, 'gotoLabRoute');
  // urls of the form #geniverse/pageName will find the page in the Geniverse framework
  SC.routes.add('geniverse/:pageName', Lab.routes, 'gotoGeniverseRoute');
  
  // home page (requires login)
  SC.routes.add(':', Lab.START, 'gotoHomePage');
  

  // *** setup exception handler ***
  SC.ExceptionHandler.handleException = function (exception) {
    // Will do nothing because uncaught exception will show in console
    // for developers
  };
  
  
  // *** START ***
  Lab.makeFirstResponder(Lab.START);
} ;

function main() { Lab.main(); }
