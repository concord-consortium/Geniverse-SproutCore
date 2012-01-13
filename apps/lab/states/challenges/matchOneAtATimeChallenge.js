// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC static_url*/

Lab.matchOneAtATimeChallenge = Lab.challenge.extend({
  
  successfulMatch: NO,
  
  organismView: null,
  
  starsEarned: 0,
  
  firstChromosomeDragonLoaded: NO,
  
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
    if (!!initialDragon && !!initialDragon.get('characteristicMap') &&
        !!Geniverse.matchController.get("currentDragon") && !!Geniverse.matchController.get("currentDragon").get('characteristicMap')) {
      Geniverse.scoringController.set('minimumScore', Geniverse.matchController.numberOfMovesToReachCurrent(initialDragon));
    }
  },

  revealClicked: function(buttonView) {
    this.organismView = buttonView.get('parentView');
    this._revealImage();
    
    SC.Timer.schedule({
      target: this,
      action: function () {
        if (this._drakesMatch(this.organismView.get('content'))){
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
      interval: 500,
      repeats: NO
    });
    
  },
  
  _revealImage: function(){
    SC.RunLoop.begin();
      this.organismView.set('useRevealButton', NO);
    SC.RunLoop.end();
    
    this.organismView.get('imageView').notifyPropertyChange('valueNeedsRecalculated');
  },
  
  _hideImage: function(){
    SC.RunLoop.begin();
      this.organismView.set('useRevealButton', YES);
    SC.RunLoop.end();
    
    this.organismView.get('imageView').notifyPropertyChange('valueNeedsRecalculated');
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
    this._hideImage();
  },
  
  _drakesMatch: function(dragon) {
    return Geniverse.matchController.doesMatchCurrent(dragon);
  }

});
