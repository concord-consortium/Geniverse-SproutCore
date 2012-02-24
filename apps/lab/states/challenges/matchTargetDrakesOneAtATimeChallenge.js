// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

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
      SC.AlertPane.extend({layout: {top: 0, centerX: 0, width: 300, height: 100 }}).plain(
        "Good work!", 
        "The drake you have created matches the target drake.",
        "",
        "OK",
        "",
        this
      );
    } else {
      this.successfulMatch = NO;
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

  alertPaneDidDismiss: function() {
    if (this.successfulMatch){
      if (Geniverse.matchController.isLastDragon()) {
        this._challengeComplete();
        Geniverse.scoringController.resetChallengeScore();
      }
      // reset score after we do any lastDragon stuff, so that challenge
      // scores will be calculated correctly.
      Geniverse.scoringController.resetScore();
      Geniverse.matchController.nextDragon();
      this.successfulMatch = NO;
    }
  },

  exitState: function() {
    sc_super();
    Geniverse.matchController.removeObserver('arrangedObjects.length', this._updateNumTrials);
  }

});
