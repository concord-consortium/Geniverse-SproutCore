// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC static_url sc_super*/

sc_require('whyville');

Lab.matchOneAtATimeChallenge = Lab.challenge.extend({

  successfulMatch: NO,

  organismView: null,

  starsEarned: 0,

  firstChromosomeDragonLoaded: NO,

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

  matchDragonChanged: function() {
    this.setTargetScore();
  },

  chromosomeDragonChanged: function() {
    if (!this.firstChromosomeDragonLoaded) {
      this.firstChromosomeDragonLoaded = YES;
      this.setTargetScore();
    }
  },

  setTargetScore: function() {
    var initialDragon = Geniverse.dragonGenomeController.get('firstDragon');
    if (initialDragon && initialDragon.get('characteristicMap') &&
        Geniverse.matchController.get("currentDragon") && Geniverse.matchController.get("currentDragon").get('characteristicMap')) {
      Geniverse.scoringController.set('minimumScore', Geniverse.matchController.numberOfMovesToReachCurrent(initialDragon));
    }
  },

  revealClicked: function(buttonView) {
    this.buttonView = buttonView;
    this.get('statechart').sendAction("checkAnswerIfDrakesReady");
  },

  checkAnswer: function() {
    sc_super();
    this.organismView = this.buttonView.getPath('parentView.genomeView.dragonView');
    this._revealImage();

    SC.Timer.schedule({
      target: this,
      action: function () {
        if (this._drakesMatch(this.organismView.get('content'))){
          this.successfulMatch = YES;
          Lab.whyville.reportChallenge(this.successfulMatch);
            
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
          Lab.whyville.reportChallenge(this.successfulMatch);
            
          Geniverse.scoringController.incrementScore(1);
          SC.AlertPane.extend(Lab.screenMixin, {layout: {top: 150, centerX: 200, width: 300, height: 100 }}).error(
            "That's not the dragon!",
            "The dragon you have created doesn't match the target dragon. Please try again.",
            "",
            "Try again",
            "",
            this
          );
        }
      },
      interval: 500,
      repeats: NO
    });

  },

  _revealImage: function(){
    SC.RunLoop.begin();
      this.organismView.set('hideDragon', NO);
    SC.RunLoop.end();

    this.organismView.get('imageView').notifyPropertyChange('valueNeedsRecalculated');
  },

  _hideImage: function(){
    SC.RunLoop.begin();
      this.organismView.set('hideDragon', YES);
    SC.RunLoop.end();

    this.organismView.get('imageView').notifyPropertyChange('valueNeedsRecalculated');
  },

  alertPaneDidDismiss: function() {
    if (this.successfulMatch){
      if (Geniverse.matchController.isLastDragon()) {
        this._challengeComplete();
        // reset will happen in _challengeComplete()
      } else {
        Geniverse.scoringController.resetScore();
        Geniverse.matchController.nextDragon();
      }
      this.successfulMatch = NO;
    }
    this._hideImage();
  },

  _drakesMatch: function(dragon) {
    return Geniverse.matchController.doesMatchCurrent(dragon);
  }

});
