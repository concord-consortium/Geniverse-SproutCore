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
      var pageId = Geniverse.activityController.get('route'),
      stars = Geniverse.userController.getPageStars(pageId);
    this.set('challengeWasAlreadyComplete', stars == 1);

    this.get('statechart').sendAction('blockNextNavButton');
    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', NO);
  },

  endChallenge: function() {
    this.set('challengeComplete', YES);
    this.get('statechart').sendAction('unblockNextNavButton');

    Geniverse.doWhenReady(this, Geniverse.userController.get('content'), function() {
      // Award a "star" for completion
      var pageId = Geniverse.activityController.get('route');
      Geniverse.userController.setPageStars(pageId, 1);

      Lab.logController.logEvent(Lab.EVENT.COMPLETED_CHALLENGE, {route: pageId, starsAwarded: 1});

      // unlock any unlockables
      Geniverse.unlockablesController.unlockFor(pageId);

      Geniverse.store.commitRecords();
      // why can't bindings in SC work as advertised?
      Lab.caselogController.propertyDidChange("userMetadata");
    });
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
