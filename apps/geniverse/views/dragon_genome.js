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

  childViews: 'dragonView motherLabel fatherLabel chromosomeA1View chromosomeA2View chromosomeX1View chromosomeB1View chromosomeB2View chromosomeXYView'.w(),
  
  // FIXME These should observe the controller's
  a1Alleles: ['h','s'],
  b1Alleles: ['h','s'],
  a2Alleles: ['w','l','t'],
  b2Alleles: ['w','l','t'],
  x1Alleles: ['p','f','a','b'],
  // xyAlleles: ['p','f','a','b'],
  xyAlleles: [],
  
  hiddenGenes: ['s','p'],
  
  dragonView: Geniverse.OrganismView.design({
		layout: {top: 18, right: 0, width: 180, height: 150},
	  organismBinding: "*parentView.dragon",
	  allowDrop: YES,
	  isVisibleBinding: "*parentView.showDragon"
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
	
	chromosomeX1View: Geniverse.DragonChromosomeView.design({
	  layout: {top: 275, left: 0},
	  allelesBinding: '*parentView.x1Alleles',
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  chromosome: 'X',
    side: 'A'
	}),
	
	chromosomeXYView: Geniverse.DragonChromosomeView.design({
	  layout: {top: 275, left: 120},
	  allelesBinding: '*parentView.xyAlleles',
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
