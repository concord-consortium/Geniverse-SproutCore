// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

Lab.matchTargetDrakesListChallenge = Ki.State.extend({
  
  successfulMatch: NO,

  challengeComplete: NO,
  
  organismView: null,
  
  starsEarned: 0,
  
  enterState: function() { 
    // for now, we assume that there are match dragons
    this.startChallenge();
  },
  
  startChallenge: function() {
    this.get('statechart').sendAction('blockNextNavButton');
    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', NO);
    this.set('challengeComplete', NO);

    Geniverse.scoringController.set('numberOfTrials', 1);
  },
  
  endChallenge: function() {
    this.challengeComplete = YES;
    this.get('statechart').sendAction('unblockNextNavButton');

    // Award the stars
    var stars = Geniverse.scoringController.get('achievedChallengeStars');
    var pageId = Geniverse.activityController.get('guid');
    Geniverse.userController.setPageStars(pageId, stars);
    this.starsEarned = stars;
  },
  
  // Annoyingly, actions can only be called with a max of two arguments,
  // so we call this with the first argument being an array of the
  // two dragons to be matched:
  //
  // @param dragons   an array [dragon1, dragon2]
  // @param view      the view to be updated
  checkMatchDragon: function(dragons, view) {
    if (Geniverse.matchController.doesMatch(dragons[0], dragons[1])) {
      view.setPath('content.hasBeenMatched', YES);
      view._setClassNames();
      SC.AlertPane.extend({layout: {top: 0, centerX: 0, width: 300, height: 100 }}).plain(
        "Good work!", 
        "The drake you have created matches the target drake.",
        "",
        "OK",
        "",
        this
      );
    } else {
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
    if (this.get('challengeComplete')){
      return;
    }
    
    var numUnmatchedDrakes = Geniverse.matchController.filterProperty('hasBeenMatched', false).length;
    if (numUnmatchedDrakes === 0) {
      this._challengeComplete();
      Geniverse.scoringController.resetScore();
      Geniverse.scoringController.resetChallengeScore();
    }
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
  
  exitState: function() { 
  }
  
});
