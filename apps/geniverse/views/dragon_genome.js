// ==========================================================================
// Project:   Geniverse.DragonGenomeView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('views/dragon_chromosome');
Geniverse.DragonGenomeView = SC.View.extend(
/** @scope Geniverse.DragonGenomeView.prototype */ {
  controller: null,
  
  dragonBinding: 'Geniverse.dragonGenomeController.content',

  childViews: 'dragonView motherLabel fatherLabel chromosomeA1View chromosomeA2View chromosomeAXView \
              chromosomeB1View chromosomeB2View chromosomeBXView generateNewDragonButton'.w(),
  
  // FIXME These should observe the controller's
  // a1Alleles: ['h','s'],
  a1Alleles: function() {
    var alleles = Geniverse.dragonGenomeController.get('alleles');
    if (!alleles || !alleles[1]){
      return [];
    }
    return alleles[1]['A'];
  }.property('dragon').cacheable(),
  
  b1Alleles: function() {
    var alleles = Geniverse.dragonGenomeController.get('alleles');
    if (!alleles || !alleles[1]){
      return [];
    }
    return alleles[1]['B'];
  }.property('dragon').cacheable(),
  
  a2Alleles: function() {
    var alleles = Geniverse.dragonGenomeController.get('alleles');
    if (!alleles || !alleles[2]){
      return [];
    }
    return alleles[2]['A'];
  }.property('dragon').cacheable(),
  
  b2Alleles: function() {
    var alleles = Geniverse.dragonGenomeController.get('alleles');
    if (!alleles || !alleles[2]){
      return [];
    }
    return alleles[2]['B'];
  }.property('dragon').cacheable(),
  
  aXAlleles: function() {
    var alleles = Geniverse.dragonGenomeController.get('alleles');
    if (!alleles || !alleles['X']){
      return [];
    }
    return alleles['X']['A'];
  }.property('dragon').cacheable(),
  
  bXAlleles: function() {
    var alleles = Geniverse.dragonGenomeController.get('alleles');
    if (!alleles || !alleles['X'] || !alleles['X']['B']){
      return [];
    }
    return alleles['X']['B'];
  }.property('dragon').cacheable(),
  // xyAlleles: ['p','f','a','b'],
  // xyAlleles: [],
  
  hiddenGenes: ['s','p'],
  
  dragonView: Geniverse.OrganismView.design({
		layout: {top: 18, left: 260, width: 180, height: 150},
	  organismBinding: "*parentView.dragon",
	  allowDrop: YES
//	  isVisibleBinding: "*parentView.showDragon"
	}),
	
	generateNewDragonButton: SC.ButtonView.extend({
		layout: {top: 280, left: 250, width: 200, height: 25},
	  title: "Create a new dragon",
	  action: 'Geniverse.dragonGenomeController.initRandomDragon'
	//  isVisibleBinding: "*parentView.showGenerateNewDragon"
	}),
	
	motherLabel: SC.LabelView.design({
		layout: {top: 0, left: 0, width: 100, height: 25},
		value: "From mother"
	}),

  fatherLabel: SC.LabelView.design({
		layout: {top: 0, left: 120, width: 100, height: 25},
		value: "From father"
	}),
	
	chromosomeA1View: Geniverse.DragonChromosomeView.design({
	  layout: {top: 25, left: 0},
	  allelesBinding: '*parentView.a1Alleles',
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  chromosome: '1',
    side: 'A'
	}),
	
	chromosomeB1View: Geniverse.DragonChromosomeView.design({
	  layout: {top: 25, left: 120},
	  allelesBinding: '*parentView.b1Alleles',
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  chromosome: '1',
    side: 'B'
	}),
	
	chromosomeA2View: Geniverse.DragonChromosomeView.design({
	  layout: {top: 170, left: 0},
	  allelesBinding: '*parentView.a2Alleles',
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  chromosome: '2',
    side: 'A'
	}),
	
	chromosomeB2View: Geniverse.DragonChromosomeView.design({
	  layout: {top: 170, left: 120},
	  allelesBinding: '*parentView.b2Alleles',
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  chromosome: '2',
    side: 'B'
	}),
	
	chromosomeAXView: Geniverse.DragonChromosomeView.design({
	  layout: {top: 275, left: 0},
	  allelesBinding: '*parentView.aXAlleles',
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  chromosome: 'X',
    side: 'A'
	}),
	
	chromosomeBXView: Geniverse.DragonChromosomeView.design({
	  layout: {top: 275, left: 120},
	  allelesBinding: '*parentView.bXAlleles',
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  chromosome: function() {
	    if (this.get('alleles').length < 1) {
	      // we must be male
	      return 'Y';
	    }
	    return 'X';
	  }.property('alleles'),
    side: 'B'
	})
});
