// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

Lab.matchTargetDrakesListChallenge = Lab.challenge.extend({

  successfulMatch: NO,

  organismView: null,

  _hasBred: NO,
  _hasBredMeiosis: NO,

  startChallenge: function() {
    sc_super();
    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', NO);

    Geniverse.scoringController.set('numberOfTrials', 1);
  },

  // Annoyingly, actions can only be called with a max of two arguments,
  // so we call this with the first argument being an array of the
  // two dragons to be matched:
  //
  // @param dragons   an array [dragon1, dragon2]
  // @param view      the view to be updated
  // Needs to be DRY'd up - see match TargetDrakesListChallenge.js
  checkMatchDragon: function(dragons, view) {
    Geniverse.scoringController.incrementScore(1);

    if (Geniverse.matchController.doesMatch(dragons[0], dragons[1])) {
      view.setPath('content.hasBeenMatched', YES);
      view._setClassNames();
      SC.AlertPane.extend({layout: {centerY: 0, centerX: 0, width: 300, height: 100 }}).plain(
        "Good work!",
        "The drake you have created matches the target drake.",
        "",
        "OK",
        "",
        this
      );
    } else {
      SC.AlertPane.extend({layout: {centerY: 0, centerX: 0, width: 300, height: 100 }}).error(
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
    var numUnmatchedDrakes = Geniverse.matchController.filterProperty('hasBeenMatched', false).length;
    if (numUnmatchedDrakes === 0) {
      this._challengeComplete();
    }
  },

  didBreed: function() {
    // we no longer pop up message
  },

  didBreedMeiosis: function() {
    if (!this._hasBredMeiosis) {
      this._hasBred = false;
      this.didBreed();
      this._hasBredMeiosis = true;
    }
  }

});
