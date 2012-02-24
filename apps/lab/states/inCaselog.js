// ==========================================================================
// Project:   Lab
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse Ki*/

Lab.inCaselog = Ki.State.extend({
  
  enterState: function() { 
    console.log("Entering caselog state");
    Lab.routes.gotoLabRoute({ pageName: 'caselogPage' });
  },
  
  exitState: function() { 
    console.log("Exiting caselog state");
  }
  
});