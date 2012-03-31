// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

Lab.argumentationChallenge = Ki.State.extend({
  
  challengeComplete: NO,
  challengeWasAlreadyComplete: NO,
  
  enterState: function() { 
    this.startChallenge();
  },
  
  startChallenge: function() {
    this.set('challengeComplete', NO);
    this.set('challengeWasAlreadyComplete', NO);
    
    this.get('statechart').sendAction('blockNextNavButton');
    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', YES);
  },
  
  endChallenge: function() {
    this.set('challengeComplete', YES);
    this.get('statechart').sendAction('unblockNextNavButton');

    // Award a "star" for completion
    var pageId = Geniverse.activityController.get('guid');
    Geniverse.userController.setPageStars(pageId, 1);
    Geniverse.store.commitRecords();

    // why can't bindings in SC work as advertised?
    Lab.caselogController.propertyDidChange("userMetadata");
  },
  
  didSendBlogPost: function() {
    if (this.get('challengeComplete')) {
      this.set('challengeWasAlreadyComplete', YES);
    } else {
      this.endChallenge();
    }
  },
  
  // Needs to be DRY'd up - see match TargetDrakesListChallenge.js
  checkMatchDragon: function(dragons, view) {
    Geniverse.scoringController.incrementScore(1);
    
    if (Geniverse.matchController.doesMatch(dragons[0], dragons[1])) {
      view.setPath('content.hasBeenMatched', YES);
      view._setClassNames();
      SC.AlertPane.extend({layout: {top: 0, centerX: 0, width: 300, height: 100 }}).plain(
        "Good work!", 
        "The drake you have created matches the target drake.",
        "",
        "OK",
        "",
        this
      );
    } else {
      SC.AlertPane.extend({layout: {top: 0, centerX: 0, width: 300, height: 100 }}).error(
        "That's not the drake!", 
        "The drake you have created doesn't match the target drake. Please try again.",
        "",
        "Try again",
        "",
        this
      );
    }
  },

  exitState: function() { 
  }
  
});
