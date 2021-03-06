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
        activityId = Geniverse.activityController.get("route");
    if (metadata.stars && metadata.stars[activityId]) {
      this.challengePreviouslyCompleted = YES;
    } else {
      this.challengePreviouslyCompleted = NO;
    }
    this.startChallenge();
  },

  startChallenge: function() {
    if (this.challengePreviouslyCompleted) {
      this.get('statechart').sendAction('unblockNextNavButton');
    } else {
      this.get('statechart').sendAction('blockNextNavButton');
    }

    // preload spinner icon -- no point in a spinner for slow connections if we have to wait for the spinner
    var img = new Image();
    img.src = static_url('spinner-large.gif');
  },

  endChallenge: function() {
    this.challengeComplete = YES;
    this.get('statechart').sendAction('unblockNextNavButton');

    // Award the stars
    var stars = Geniverse.scoringController.get('achievedChallengeStars');
    var pageId = Geniverse.activityController.get('route');
    Geniverse.userController.setPageStars(pageId, stars);

    // why can't bindings in SC work as advertised?
    Lab.caselogController.propertyDidChange("userMetadata");

    // save stars to the backend imediately, so we don't lose this data if the user hard quits
    Geniverse.store.commitRecords();

    this.starsEarned = stars;

    Lab.logController.logEvent(Lab.EVENT.COMPLETED_CHALLENGE, {route: pageId, starsAwarded: stars});
  },

  checkAnswerIfDrakesReady: function() {
    if (!Geniverse.gwtController.get("drakesArePending")) {
      this.checkAnswer();
    } else {
      this.spinnerPanel = SC.PanelPane.create({
        layout: { width: 100, height: 100, centerX: 0, centerY: 0 },
        classNames: ['frameless'],
        contentView: SC.ImageView.extend({
          value: static_url('spinner-large.gif')
        })
      }).append();
      Geniverse.gwtController.addObserver("drakesArePending", this, "checkAnswer");
    }
  },

  // to be overwritten by challenge implementations
  checkAnswer: function() {
    if (this.spinnerPanel) {
      Geniverse.gwtController.removeObserver("drakesArePending", this, "checkAnswer");
      this.spinnerPanel.remove();
      this.spinnerPanel = null;
    }
  },

  _challengeComplete: function(message) {
    var self = this;
    this.endChallenge();

    if (!message) {
      message = "You've completed all the trials in this challenge!\n";
    }

    var next = Geniverse.activityController.getNextActivity();

    // Notify the user that they're done
    var starImageUrl = this.starsEarned === 3 ? static_url('three-star.png') :
          this.starsEarned === 2 ? static_url('two-star.png') : static_url('one-star.png');
    var starsMessage = "<img src='"+starImageUrl+"' class='centered-block'/>\n"+
                       "You earned "+this.starsEarned+" star" + (this.starsEarned === 1 ? "" : "s") + "!\n\n";

    SC.AlertPane.extend({
      layout: {top: 0, centerX: 0, width: 350, height: 100 },
      displayDescription: function() {
        var desc = this.get('description');
        if (!desc || desc.length === 0) {return desc;}
        return '<p class="description">' + desc.split('\n').join('</p><p class="description">') + '</p>';
      }.property('description').cacheable()}).plain(
      "Good work!",
      message+starsMessage,
      "",
      (next ? "Go on to the next challenge" : "Go back to the Case Log"),
      "Try again",
      {
        alertPaneDidDismiss: function(pane, status) {
          Geniverse.scoringController.resetChallengeScore();
          Geniverse.scoringController.resetScore();
          Geniverse.matchController.nextDragon();
          if (status === SC.BUTTON1_STATUS) {
              self._showCongrats(next);
          } else {
            // unlock any unlockables
            var pageId = Geniverse.activityController.get('route');
            Geniverse.unlockablesController.unlockFor(pageId);

            Lab.statechart.sendAction('repeatChallenge');
          }
        }
      }
    );
  },

  _showCongrats: function(next) {
    var self = this;
    var congrats = Geniverse.activityController.get('congratulations');
    if (typeof(congrats) != 'undefined' && congrats !== null && congrats !== "") {
      Lab.congratulationsController.display(congrats, function() {
        self._moveOn(next);
      });
    } else {
      self._moveOn(next);
    }
  },

  _moveOn: function(next) {
    // unlock any unlockables
    var pageId = Geniverse.activityController.get('route');
    Geniverse.unlockablesController.unlockFor(pageId);

    if (next) {
      Lab.statechart.sendAction('gotoNextActivity');
    } else {
      Lab.routes.openCaselogRoute();
    }
  },

  _updateNumTrials: function() {
    Geniverse.scoringController.set('numberOfTrials', Geniverse.matchController.getPath('arrangedObjects.length'));
  },

  exitState: function() {
  }

});
