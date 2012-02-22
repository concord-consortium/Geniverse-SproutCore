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
  },
  
  didSendBlogPost: function() {
    if (this.get('challengeComplete')) {
      this.set('challengeWasAlreadyComplete', YES);
    } else {
      this.endChallenge();
    }
  },
  
  exitState: function() { 
  }
  
});
