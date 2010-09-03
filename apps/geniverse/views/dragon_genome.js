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
              
  showDragon: YES,
  
  showGenerateNewDragon: YES,
  
  a1AllelesBinding: SC.Binding.from("Geniverse.dragonGenomeController.alleles").transform(function(value, isForward) {
    return Geniverse.dragonGenomeController.getAllelesFor(1,'A');
  }),
  
  b1AllelesBinding: SC.Binding.from("Geniverse.dragonGenomeController.alleles").transform(function(value, isForward) {
    return Geniverse.dragonGenomeController.getAllelesFor(1,'B');
  }),
  
  a2AllelesBinding: SC.Binding.from("Geniverse.dragonGenomeController.alleles").transform(function(value, isForward) {
    return Geniverse.dragonGenomeController.getAllelesFor(2,'A');
  }),
  
  b2AllelesBinding: SC.Binding.from("Geniverse.dragonGenomeController.alleles").transform(function(value, isForward) {
    return Geniverse.dragonGenomeController.getAllelesFor(2, 'B');
  }),
  
  aXAllelesBinding: SC.Binding.from("Geniverse.dragonGenomeController.alleles").transform(function(value, isForward) {
    return Geniverse.dragonGenomeController.getAllelesFor('X','A');
  }),
  
  bXAllelesBinding: SC.Binding.from("Geniverse.dragonGenomeController.alleles").transform(function(value, isForward) {
    return Geniverse.dragonGenomeController.getAllelesFor('X','B');
  }),
  
  hiddenGenes: ['s','p'],
  
  dragonView: Geniverse.OrganismView.design({
		layout: {top: 18, left: 260, width: 180, height: 150},
	  organismBinding: "*parentView.dragon",
	  allowDrop: YES,
    isVisibleBinding: "*parentView.showDragon"
	}),
	
	generateNewDragonButton: SC.ButtonView.extend({
		layout: {top: 280, left: 250, width: 200, height: 25},
	  title: "Create a new dragon",
	  action: 'Geniverse.dragonGenomeController.initRandomDragon',
    isVisibleBinding: "*parentView.showGenerateNewDragon"
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
	  update: function(){
	    Geniverse.dragonGenomeController.propertyDidChange('alleles');
	    Geniverse.dragonGenomeController.updateDragon();
	  }.observes('alleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  chromosome: '1',
    side: 'A'
	}),
	
	chromosomeB1View: Geniverse.DragonChromosomeView.design({
	  layout: {top: 25, left: 120},
	  allelesBinding: '*parentView.b1Alleles',
	  update: function(){
	    Geniverse.dragonGenomeController.propertyDidChange('alleles');
	    Geniverse.dragonGenomeController.updateDragon();
	  }.observes('alleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  chromosome: '1',
    side: 'B'
	}),
	
	chromosomeA2View: Geniverse.DragonChromosomeView.design({
	  layout: {top: 170, left: 0},
	  allelesBinding: '*parentView.a2Alleles',
	  update: function(){
	    Geniverse.dragonGenomeController.propertyDidChange('alleles');
	    Geniverse.dragonGenomeController.updateDragon();
	  }.observes('alleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  chromosome: '2',
    side: 'A'
	}),
	
	chromosomeB2View: Geniverse.DragonChromosomeView.design({
	  layout: {top: 170, left: 120},
	  allelesBinding: '*parentView.b2Alleles',
	  update: function(){
	    Geniverse.dragonGenomeController.propertyDidChange('alleles');
	    Geniverse.dragonGenomeController.updateDragon();
	  }.observes('alleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  chromosome: '2',
    side: 'B'
	}),
	
	chromosomeAXView: Geniverse.DragonChromosomeView.design({
	  layout: {top: 275, left: 0},
	  allelesBinding: '*parentView.aXAlleles',
	  update: function(){
	    Geniverse.dragonGenomeController.propertyDidChange('alleles');
	    Geniverse.dragonGenomeController.updateDragon();
	  }.observes('alleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  chromosome: 'X',
    side: 'A'
	}),
	
	chromosomeBXView: Geniverse.DragonChromosomeView.design({
	  layout: {top: 275, left: 120},
	  allelesBinding: '*parentView.bXAlleles',
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  update: function(){
	    Geniverse.dragonGenomeController.propertyDidChange('alleles');
	    Geniverse.dragonGenomeController.updateDragon();
	  }.observes('alleles'),
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
