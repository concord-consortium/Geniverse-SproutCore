// ==========================================================================
// Project:   Geniverse.meiosisAnimationController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */
sc_require('views/animation');
sc_require('views/popup_animation');

/** @class

  Shows a pop-up meiosis animation instance for a selected dragon
 @author  Dr. Baba Kofi Weusijana <kofi@edutek.net>
 @extends SC.ObjectController
 */

Geniverse.meiosisAnimationController = SC.ObjectController.create(
  /** @scope Geniverse.meiosisAnimationController.prototype */ {

  content: SC.Object.create({
    dragon: null,
    pane: null,
    isEnabledButton: NO,
    
    mother: null,
    father: null,
    offspring: null,
    fatherGameteJson: null,
    motherGameteJson: null,
		retryMother: false,
		retryFather: false
  }),
  
  reset: function() {
    this.set('dragon', null);
    this.set('mother', null);
    this.set('father', null);
    this.set('offspring', null);
    this.set('fatherGameteJson', null);
    this.set('motherGameteJson', null);
  },
  
  clearOffspring: function() {
    this.set('offspring', null);
  }.observes('mother', 'father','fatherGameteJson','motherGameteJson'),

  clearMotherGamete: function(){
		this.set('motherGameteJson',null);
	}.observes('mother'),
	
  clearFatherGamete: function(){
		this.set('fatherGameteJson',null);
	}.observes('father'),

  allelesToJSON: function (alleleString) {
    if(alleleString !== null && typeof(alleleString) != 'undefined'){
      SC.Logger.info("alleles: " + alleleString);
      var alleles = Geniverse.chromosomeController.processAlleleString(alleleString);
      document.alleles = alleles;
      var chromosomesArr = [];
      
      // special way of iteracting through
      for(var i = 1; i < 4; i++){
        if (i === 3){
          i = 'X';
        }

        var allelesArr = [];
        for (var j = 0; j < alleles[i].A.length; j++){
          var allele = {
            sex: "female",
            gene: alleles[i].A[j]
          };
          allelesArr.push(allele);
        }
        chromosomesArr.push({ alleles: allelesArr});
        
        allelesArr = [];
        if (alleles[i].B !== null && typeof alleles[i].B != 'undefined') {
          for (j = 0; j < alleles[i].B.length; j++){
            var bAllele = {
              sex: "male",
              gene: alleles[i].B[j]
            };
            allelesArr.push(bAllele);
          }
          chromosomesArr.push({ alleles: allelesArr});
        } else {
          SC.Logger.info("No B side!");
          chromosomesArr.push({ alleles: [{ sex: "male", gene: "" },{ sex: "male", gene: "" }]});
          // chromosomesArr.push({ alleles: []});
        }
      }
      
      var json = { chromosomes: chromosomesArr };
      return json;
    }
    return null;
  },
  
  JSONToAlleles: function(motherJson, fatherJson) {
    var outString = "";
    
    var motherString = this._JSONToAlleles(motherJson, "a:");
    var fatherString = this._JSONToAlleles(fatherJson, "b:");
    
    SC.Logger.log("ALLELES : "+motherString + fatherString);
    
    return motherString + fatherString;
  },
  
  _JSONToAlleles: function(json, prefix) {
    var outString = "";
    for (var i = 0; i < json.chromosomes.length; i++) {
      var chromo = json.chromosomes[i];
      for (var j = 0; j < chromo.alleles.length; j++) {
        outString += prefix + chromo.alleles[j].gene + ",";
      }
    }
    return outString;
  },
  
  getOffspringSex: function() {
    var lastChromoAlleles = Geniverse.meiosisAnimationController.get('fatherGameteJson').chromosomes[2].alleles;
    var sex = 1;
    if (lastChromoAlleles.length === 0) {
      sex = 0;
    } else if (lastChromoAlleles[0].gene === "" || lastChromoAlleles[0].gene === "Y") {
      sex = 0;
    }
    return sex;
  },

  showPane: function() {
    this.set('pane', Geniverse.PopupAnimationView.create());
    var _pane = this.get('pane');
    var _dragon = this.get('dragon');
    var jsonData = this.allelesToJSON(_dragon.get('alleles'));
    _pane.contentView.meiosisView.set('jsonData', jsonData);
    if (!_pane.get('isVisibleInWindow')) {
      _pane.append();
      this.set('isEnabledButton', NO);
    }
  },

  close: function () {
    var receiver = this.pane.remove();
    //SC.Logger.log("this.pane.remove() returned receiver:", receiver);
    this.set('isEnabledButton', YES);
  }
});
