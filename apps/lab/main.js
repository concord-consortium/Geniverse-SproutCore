// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab SC NO*/

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Lab.main = function main() {

  Lab.statechart.initStatechart();
  // Lab.statechart.set('trace', YES);

  // *** setup routes ***

  //  ** activity routes (require login) **
  SC.routes.add(':strand/:level/:activityType/:activityIndex', Lab.routes, 'gotoActivity');
  SC.routes.add(':strand/:level/:activityType', Lab.routes, 'gotoActivity');
  SC.routes.add(':strand/:level', Lab.routes, 'gotoActivity');

  // ** routes that do not require login **
  // add routes to catch urls of the form #lab/chromosomeTrainingPage, and #lab/chromosomeTrainingPage/mainPane
  SC.routes.add('lab/:pageName/:paneName', Lab.routes, 'gotoLabRoute');
  SC.routes.add('lab/:pageName', Lab.routes, 'gotoLabRoute');
  SC.routes.add('caselog', Lab.routes, 'gotoCaselog');
  SC.routes.add('caselog/:level', Lab.routes, 'gotoCaselog');
  SC.routes.add('avatar', Lab.routes, 'gotoAvatarPage');
  SC.routes.add('endingHub', Lab.routes, 'gotoEndingHub');

  // urls of the form #fixtures/labs/... will load Geniverse Fixtures
  SC.routes.add('fixtures/lab/:pageName', Lab.routes, 'gotoLabRouteWithFixtures');

  //  urls of the form #fixtures/hereditry/apprentice will load fixtures first
  SC.routes.add('fixtures/:strand/:level/:activityType/:activityIndex', Lab.routes, 'gotoActivityRouteWithFixtures');
  SC.routes.add('fixtures/:strand/:level/:activityType', Lab.routes, 'gotoActivityRouteWithFixtures');
  SC.routes.add('fixtures/:strand/:level', Lab.routes, 'gotoActivityRouteWithFixtures');

  // urls of the form #geniverse/pageName will find the page in the Geniverse framework
  SC.routes.add('geniverse/:pageName', Lab.routes, 'gotoGeniverseRoute');

  // home page (requires login)
  SC.routes.add(':', Lab.routes, 'gotoMeiosisDemo');

  // *** End routes setup ***

  // *** Settings ***
  Lab.ENABLE_CHAT = NO;



  // *** setup exception handler ***
  SC.ExceptionHandler.handleException = function (exception) {
    // Will do nothing because uncaught exception will show in console
    // for developers
  };
} ;

function main() { Lab.main(); }


// FOR BETTER NAMES WHILE DEBUGGING/PROFILING
// Use Chrome v13 for the best heap profiling experience.
//
// This method effectively evals something like:
// SC.mixin(SC.ListItemView, { create: function() { SC.Logger.log("Created new SC.ListItemView"); return new SC._ListItemView(this, arguments); } });
// SC._ListItemView = function(base_type, args){ base_type.call(this, args); };
// SC.mixin(SC._ListItemView, SC.ListItemView);
// SC._ListItemView.prototype = SC.ListItemView.prototype;
function profileDebug(prefix, klass) {
  eval('SC.mixin(' + prefix + '.' + klass + ', { create: function() { SC.Logger.log("Created new ' + prefix + '.' + klass + '"); return new ' + prefix + '._' + klass + '(this, arguments); } });');
  eval(prefix + '._' + klass + ' = function(base_type, args){ base_type.call(this, args); };');
  eval('SC.mixin(' + prefix + '._' + klass + ', ' + prefix + '.' + klass + ');');
  eval(prefix + '._' + klass + '.prototype = ' + prefix + '.' + klass + '.prototype;');
}

// profileDebug("Geniverse", "Dragon");
// profileDebug("Geniverse", "OrganismView");
