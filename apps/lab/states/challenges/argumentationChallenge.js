// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

sc_require('whyville');

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
    var pageId = Geniverse.activityController.get('route');
    Geniverse.userController.setPageStars(pageId, 1);

    // unlock any unlockables
    Geniverse.unlockablesController.unlockFor(pageId);

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
      
      Lab.whyville.reportChallenge(true);
      
      SC.AlertPane.extend(Lab.screenMixin, {layout: {top: 150, centerX: 0, width: 300, height: 100 }}).plain(
        "Good work!",
        "The dragon you have created matches the target dragon.",
        "",
        "OK",
        "",
        this
      );
    } else {
      Lab.whyville.reportChallenge(false);
      
      SC.AlertPane.extend(Lab.screenMixin, {layout: {top: 150, centerX: 0, width: 300, height: 100 }}).error(
        "That's not the dragon!",
        "The dragon you have created doesn't match the target dragon. Please try again.",
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
