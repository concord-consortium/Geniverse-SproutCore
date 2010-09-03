// ==========================================================================
// Project:   Geniverse.dragonGenomeController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse generateDragonWithCallback*/

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.dragonGenomeController = SC.ObjectController.create(
/** @scope Geniverse.dragonGenomeController.prototype */ {

  // content: dragon we're working with
  // alleles is a multi-level array of dragon genome: ['1' => ['A' => ['h','s'], 'B' => ['H','S']], '2' => ['A' => [...], 'B' => [...]]]
  alleles: [],
  allelesMap: {h: '1',s: '1',w: '2',l: '2',t: '2',p: 'X',f: 'X',a: 'X',b: 'X'},
  ignoreUpdate: YES,
  
  getAllelesFor: function(chromosome, side){
    var alleles = this.get('alleles');
    if (!alleles || !alleles[chromosome] || !alleles[chromosome][side]){
      return [];
    }
    return alleles[chromosome][side];
  },
  
  _processAlleleString: function() {
    if (this.get('ignoreUpdate') == NO) {
      var map = this.get('allelesMap');
      var dragon = this.get('content');
      
      var alleleString = dragon.get('alleles');
      
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
      
      this.set('alleles', alleles);
    }
  }.observes('content'),
  
  updateDragon: function (){
      var outStr = "";
      var alleles = this.get('alleles');
      if (!alleles || !alleles[1]){
        return;
      }
    
      // because our array doesn't just have numerical indices, we can't
      // iterate through it with normal methods, and forEach() returns too much.
      for(var i = 1; i < 4; i++){
        if (i === 3){
          i = 'X';
        }
        if (!!alleles[i] && !!alleles[i].A){
          for (var j = 0; j < alleles[i].A.length; j++){
            outStr += !!alleles[i].A[j] ? "a:" + alleles[i].A[j] + "," : "";
            outStr += (!!alleles[i].B && !!alleles[i].B[j]) ? "b:" + alleles[i].B[j] + "," : "";
          }
        }
      }
    
      // rm last comma
      outStr = outStr.substring(0,outStr.length-1);
      
      var self = this;
      Geniverse.gwtController.generateDragonWithAlleles(outStr, this.getPath('content.sex'), this.getPath('content.name'), function(dragon) {
  	    SC.run(function() {
  		    self.set('content', dragon);
  	    });
  	  });
  },//.observes('alleles'),
  
  initRandomDragon: function () {
    var self = this;
    
		if (typeof(generateDragonWithCallback) != "undefined") {
		  Geniverse.gwtController.generateRandomDragon(function(dragon) {
		    SC.run(function() {
  	      self.set('ignoreUpdate', NO);
  		    self.set('content', dragon);
    	    self.set('ignoreUpdate', YES);
		    });
		  });
		}
  }

}) ;
