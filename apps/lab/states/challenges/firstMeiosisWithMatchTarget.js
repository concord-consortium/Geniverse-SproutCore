// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

sc_require('states/challenges/matchTargetDrakesListChallenge');

Lab.firstMeiosisWithMatchTarget = Lab.matchTargetDrakesListChallenge.extend({
  
  _hasReachdRecombination: NO,
  _hasSelectedSomeAlleles: NO,
  _hasSeenMessageToTryMore: NO,
  
  showInitialRecobinationMsg: function() {
  if (!this._hasReachdRecombination) {
      setTimeout(function() {
        SC.AlertPane.extend({layout: {centerY: 0, centerX: 0, width: 300, height: 100 }}).plain(
          "Step 1",
          "You can select parts of chromosomes to swap by hovering over and clicking on a chromosome. Try it now.",
          "",
          "OK",
          "",
          this
        );
      }, 800);      // delay a little
      this._hasReachdRecombination = YES;
    }
  },
  
  showSelectTargetnMsg: function() {
  if (!this._hasSelectedSomeAlleles) {
      setTimeout(function() {
        SC.AlertPane.extend({layout: {centerY: 0, centerX: 0, width: 300, height: 100 }}).plain(
          "Step 2",
          "Click on one of the red highlighted portions to swap. Click on any other chromosome to start over.",
          "",
          "OK",
          "",
          this
        );
      }, 800);      // delay a little
      this._hasSelectedSomeAlleles = YES;
    }
  },

  showTryMoreRecombinationMsg: function() {
  if (!this._hasSeenMessageToTryMore) {
      setTimeout(function() {
        SC.AlertPane.extend({layout: {centerY: 0, centerX: 0, width: 300, height: 100 }}).plain(
          "Nice job!",
          "You completed your first crossover between chromosomes. Make additional recombinations, or press 'play' or 'end' to continue meiosis.",
          "",
          "OK",
          "",
          this
        );
      }, 800);      // delay a little
      this._hasSeenMessageToTryMore = YES;
    }
  }

});
