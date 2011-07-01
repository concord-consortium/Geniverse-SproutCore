// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

Lab.matchOneAtATimeChallenge = Ki.State.extend({
  
  successfulMatch: NO,

  challengeComplete: NO,
  
  organismView: null,
  
  enterState: function() { 
    // for now, we assume that there are match dragons
    this.startChallenge();
  },
  
  startChallenge: function() {
    this.statechart.getState('inActivity').blockNextNavButton(true);
  },
  
  endChallenge: function() {
    this.challengeComplete = YES;
    this.statechart.getState('inActivity').blockNextNavButton(false);
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
    if (this.challengeComplete) {
      // TODO Navigate to the next challenge!
    } else if (this.successfulMatch){
      Geniverse.scoringController.resetScore();
      if (Geniverse.matchController.isLastDragon()) {
        this._challengeComplete();
      } else {
        Geniverse.matchController.nextDragon();
      }
    }
    this._hideImage();
  },
  
  _drakesMatch: function(dragon) {
    return Geniverse.matchController.doesMatchCurrent(dragon);
  },

  _challengeComplete: function() {
    // Notify the user that they're done
    SC.AlertPane.extend({layout: {top: 0, centerX: 0, width: 300, height: 100 }}).plain(
      "Good work!", 
      "You've completed all the trials in this challenge!",
      "",
      "OK",
      "",
      this
    );
    
    this.endChallenge();
  },
  
  exitState: function() { 
  }
  
});
