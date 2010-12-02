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
    ['M', 'm', 'MT'],
    ['W', 'w'],
    ['H', 'h'],
    ['C', 'c'],
    ['Fl', 'fl'],
    ['Hl', 'hl'],
    ['A1', 'A2', 'a'],
    ['B', 'b'],
    ['D', 'd', 'dl'],
    ['T', 't']
  ],
  
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
      'M': 'Metallic',
      'm': 'Nonmetallic',
      'MT': 'Tawny',
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
      'A1': 'A1 armor',
      'A2': 'A2 armor',
      'a': 'No armor',
      'B': 'Black',
      'b': 'Brown',
      'D': 'Full color',
      'd': 'Dilute color',
      'dl': 'dl',
      'T': 'Flared tail',
      't': 'Short tail'
  },

  titleForAllele: function(val) {
    var mappedVal = this.alleleLabelMap[val];
    if (mappedVal !== undefined) {
      return mappedVal;
    }
    SC.Logger.warn("couldn't find maped: %s", val);
    return val;
  }
  
}) ;
