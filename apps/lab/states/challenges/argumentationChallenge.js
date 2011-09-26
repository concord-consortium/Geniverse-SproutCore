// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

Lab.argumentationChallenge = Ki.State.extend({
  
  challengeComplete: NO,
  
  enterState: function() { 
    this.startChallenge();
  },
  
  startChallenge: function() {
    this.statechart.getState('inActivity').blockNextNavButton(true);
    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', YES);
    this.set('challengeComplete', NO);
  },
  
  endChallenge: function() {
    this.challengeComplete = YES;
    this.statechart.getState('inActivity').blockNextNavButton(false);
  },
  
  didSendBlogPost: function() {
    if (!this.challengeComplete){
      this.endChallenge();
      SC.AlertPane.extend({layout: {top: 0, centerX: 0, width: 350, height: 100 }}).plain(
        "Good work!", 
        "You have posted to the journal.\nYou can continue to work on this challenge if you like, or you can move on to the next challenge using the green arrow below.",
        "",
        "OK",
        ""
      );
    }
  },
  
  exitState: function() { 
  }
  
});
