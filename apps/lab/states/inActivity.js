// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki gotoState*/

Lab.inActivity = Ki.State.extend({
  
  substatesAreConcurrent: NO,
  
  matchOneAtATimeChallenge: Ki.State.plugin('Lab.matchOneAtATimeChallenge'),
  
  currentChallenge: null,
  
  enterState: function() { 
    Geniverse.activityController.addObserver('content', this, this.activityLoaded);
    Lab.makeFirstResponder(Lab.ACTIVITY);
    Lab.ACTIVITY.gotoActivity();
  },
  
  activityLoaded: function(){
    Geniverse.activityController.removeObserver('content', this.activityLoaded);
    
    var pageType = Geniverse.activityController.get('pageType');
    var challengeType = Lab[pageType].get('challengeType');
    if (!!challengeType) {
      this.gotoState(challengeType);
    }
  },
  
  startTrial: function() {
    gotoState('inTrial');
  },
  
  exitState: function() { 
  }
  
});
