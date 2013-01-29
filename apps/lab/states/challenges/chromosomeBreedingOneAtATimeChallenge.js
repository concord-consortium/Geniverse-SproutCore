// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC sc_require*/

sc_require('states/challenges/matchTargetDrakesOneAtATimeChallenge');

Lab.chromosomeBreedingOneAtATimeChallenge = Lab.matchTargetDrakesOneAtATimeChallenge.extend({

  firstChromosomeDragonLoaded: NO,
  secondChromosomeDragonLoaded: NO,

  matchDragonChanged: function() {
    this.setTargetScore();
  },

  chromosomeDragonChanged: function() {
    if (!this.firstChromosomeDragonLoaded && Geniverse.dragonGenomeController.get('firstDragon')) {
      this.firstChromosomeDragonLoaded = YES;
      this.setTargetScore();
    }
    if (!this.secondChromosomeDragonLoaded && Geniverse.dragonGenomeController.get('secondDragon')) {
      this.secondChromosomeDragonLoaded = YES;
      this.setTargetScore();
    }
  },

  setTargetScore: function() {
    var initialDragon1 = Geniverse.dragonGenomeController.get('firstDragon'),
        initialDragon2 = Geniverse.dragonGenomeController.get('secondDragon');
    if (initialDragon1 && initialDragon1.get('alleles') &&
        initialDragon2 && initialDragon2.get('alleles') &&
        Geniverse.matchController.get("currentDragon") && Geniverse.matchController.get("currentDragon").get('characteristicMap')) {

      var allAlleles = Geniverse.chromosomeController.get('allAlleles').join(",").split(","),    // merge array of arrays
          hiddenGenes1 = Geniverse.activityController.getHiddenOrStaticGenes("hiddenGenes", 1),
          hiddenGenes2 = Geniverse.activityController.getHiddenOrStaticGenes("hiddenGenes", 0),
          staticGenes1 = Geniverse.activityController.getHiddenOrStaticGenes("staticGenes", 1),
          staticGenes2 = Geniverse.activityController.getHiddenOrStaticGenes("staticGenes", 0),
          changeableAlleles1 = this._removeObjectsIgnoreCase(allAlleles.copy(), hiddenGenes1.concat(staticGenes1)),
          changeableAlleles2 = this._removeObjectsIgnoreCase(allAlleles.copy(), hiddenGenes2.concat(staticGenes2));

      var moves = Geniverse.matchController.numberOfBreedingMovesToReachCurrent(initialDragon1, initialDragon2, changeableAlleles1, changeableAlleles2);

      moves = moves + 1;        // for for final drag
      Geniverse.scoringController.set('minimumScore', moves);
    }
  },

  _removeObjectsIgnoreCase: function(array1, array2) {
    for (var i = array1.length - 1; i >= 0; --i) {
        if (array2.indexOf(array1[i].toLowerCase()) >= 0) {
            array1.splice(i, 1);
        }
    }
    return array1;
  }

});
