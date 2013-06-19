// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC sc_super*/

sc_require('whyville');

Lab.matchThreeToOneChallenge = Lab.challenge.extend({

  successfulMatch: NO,

  organismViews: [],
  matchedOrganismViews: [],
  duplicateOrganismViews: [],
  incorrectOrganismViews: [],

  buttonView: null,

  startChallenge: function() {
    sc_super();
    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', NO);

    // This needs to happen after the match dragons are loaded into the controller....
    Geniverse.matchController.addObserver('arrangedObjects.length', this._updateNumTrials);
  },

  exitState: function() {
    sc_super();
    Geniverse.matchController.removeObserver('arrangedObjects.length', this._updateNumTrials);
  },

  revealClicked: function(buttonView) {
    this.buttonView = buttonView;
    this.get('statechart').sendAction("checkAnswerIfDrakesReady");
  },

  checkAnswer: function() {
    sc_super();
    var parent = this.buttonView.get('parentView');
    this.organismViews = parent.get('organismViews');
    this._revealImages();

    this.matchedOrganismViews = [];
    this.duplicateOrganismViews = [];
    this.incorrectOrganismViews = [];

    var alleleStrs = this.organismViews.map(function(orgView) { return orgView.getPath('content.alleles'); });
    var dupes = alleleStrs.map(function(alleles) {
      if (alleleStrs.indexOf(alleles) != alleleStrs.lastIndexOf(alleles)) {
        return YES;
      }
      return NO;
    });
    var self = this;
    var matches = this.organismViews.map(function(orgView) { return self._drakesMatch(orgView.get('content')); });

    for (var i = 0; i < this.organismViews.length; i++) {
      var dupe = dupes[i];
      var match = matches[i];
      var orgView = this.organismViews[i];

      if (dupe && match) {
        this.duplicateOrganismViews.push(orgView);
      } else if (match) {
        this.matchedOrganismViews.push(orgView);
      } else {
        this.incorrectOrganismViews.push(orgView);
      }
    }

    this._showAlert();
  },

  _showAlert: function() {
    SC.Timer.schedule({
      target: this,
      action: function () {
        var numMatched = this.matchedOrganismViews.length;
        var numDupes = this.duplicateOrganismViews.length;
        var numIncorrect = this.incorrectOrganismViews.length;

        if (numMatched === 3){
          this.successfulMatch = YES;
          Lab.whyville.reportChallenge(this.successfulMatch);
            
          SC.AlertPane.extend(Lab.screenMixin, {layout: {top: 0, right: 0, width: 300, height: 100 }}).plain(
            "Good work!",
            "All of the dragons you have created match the target dragon.",
            "",
            "OK",
            "",
            this
          );
        } else {
          Geniverse.scoringController.incrementScore(1);

          this.successfulMatch = NO;
          Lab.whyville.reportChallenge(this.successfulMatch);
            
          this._resetTargetMatchedState();

          // if we only have matches and duplicates, display the message about duplicates.
          // otherwise, display a message about incorrect dragons.
          if (numIncorrect > 0) {
            var msg = "";
            if (numIncorrect === 3) {
              msg = "None of the dragons you have created match the target.";
            } else {
              msg = "" + numIncorrect + " of the dragons you have created do" + (numIncorrect === 1 ? "es" : "") + "n't match the target.";
              if (numDupes !== 0) {
                msg += " Also, some of your dragons are exactly the same! All of your dragons need to have different alleles.";
              }
            }
            msg += " Please try again.";
            SC.AlertPane.extend(Lab.screenMixin, {layout: {top: 0, right: 0, width: 300, height: 100 }}).error(
              "You didn't get all of them.",
              msg,
              "",
              "Try again",
              "",
              this
            );
          } else {
            SC.AlertPane.extend(Lab.screenMixin, {layout: {top: 0, right:0, width: 300, height: 100 }}).error(
              "You have some duplicates.",
              "Some of your dragons are exactly the same! All of your dragons need to have different alleles.",
              "",
              "Try again",
              "",
              this
            );
          }
        }
      },
      interval: 500,
      repeats: NO
    });

  },

  _revealImages: function(){
    SC.RunLoop.begin();
    for (var i = 0; i < this.organismViews.length; i++) {
      this.organismViews[i].set('hideDragon', NO);
    }
    SC.RunLoop.end();
    for (i = 0; i < this.organismViews.length; i++) {
      this.organismViews[i].get('imageView').notifyPropertyChange('valueNeedsRecalculated');
    }
  },

  _hideImages: function(){
    SC.RunLoop.begin();
    var i = 0;
    if (this.successfulMatch) {
      // hide all of them again
      for (i = 0; i < this.organismViews.length; i++) {
        this.organismViews[i].set('hideDragon', YES);
      }
    } else {
      for (i = 0; i < this.incorrectOrganismViews.length; i++) {
        this.incorrectOrganismViews[i].set('hideDragon', YES);
      }
      for (i = 0; i < this.duplicateOrganismViews.length; i++) {
        this.duplicateOrganismViews[i].set('hideDragon', YES);
      }
    }
    SC.RunLoop.end();
    for (i = 0; i < this.organismViews.length; i++) {
      this.organismViews[i].get('imageView').notifyPropertyChange('valueNeedsRecalculated');
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
    }
    this._hideImages();
    this.successfulMatch = NO;
  },

  _drakesMatch: function(dragon) {
    return Geniverse.matchController.doesMatchCurrent(dragon);
  },

  _resetTargetMatchedState: function() {
    Geniverse.matchController.setPath('currentDragon.hasBeenMatched', NO);
  }

});
