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
    
    if (Geniverse.activityController.get('myCase').get('status') & SC.Record.READY == SC.Record.READY) {
      this.caseLoaded();
    } else {
      Geniverse.activityController.get('myCase').addObserver('status', this, this.caseLoaded);
    }
  },
  
  caseLoaded: function(){
    Geniverse.activityController.removeObserver('myCase', this.caseLoaded);
  
    SC.RunLoop.begin();
      Lab.navigationController.set('showPreviousButton', (!!Geniverse.activityController.getPreviousActivity()));
      Lab.navigationController.set('showNextButton', (!!Geniverse.activityController.getNextActivity()));
    SC.RunLoop.end();
  },
  
  startTrial: function() {
    gotoState('inTrial');
  },
  
  gotoNextActivity: function() {
    var next = Geniverse.activityController.getNextActivity();
    if (!!next){
      SC.routes.set('location', next.get('route'));
    }
  },
  
  gotoPreviousActivity: function() {
    var previous = Geniverse.activityController.getPreviousActivity();
    if (!!previous){
      SC.routes.set('location', previous.get('route'));
    }
  },
  
  exitState: function() { 
  }
  
});
