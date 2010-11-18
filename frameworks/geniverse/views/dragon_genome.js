// ==========================================================================
// Project:   Geniverse.DragonGenomeView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse generateDragonWithCallback */

/** @class

  (Document Your View Here)

  @extends SC.View   // no more Geniverse.dragonGenomeController!
*/
sc_require('views/dragon_chromosome');
sc_require('views/organism');

Geniverse.DragonGenomeView = SC.View.extend(
/** @scope Geniverse.DragonGenomeView.prototype */ {
  
  dragon: null,

  childViews: 'dragonView motherLabel fatherLabel chromosomeA1View chromosomeA2View chromosomeAXView chromosomeB1View chromosomeB2View chromosomeBXView generateNewDragonButton isEditableCheck allelesOutputTitle allelesOutput'.w(),
              
  showDragon: YES,
  
  generateDragonAtStart: NO,
  
  showGenerateNewDragon: YES,
  
  isEditable: YES,
  
  showIsEditableCheck: NO,
  
  showAllelesOutput: NO,
  
  authoredAlleleString: null,
  
  sex: null,        // used when generating new dragons
  fixedAlleles: null,    // used when generating new dragons
  
  alleles: [],
  allelesMap: {h: '1',s: '1',w: '2',l: '2',t: '2',a: '2',b: '2',p: 'X',f: 'X'},
  ignoreUpdate: YES,
  
  gwtReadyBinding: 'Geniverse.gwtController.isReady',
  
  generateDragonWhenGWTReady: function() {
    if (this.get('generateDragonAtStart')){
      this.initRandomDragon();
    }
  }.observes('gwtReady'),
  
  a1Alleles: function() {
    return this.getAllelesFor(1,'A');
  }.property('alleles'),
  
  b1Alleles: function() {
    return this.getAllelesFor(1,'B');
  }.property('alleles'),
  
  a2Alleles: function() {
    return this.getAllelesFor(2,'A');
  }.property('alleles'),
  
  b2Alleles: function() {
    return this.getAllelesFor(2,'B');
  }.property('alleles'),
  
  aXAlleles: function() {
    return this.getAllelesFor('X','A');
  }.property('alleles'),
  
  bXAlleles: function() {
    return this.getAllelesFor('X','B');
  }.property('alleles'),
  
  hiddenGenes: ['s','p','b'],
  
  dragonView: Geniverse.OrganismView.design({
		layout: {top: 18, left: 260, width: 200, height: 170},
	  organismBinding: "*parentView.dragon",
	  allowDrop: YES,
    isVisibleBinding: "*parentView.showDragon"
	}),
	
	generateNewDragonButton: SC.ButtonView.extend({
		layout: {top: 280, left: 250, width: 200, height: 25},
	  title: "Create a new dragon",
	  target: 'parentView',
	  action: 'initRandomDragon',
    isVisibleBinding: "*parentView.showGenerateNewDragon"
	}),
	
	motherLabel: SC.LabelView.design({
		layout: {top: 0, left: 0, width: 100, height: 25},
		value: "From mother"
	}),

  fatherLabel: SC.LabelView.design({
		layout: {top: 0, left: 140, width: 100, height: 25},
		value: "From father"
	}),
	
	chromosomeA1View: Geniverse.DragonChromosomeView.design({
	  layout: {top: 25, left: 0},
	  
	  // allelesBinding doesn't work when we have more than one instance of
	  // dragonGenomeView. Don't know how to get it to work correctly, so
	  // added the non-sproutcorish "updateAlleles" instead...
	  
    // allelesBinding: SC.Binding.oneWay('*parentView.a1Alleles'),
	  updateDragon: function(){
     this.get('parentView').updateDragon();
    }.observes('alleles'),
    updateAlleles: function(){
      this.set('alleles', this.get('parentView').get('a1Alleles'));
    }.observes('*parentView.a1Alleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  showEmptyOptionInPulldownsBinding: '*parentView.showAllelesOutput',
	  chromosome: '1',
    side: 'A'
	}),
	
	chromosomeB1View: Geniverse.DragonChromosomeView.design({
	  layout: {top: 25, left: 140},
	  updateDragon: function(){
	    this.get('parentView').updateDragon();
	  }.observes('alleles'),
	  updateAlleles: function(){
      this.set('alleles', this.get('parentView').get('b1Alleles'));
    }.observes('*parentView.b1Alleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  showEmptyOptionInPulldownsBinding: '*parentView.showAllelesOutput',
	  chromosome: '1',
    side: 'B'
	}),
	
	chromosomeA2View: Geniverse.DragonChromosomeView.design({
	  layout: {top: 170, left: 0},
	  updateDragon: function(){
	    this.get('parentView').updateDragon();
	  }.observes('alleles'),
	  updateAlleles: function(){
      this.set('alleles', this.get('parentView').get('a2Alleles'));
    }.observes('*parentView.a2Alleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  showEmptyOptionInPulldownsBinding: '*parentView.showAllelesOutput',
	  chromosome: '2',
    side: 'A'
	}),
	
	chromosomeB2View: Geniverse.DragonChromosomeView.design({
	  layout: {top: 170, left: 140},
	  updateDragon: function(){
	    this.get('parentView').updateDragon();
	  }.observes('alleles'),
	  updateAlleles: function(){
      this.set('alleles', this.get('parentView').get('b2Alleles'));
    }.observes('*parentView.b2Alleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  showEmptyOptionInPulldownsBinding: '*parentView.showAllelesOutput',
	  chromosome: '2',
    side: 'B'
	}),
	
	chromosomeAXView: Geniverse.DragonChromosomeView.design({
	  layout: {top: 315, left: 0},
	  updateDragon: function(){
	    this.get('parentView').updateDragon();
	  }.observes('alleles'),
	  updateAlleles: function(){
      this.set('alleles', this.get('parentView').get('aXAlleles'));
    }.observes('*parentView.aXAlleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  showEmptyOptionInPulldownsBinding: '*parentView.showAllelesOutput',
	  chromosome: 'X',
    side: 'A'
	}),
	
	chromosomeBXView: Geniverse.DragonChromosomeView.design({
	  layout: {top: 315, left: 140},
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  showEmptyOptionInPulldownsBinding: '*parentView.showAllelesOutput',
	  updateDragon: function(){
	    this.get('parentView').updateDragon();
	  }.observes('alleles'),
	  updateAlleles: function(){
      this.set('alleles', this.get('parentView').get('bXAlleles'));
    }.observes('*parentView.bXAlleles'),
	  chromosome: function() {
	    if (this.get('alleles').length < 1) {
	      // we must be male
	      return 'Y';
	    }
	    return 'X';
	  }.property('alleles'),
    side: 'B'
	}),
	
	isEditableCheck: SC.CheckboxView.design({
    layout: { top: 370, left: 290, width: 250, height: 18 },
    title: "Editable",
    isVisibleBinding: '*parentView.showIsEditableCheck',
    valueBinding: '*parentView.isEditable'
  }),
  
  allelesOutputTitle: SC.LabelView.design({
    layout: { top: 410, left: 0, width: 250, height: 18 },
    value: "Alleles:",
    isTextSelectable: NO,
    isVisibleBinding: '*parentView.showAllelesOutput'
  }),
  
  allelesOutput: SC.LabelView.design({
    layout: { top: 430, left: 0, width: 410, height: 18 },
    value: null,          // can't get this to work with computed properties
    valueSetter: function() {
      var authoredAlleleString = this.get('parentView').get('authoredAlleleString');
      if (!!authoredAlleleString){
        this.set('value', authoredAlleleString);
      } else {
        this.set('value', this.get('parentView').getPath('dragon.alleles'));
      }
    }.observes('*parentView.dragon.alleles'),
    isTextSelectable: YES,
    isVisibleBinding: '*parentView.showAllelesOutput',
    classNames: ['allele-string']
  }),
  
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
      var dragon = this.get('dragon');
      
      if (dragon === null || typeof(dragon) == "undefined") {
        this.set('alleles', []);
        return;
      }
      
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
  }.observes('dragon'),
  
  updateDragon: function (){
    if (this.get('ignoreUpdate')) {
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
      
      var outStrIgnoredGenesRemoved = outStr.replace(/.: ,/g,"");      // rm genes set to blank by author
      var hiddenGenes = this.get('hiddenGenes').join();
      var rmHidden = new RegExp(".:["+hiddenGenes+"],","ig");         // rm hidden genes
      outStrIgnoredGenesRemoved = outStrIgnoredGenesRemoved.replace(rmHidden,"");
      this.set("authoredAlleleString", outStrIgnoredGenesRemoved);
      
      var self = this;
      Geniverse.gwtController.generateDragonWithAlleles(outStr, this.getPath('dragon.sex'), this.getPath('dragon.name'), function(dragon) {
  	    SC.run(function() {
  		    self.set('dragon', dragon);
  	    });
  	  });
	  }
  },
  
  initRandomDragon: function () {
    var self = this;
    function updateDragon(dragon) {
	    SC.run(function() {
	      self.set('ignoreUpdate', NO);
		    self.set('dragon', dragon);
  	    self.set('ignoreUpdate', YES);
	    });
	  }
    
		if (typeof(generateDragonWithCallback) != "undefined") {
		  var sex = this.get('sex');
		  var fixedAlleles = this.get('fixedAlleles');
		  var args = [updateDragon];
		  if (sex !== undefined && sex !== null && fixedAlleles !== undefined && fixedAlleles !== null){
		    Geniverse.gwtController.generateDragonWithAlleles(fixedAlleles, sex, "", updateDragon);
		  } else if (sex !== undefined && sex !== null) {
		    Geniverse.gwtController.generateDragon(sex, "", updateDragon);
		  } else if (fixedAlleles !== undefined && fixedAlleles !== null) {
		    Geniverse.gwtController.generateDragonWithAlleles(fixedAlleles, -1, "", updateDragon);
		  } else {
		    Geniverse.gwtController.generateRandomDragon(updateDragon);
		  }
		}
  }
});
