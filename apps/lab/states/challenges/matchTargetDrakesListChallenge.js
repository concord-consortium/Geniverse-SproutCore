// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

Lab.matchTargetDrakesListChallenge = Ki.State.extend({
  
  successfulMatch: NO,

  challengeComplete: NO,
  
  organismView: null,
  
  enterState: function() { 
    // for now, we assume that there are match dragons
    this.startChallenge();
  },
  
  startChallenge: function() {
    this.statechart.getState('inActivity').blockNextNavButton(true);
    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', NO);
  },
  
  endChallenge: function() {
    this.challengeComplete = YES;
    this.statechart.getState('inActivity').blockNextNavButton(false);
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
    }
  },
  
  _challengeComplete: function() {
    // Notify the user that they're done
    var moveOnMessage = (!!Geniverse.activityController.getNextActivity()) ? 
      "Move on to the next challenge using the green arrow below." :
      "Go back to the case log using the button at the top left to go to a new case.";
    SC.AlertPane.extend({layout: {top: 0, centerX: 0, width: 400, height: 100 }}).plain(
      "You've completed all the trials in this challenge!", 
      moveOnMessage,
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
