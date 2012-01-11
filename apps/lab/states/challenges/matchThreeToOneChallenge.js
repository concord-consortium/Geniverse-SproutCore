// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

Lab.matchThreeToOneChallenge = Ki.State.extend({
  
  successfulMatch: NO,

  challengeComplete: NO,
  
  starsEarned: 0,
  
  organismViews: [],
  matchedOrganismViews: [],
  duplicateOrganismViews: [],
  incorrectOrganismViews: [],
  
  enterState: function() { 
    // for now, we assume that there are match dragons
    this.startChallenge();
  },
  
  startChallenge: function() {
    this.statechart.getState('inActivity').blockNextNavButton(true);
    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', NO);

    // This needs to happen after the match dragons are loaded into the controller....
    Geniverse.matchController.addObserver('arrangedObjects.length', this._updateNumTrials);
  },
  
  endChallenge: function() {
    this.challengeComplete = YES;
    this.statechart.getState('inActivity').blockNextNavButton(false);

    // Award the stars
    var stars = Geniverse.scoringController.get('achievedChallengeStars');
    var pageId = Geniverse.activityController.get('guid');
    Geniverse.userController.setPageStars(pageId, stars);
    this.starsEarned = stars;
  },
  
  revealClicked: function(buttonView) {
    var parent = buttonView.get('parentView');
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

          // if we only have matches and duplicates, display the message about duplicates.
          // otherwise, display a message about incorrect dragons.
          if (numIncorrect > 0) {
            var msg = "";
            if (numIncorrect === 3) {
              msg = "None of the drakes you have created match the target.";
            } else {
              msg = "" + numIncorrect + " of the drakes you have created do" + (numIncorrect === 1 ? "es" : "") + "n't match the target.";
              if (numDupes !== 0) {
                msg += " Also, some of your drakes are exactly the same! All of your drakes need to have different alleles.";
              }
            }
            msg += " Please try again.";
            SC.AlertPane.extend({layout: {right: 0, centerY: 0, width: 300, height: 100 }}).error(
              "You didn't get all of them.",
              msg,
              "",
              "Try again",
              "",
              this
            );
          } else {
            SC.AlertPane.extend({layout: {right: 0, centerY: 0, width: 300, height: 100 }}).error(
              "You have some duplicates.",
              "Some of your drakes are exactly the same! All of your drakes need to have different alleles.",
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
      Geniverse.scoringController.resetScore();
      if (Geniverse.matchController.isLastDragon()) {
        this._challengeComplete();
        Geniverse.scoringController.resetChallengeScore();
      }
      Geniverse.matchController.nextDragon();
    }
    this._hideImages();
    this.successfulMatch = NO;
  },
  
  _drakesMatch: function(dragon) {
    return Geniverse.matchController.doesMatchCurrent(dragon);
  },
  
  _resetTargetMatchedState: function() {
    Geniverse.matchController.setPath('currentDragon.hasBeenMatched', NO);
  },

  _challengeComplete: function() {
    this.endChallenge();
    
    // Notify the user that they're done
    var starImageUrl = this.starsEarned === 3 ? static_url('three-star.png') : 
          this.starsEarned === 2 ? static_url('two-star.png') : static_url('one-star.png');
    var starsMessage = "<img src='"+starImageUrl+"' class='centered-block'/>\n"+
                       "You earned "+this.starsEarned+" star" + (this.starsEarned === 1 ? "" : "s") + "!\n\n";
    var moveOnMessage = (!!Geniverse.activityController.getNextActivity()) ? 
      "Move on to the next challenge using the green arrow below." :
      "Go back to the case log using the button at the top left to go to a new case.";
      
    SC.AlertPane.extend({
      layout: {top: 0, centerX: 0, width: 350, height: 100 },
      displayDescription: function() {
        var desc = this.get('description');
        if (!desc || desc.length === 0) {return desc;} 
        return '<p class="description">' + desc.split('\n').join('</p><p class="description">') + '</p>';
      }.property('description').cacheable()}).plain(
      "Good work!", 
      "You've completed all the trials in this challenge!\n"+starsMessage+moveOnMessage,
      "",
      "OK",
      "",
      this
    );
  },
  
  _updateNumTrials: function() {
    Geniverse.scoringController.set('numberOfTrials', Geniverse.matchController.getPath('arrangedObjects.length'));
  },

  exitState: function() { 
    Geniverse.matchController.removeObserver('arrangedObjects.length', this._updateNumTrials);
  }
  
});
