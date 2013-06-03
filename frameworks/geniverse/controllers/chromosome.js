// ==========================================================================
// Project:   Geniverse.chromosomeController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse generateDragonWithCallback */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.chromosomeController = SC.ObjectController.create(
/** @scope Geniverse.chromosomeController.prototype */ {

  initRandomDragon: function () {
    var self = this;

    if (typeof(generateDragonWithCallback) != "undefined") {
      Geniverse.gwtController.generateRandomDragon(function(dragon) {
        SC.run(function() {
          self.set('content', dragon);
        });
      });
    }
  },

  allAlleles: [
    ['T', 'Tk', 't'],
    ['M', 'm'],
    ['W', 'w'],
    ['H', 'h'],
    ['C', 'c'],
    ['Fl', 'fl'],
    ['Hl', 'hl'],
    ['A1', 'A2', 'a'],
    ['B', 'b'],
    ['D', 'd'],
    ['Bog', 'bog'],
    ['Rh', 'rh']
  ],

  allelesMap: {t: '1',tk: '1',m: '1',mt: '1',w: '1',h: '1',c: '2',fl: '2',hl: '2',a: '2', a1: '2', a2: '2',
                b: '2',d: 'X',dl: 'X',bog: 'X',rh: 'X'},

  getChromosome: function(allele) {
    return this.get('allelesMap')[allele.toLowerCase()];
  },

  chromosomeAlleles: {a: this.allAlleles, b: this.allAlleles},

  updateDragon: function (aAlleles, bAlleles){
    if (!this._allelesEqual(aAlleles,this.chromosomeAlleles['a']) || !this._allelesEqual(bAlleles, this.chromosomeAlleles['b'])){
      // create a new allele string
      var alleleString = "";
      for (var i = 0; i < aAlleles.length; i++){
        alleleString += "a:"+aAlleles[i] + ",";
        if (!!bAlleles[i]){
          alleleString += "b:"+bAlleles[i] + ",";
        }
      }
      // rm last comma
      alleleString = alleleString.substring(0,alleleString.length-1);

      var self = this;
      Geniverse.gwtController.generateDragonWithAlleles(alleleString, this.get('sex'), this.get('name'), function(dragon) {
        SC.run(function() {
          self.set('content', dragon);
        });
      });
    }
  },

  // a little helper method for checking if [a,b] and [[a,A],[b,B]] are equal
  _allelesEqual: function(alleles, expandedAlleles){
    for (var i = 0; i < alleles.length; i++){
      if (alleles[i] !== expandedAlleles[i][0]){
        return false;
      }
    }
    return true;
  },

  alleleLabelMap : {
      'T': 'Long tail',
      'Tk': 'Kinked tail',
      't': 'Short tail',
      'M': 'Metallic',
      'm': 'Nonmetallic',
      'W': 'Wings',
      'w': 'No wings',
      'H': 'No horns',
      'h': 'Horns',
      'C': 'Colored',
      'c': 'Colorless',
      'Fl': 'Forelimbs',
      'fl': 'No forelimbs',
      'Hl': 'Hindlimbs',
      'hl': 'No hindlimbs',
      'A': "Armor",
      'a': "No armor",
      'B': 'Black',
      'b': 'Brown',
      'D': 'Full color',
      'd': 'Dilute color',
      'dl': 'dl',
      'Bog': 'Normal metabolism',
      'bog': 'Bog breath',
      'Rh': 'Nose spike',
      'rh': 'No nose spike',
    'Y' : 'Y',
      '' : ''
  },

  titleForAllele: function(val) {
    var mappedVal = this.alleleLabelMap[val];
    if (mappedVal !== undefined) {
      return mappedVal;
    }
    return val;
  },

  processAlleleString: function(alleleString) {
    var map = this.get('allelesMap');

    if (alleleString === null || typeof(alleleString) == "undefined") {
      return [];
    }

    var alleleSet = alleleString.split(/,/);

    var alleles = [];
    for (var i = 0; i < alleleSet.length; i++) {
      var alleleInfo = alleleSet[i].split(/:/);
      var chromo = ""+map[alleleInfo[1].toLowerCase()];
      var side = alleleInfo[0].toUpperCase();

      if (!alleles[chromo] || !alleles[chromo][side]) {
        var values = [alleleInfo[1]];
        if (!alleles[chromo]) {
          alleles[chromo] = [];
        }
        alleles[chromo][side] = values;
      } else {
        alleles[chromo][side].pushObject(alleleInfo[1]);
      }
    }

    return alleles;
  }

}) ;
