// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki gotoState*/

Lab.inActivity = Ki.State.extend({
  
  substatesAreConcurrent: YES,
  
  challengeState: Ki.State.design({
    substatesAreConcurrent: NO,
    initialSubstate: 'defaultChallenge',
    matchOneAtATimeChallenge: Ki.State.plugin('Lab.matchOneAtATimeChallenge'),
    matchThreeToOneChallenge: Ki.State.plugin('Lab.matchThreeToOneChallenge'),
    defaultChallenge: Ki.State.plugin('Lab.defaultChallenge'),

    currentChallenge: null
  }),

  showingIntroScreen: Ki.State.plugin('Lab.showingIntroScreen'),
  
  enterState: function() { 
    this.gotoActivity();
  },
  
  gotoActivity: function() {
    Geniverse.activityController.addObserver('content', this, this.activityLoaded);
    Lab.makeFirstResponder(Lab.ACTIVITY);
    Lab.ACTIVITY.gotoActivity();
  },
  
  activityLoaded: function(){
    Geniverse.activityController.removeObserver('content', this.activityLoaded);
    
    var pageType = Geniverse.activityController.get('pageType');
    var challengeType = Lab[pageType].get('challengeType');
    if (!!challengeType) {
      this.get('challengeState').gotoState(challengeType);
    }
    
    if (!!Geniverse.activityController.get('myCase')) {
      if (Geniverse.activityController.get('myCase').get('status') & SC.Record.READY == SC.Record.READY) {
        this.caseLoaded();
      } else {
        Geniverse.activityController.get('myCase').addObserver('status', this, this.caseLoaded);
      }
    }
  },
  
  caseLoaded: function(){
    Geniverse.activityController.removeObserver('myCase', this.caseLoaded);
    
    this.enablePreviousNavButton((!!Geniverse.activityController.getPreviousActivity()));
    this.enableNextNavButton((!!Geniverse.activityController.getNextActivity()));

    if (Geniverse.activityController.get('myCaseOrder') === 1 && !!Geniverse.introScreenController.get('imageUrl')) {
      this.get('showingIntroScreen').gotoState('showingIntroScreenPanel');
    }
  },
  
  enablePreviousNavButton: function(enable) {
    Lab.navigationController.set('showPreviousButton', enable);
  },
  
  enableNextNavButton: function(enable) {
    Lab.navigationController.set('showNextButton', enable);
  },
  
  blockNextNavButton: function(block) {
    Lab.navigationController.set('blockNextButton', block);
  },
  
  gotoNextActivity: function() {
    this.blockNextNavButton(false);
    var next = Geniverse.activityController.getNextActivity();
    if (!!next){
      SC.routes.set('location', next.get('route'));
    }
  },
  
  gotoPreviousActivity: function() {
    this.blockNextNavButton(false);
    var previous = Geniverse.activityController.getPreviousActivity();
    if (!!previous){
      SC.routes.set('location', previous.get('route'));
    }
  },
  
  gotoHomePage: function() {
    Lab.statechart.getState('atLocation').startPage = "home";
    this.gotoState('inHomePage');
  },
  
  exitState: function() { 
  }
  
});
