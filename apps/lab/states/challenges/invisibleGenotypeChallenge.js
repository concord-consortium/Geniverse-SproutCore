// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

sc_require('whyville');

Lab.invisibleGenotypeChallenge = Lab.challenge.extend({

  challengeComplete: NO,
  challengeWasAlreadyComplete: NO,

  solved: NO,

  enterState: function() {
    this.startChallenge();
  },

  startChallenge: function() {
    this.set('challengeComplete', NO);
    this.set('challengeWasAlreadyComplete', NO);
    this.set('solved', NO);

    this.get('statechart').sendAction('blockNextNavButton');
    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', YES);
  },

  endChallenge: function() {
    this.set('challengeComplete', YES);
    this.get('statechart').sendAction('unblockNextNavButton');

    var pageId = Geniverse.activityController.get('route');
    Geniverse.userController.setPageStars(pageId, this.get('starsEarned'));

    Lab.whyville.reportChallenge(true, {stars: this.get('starsEarned')});
    Geniverse.store.commitRecords();

    // why can't bindings in SC work as advertised?
    Lab.caselogController.propertyDidChange("userMetadata");
  },

  solveInvisibleMaleGenotype: function() {
    Geniverse.invisibleGenomeController.set('content', Geniverse.challengePoolController.get('firstMale'));
    Geniverse.invisibleGenomeController.showGenomePane();
  },

  solveInvisibleFemaleGenotype: function() {
    Geniverse.invisibleGenomeController.set('content', Geniverse.challengePoolController.get('firstFemale'));
    Geniverse.invisibleGenomeController.showGenomePane();
  },

  submitInvisibleGenotype: function() {
    var timesAttempted = Geniverse.invisibleGenomeController.timesAttempted;
    Geniverse.invisibleGenomeController.timesAttempted = timesAttempted + 1;

    var allCorrect = Geniverse.invisibleGenomeController.isAllCorrect();
    if (allCorrect) {
      this.solved = YES;
      
      this.set('starsEarned', Math.max(3-timesAttempted, 1));
      SC.AlertPane.extend(Lab.screenMixin, {layout: {top: 0, centerX: 0, width: 300, height: 100 }}).plain(
        "Good work!",
        "You correctly determined the Dragon's genotype.",
        "",
        "OK",
        "",
        this
      );
    } else {
      var info = {
        dragon: Geniverse.invisibleGenomeController.getPath('content.gOrganism').genetics.getAlleleString(),
        submittedSolution: this.getCurrentSolutionString()
      };
      Lab.whyville.reportChallenge(false, info);
      
      SC.AlertPane.extend(Lab.screenMixin, {layout: {top: 0, centerX: 0, width: 300, height: 100 }}).error(
        "That's not right!",
        "You have not yet correctly determined the Dragon's genotype. Keep trying!",
        "",
        "OK",
        "",
        this
      );
    }
  },

  alertPaneDidDismiss: function() {
    Geniverse.invisibleGenomeController.hideGenomePane();
    if (this.solved) {
      this._challengeComplete(" ");
    }
  },

  // these functions just used for whyville logging
  currentSolution: null,

  addCurrentSelection: function(key, option) {
    if (!this.currentSolution) {
      this.currentSolution = {};
    }
    this.currentSolution[key] = option;
  },

  getCurrentSolutionString: function() {
    var solution = "";
    if (this.currentSolution) {
      for (key in this.currentSolution) {
        solution += this.currentSolution[key] + ", ";
      }
    }
    return solution;
  },

  exitState: function() {
  }

});
