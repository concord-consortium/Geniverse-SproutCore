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
    this.get('statechart').sendAction('blockNextNavButton');
    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', YES);
    this.set('challengeComplete', NO);
  },
  
  endChallenge: function() {
    this.challengeComplete = YES;
    this.get('statechart').sendAction('unblockNextNavButton');

    // Award a "star" for completion
    var pageId = Geniverse.activityController.get('guid');
    Geniverse.userController.setPageStars(pageId, 1);
  },
  
  didSendBlogPost: function() {
    if (!this.challengeComplete){
      this.endChallenge();
      var moveOnMessage = (!!Geniverse.activityController.getNextActivity()) ? 
        "move on to the next challenge using the green arrow below." :
        "go back to the case log to go to a new case.";
      SC.AlertPane.extend({layout: {top: 0, centerX: 0, width: 350, height: 100 }}).plain(
        "Good work!", 
        "You have posted to the journal.\nYou can continue to work on this challenge if you like, or you can "+moveOnMessage,
        "",
        "OK",
        ""
      );
    }
  },
  
  exitState: function() { 
  }
  
});
