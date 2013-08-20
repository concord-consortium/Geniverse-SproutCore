// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

sc_require('whyville');

Lab.matchTargetDrakesOneAtATimeChallenge = Lab.challenge.extend({

  successfulMatch: NO,

  startChallenge: function() {
    sc_super();
    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', NO);

    // This needs to happen after the match dragons are loaded into the controller....
    Geniverse.matchController.addObserver('arrangedObjects.length', this._updateNumTrials);
  },

  // Annoyingly, actions can only be called with a max of two arguments,
  // so we call this with the first argument being an array of the
  // two dragons to be matched:
  //
  // @param dragons   an array [dragon1, dragon2]
  // @param view      the view to be updated
  checkMatchDragon: function(dragons, view) {
    Geniverse.scoringController.incrementScore(1);

    if (Geniverse.matchController.doesMatch(dragons[0], dragons[1])) {
      view.setPath('content.hasBeenMatched', YES);
      view._setClassNames();
      this.successfulMatch = YES;
      
      SC.AlertPane.extend(Lab.screenMixin, {layout: {top: 150, centerX: 0, width: 300, height: 100 }}).plain(
        "Good work!",
        "The dragon you have created matches the target dragon.",
        "",
        "OK",
        "",
        this
      );
    } else {
      this.successfulMatch = NO;
      var info = {
        action: "submitted dragon",
        targetDragon:    dragons[0].get('gOrganism').genetics.getAlleleString(),
        submittedDragon: dragons[1].get('gOrganism').genetics.getAlleleString()
      };
      Lab.whyville.reportChallenge(false, info);
      
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

  alertPaneDidDismiss: function() {
    if (this.successfulMatch){
      if (Geniverse.matchController.isLastDragon()) {
        this._challengeComplete();
      } else {
        Geniverse.scoringController.resetScore();
        Geniverse.matchController.nextDragon();
      }
      this.successfulMatch = NO;
    }
  },

  exitState: function() {
    sc_super();
    Geniverse.matchController.removeObserver('arrangedObjects.length', this._updateNumTrials);
  }

});
