// ==========================================================================
// Project:   Lab - DragonBreedingGenomeView
// Copyright: 2012 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse */

// A Geniverse.DragonGenomeView that updates the breedDragonController when it's appended to the DOM and whenever
// its dragon changes when it's appended to the DOM. This is a Lab, rather than Geniverse, class because it knows
// not to update the breedDragonController if it exists, but is not attached to trhe DOM. RPK 1/27/12

Lab.DragonBreedingGenomeView = Geniverse.DragonGenomeView.extend({
  generateDragonAtStart: NO,
  displayChallengeDragon: YES,
  showDragon: NO,
  showGenerateNewDragon: NO,
  showIsEditableCheck: NO,
  showFromLabels: NO,
  trackScore: YES,
  
  parentToUpdate: function() {
    switch (this.get('sex')) {
      case 0:
        return 'father';
      case 1:
        return 'mother';
    }
  }.property('sex'),
  
  dragonDidChange: function() {
    this.possiblyUpdateBreedDragon();
  }.observes('dragon'),
  
  domStatusDidChange: function() {
    this.possiblyUpdateBreedDragon();
  }.observes('.pane.isPaneAttached'),
  
  possiblyUpdateBreedDragon: function() {
    if (this.getPath('pane.isPaneAttached')) {
      Geniverse.breedDragonController.set(this.get('parentToUpdate'), this.get('dragon'));
    }
  }
});
