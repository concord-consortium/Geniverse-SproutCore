// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

Lab.matchThreeToOneChallenge = Ki.State.extend({
  
  successfulMatch: NO,

  challengeComplete: NO,
  
  organismViews: [],
  matchedOrganismViews: [],
  duplicateOrganismViews: [],
  
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
    var parent = buttonView.get('parentView');
    this.organismViews = parent.get('organismViews');
    this._revealImages();

    this.matchedOrganismViews = [];
    this.duplicateOrganismViews = [];

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

      if (dupe) {
        this.duplicateOrganismViews.push(orgView);
      } else if (match) {
        this.matchedOrganismViews.push(orgView);
      }
    }

    this._showAlert();
  },

  _showAlert: function() {
    SC.Timer.schedule({
      target: this,
      action: function () {
        var numMatched = this.matchedOrganismViews.length;
        if (numMatched === 3){
          this.successfulMatch = YES;
          SC.AlertPane.extend({layout: {right: 0, centerY: 0, width: 300, height: 100 }}).plain(
            "Good work!", 
            "All of the drakes you have created match the target drake.",
            "",
            "OK",
            "",
            this
          );
        } else {
          this.successfulMatch = NO;
          this._resetTargetMatchedState();

          if (this.duplicateOrganismViews.length > 0) {
            SC.AlertPane.extend({layout: {right: 0, centerY: 0, width: 300, height: 100 }}).error(
              "You have some duplicates.",
              "Some of your dragons are exactly the same! All of your dragons need to have different alleles.",
              "",
              "Try again",
              "",
              this
            );
          } else {
            var msg = "";
            if (numMatched === 0) {
              msg = "None of the drakes you have created match the target. Please try again.";
            } else {
              msg = "Only " + numMatched + " of the drakes you have created match the target. Please try again.";
            }
            SC.AlertPane.extend({layout: {right: 0, centerY: 0, width: 300, height: 100 }}).error(
              "You didn't get all of them.",
              msg,
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
    for (var i = 0; i < this.organismViews.length; i++) {
      this.organismViews[i].set('hideDragon', YES);
    }
    SC.RunLoop.end();
    for (i = 0; i < this.organismViews.length; i++) {
      this.organismViews[i].get('imageView').notifyPropertyChange('valueNeedsRecalculated');
    }
  },
  
  alertPaneDidDismiss: function() {
    if (this.challengeComplete) {
      // TODO Navigate to the next challenge!
    } else if (this.successfulMatch){
      if (Geniverse.matchController.isLastDragon()) {
        this._challengeComplete();
      } else {
        Geniverse.matchController.nextDragon();
      }
    }
    this._hideImages();
  },
  
  _drakesMatch: function(dragon) {
    return Geniverse.matchController.doesMatchCurrent(dragon);
  },
  
  _resetTargetMatchedState: function() {
    Geniverse.matchController.currentDragon().set('hasBeenMatched', NO);
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
