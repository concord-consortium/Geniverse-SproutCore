// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC static_url*/

/**
 This is a generic top-level challenge state, and is intended to be extended by the
 actual challenge states.
**/ 
Lab.challenge = Ki.State.extend({
  
  challengeComplete: NO,
  
  challengePreviouslyCompleted: NO,
  
  starsEarned: 0,
  
  enterState: function() {
    var metadata   = Geniverse.userController.getUserMetadata(),
        activityId = Geniverse.activityController.get("guid");

    if (metadata.stars && metadata.stars[activityId]) {
      this.challengePreviouslyCompleted = YES;
    }
    this.startChallenge();
  },
  
  startChallenge: function() {
    if (this.challengePreviouslyCompleted) {
      this.get('statechart').sendAction('unblockNextNavButton');
    } else {
      this.get('statechart').sendAction('blockNextNavButton');
    }
  },

  endChallenge: function() {
    this.challengeComplete = YES;
    this.get('statechart').sendAction('unblockNextNavButton');

    // Award the stars
    var stars = Geniverse.scoringController.get('achievedChallengeStars');
    var pageId = Geniverse.activityController.get('guid');
    Geniverse.userController.setPageStars(pageId, stars);
    
    // save stars to the backend imediately, so we don't lose this data if the user hard quits
    Geniverse.store.commitRecords();
    
    this.starsEarned = stars;
  },

  _challengeComplete: function() {
    this.endChallenge();
    
    var next = Geniverse.activityController.getNextActivity();
    
    // Notify the user that they're done
    var starImageUrl = this.starsEarned === 3 ? static_url('three-star.png') : 
          this.starsEarned === 2 ? static_url('two-star.png') : static_url('one-star.png');
    var starsMessage = "<img src='"+starImageUrl+"' class='centered-block'/>\n"+
                       "You earned "+this.starsEarned+" star" + (this.starsEarned === 1 ? "" : "s") + "!\n\n";
    var nextMessage = "If you want to retry this challenge, click the 'Retry' button."+
                      " Otherwise click the 'Go on' button to " + (next ? "go to the next activity" : "go back to the case log.");
      
    SC.AlertPane.extend({
      layout: {top: 0, centerX: 0, width: 350, height: 100 },
      displayDescription: function() {
        var desc = this.get('description');
        if (!desc || desc.length === 0) {return desc;} 
        return '<p class="description">' + desc.split('\n').join('</p><p class="description">') + '</p>';
      }.property('description').cacheable()}).plain(
      "Good work!", 
      "You've completed all the trials in this challenge!\n"+starsMessage+nextMessage,
      "",
      (next ? "Go on to the next activity" : "Go back to the case log"),
      "Retry this activity",
      {
        alertPaneDidDismiss: function(pane, status) { 
          if (status === SC.BUTTON1_STATUS) {
            if (next) {
              Lab.statechart.sendAction('gotoNextActivity');
            } else {
              Lab.routes.gotoCaseLogPage2();
            }
          } else {
            Lab.statechart.sendAction('repeatChallenge');
          }
        }
      }
    );
  },
  
  _updateNumTrials: function() {
    Geniverse.scoringController.set('numberOfTrials', Geniverse.matchController.getPath('arrangedObjects.length'));
  },

  exitState: function() {
  }

});
