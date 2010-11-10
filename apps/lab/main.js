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

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.  
  // The DEFAULT state will handle this
  // Lab.getPath('mainPage.mainPane').append() ;
  Lab.makeFirstResponder(Lab.DEFAULT);

  // Step 2. Set the content property on your primary controller.
  // This will make your app come alive!

  // TODO: Set the content property on your primary controller
  // ex: Lab.contactsController.set('content',Lab.contacts);
  
  // add routes to catch urls of the form /lab, /lab#chromosomeTrainingPage, and /lab#chromosomeTrainingPage/mainPane
  SC.routes.add(':pageName/:paneName', Lab.routes, 'gotoRoute');
  SC.routes.add(':pageName', Lab.routes, 'gotoRoute');
  SC.routes.add(':', Lab.routes, 'gotoRoute');

} ;

function main() { Lab.main(); }
