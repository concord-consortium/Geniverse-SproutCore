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
  ignoreUpdate: NO,
  
  _processAlleleString: function() {
    if (this.get('ignoreUpdate') == NO) {
      var map = this.get('allelesMap');
      var dragon = this.get('content');
      
      var alleleString = dragon.get('alleles');
      
      var alleleSet = alleleString.split(/,/);
      
      var alleles = [];
      for (var i = 0; i < alleleSet.length; i++) {
        var alleleInfo = alleleSet[i].split(/:/);
        var chromo = map[alleleInfo[1].toLowerCase()];
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
    var alleles = this.get('alleles').copy();
    while (alleles.size > 0) {
      var chromo = alleles.popObject();
      while (chromo.size > 0) {
        var sideA = chromo.popObject();
        var sideB = chromo.popObject();
        while (sideA.length > 0) {
          var alleleA = sideA.popObject();
          var alleleB = sideB.popObject();
          outStr += "a:" + alleleA + (typeof(alleleB) == 'undefined' ? ',' : (',b:'+alleleB+','));
        }
      }
    }
    // rm last comma
    outStr = outStr.substring(0,outStr.length-1);
      
    var self = this;
    Geniverse.gwtController.generateDragonWithAlleles(outStr, this.getPath('content.sex'), this.getPath('content.name'), function(dragon) {
	    SC.run(function() {
	      self.set('ignoreUpdate', YES);
		    self.set('content', dragon);
		    self.set('ignoreUpdate', NO);
	    });
	  });
  },
  
  initRandomDragon: function () {
    var self = this;
    
		if (typeof(generateDragonWithCallback) != "undefined") {
		  Geniverse.gwtController.generateRandomDragon(function(dragon) {
		    SC.run(function() {
  		    self.set('content', dragon);
		    });
		  });
		}
  }

}) ;
