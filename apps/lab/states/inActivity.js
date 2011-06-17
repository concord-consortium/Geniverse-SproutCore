// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.inActivity = Ki.State.extend({
  
  enterState: function() { 
    Lab.makeFirstResponder(Lab.ACTIVITY);
    Lab.ACTIVITY.gotoActivity();
  },
  
  startTrial: function() {
    // placeholder
  },
  
  exitState: function() { 
  }
  
});