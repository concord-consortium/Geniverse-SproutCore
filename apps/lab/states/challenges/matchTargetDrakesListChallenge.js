// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

sc_require('whyville');

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

  alertPaneDidDismiss: function() {
    var numUnmatchedDrakes = Geniverse.matchController.filterProperty('hasBeenMatched', false).length;
    if (numUnmatchedDrakes === 0) {
      this._challengeComplete();
    }
  },

  didBreed: function() {
    if (!this._hasBred) {
      setTimeout(function() {
        SC.AlertPane.extend(Lab.screenMixin, {layout: {top: 0, centerX: 0, width: 300, height: 100 }}).plain(
          "",
          "To match a target, drag an offspring to it.",
          "",
          "OK",
          "",
          this
        );
      }, 800);      // delay a little
      this._hasBred = true;
    }
  },

  didBreedMeiosis: function() {
    if (!this._hasBredMeiosis) {
      this._hasBred = false;
      this.didBreed();
      this._hasBredMeiosis = true;
    }
  }

});
