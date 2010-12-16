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
  
  displayChallengeDragon: NO,   // overrides generateDragonAtStart
  
  dragonOnRight: NO,            // dragon image on left by default
  
  sex: null,        // used when generating new dragons
  fixedAlleles: null,    // used when generating new dragons
  
  alleles: [],
  allelesMap: {m: '1',w: '1',h: '2',c: '2',fl: '2',hl: '2',a: '2', a1: '2', a2: '2',b: 'X',d: 'X',dl: 'X',t: 'X'},
  ignoreUpdate: YES,
  
  activityBinding: 'Geniverse.activityController.content',
  
  hiddenGenes: function() {
      return this._getHiddenOrStaticGenes('hiddenGenes');
  }.property('activity').cacheable(),
  
  staticGenes: function() {
    return this._getHiddenOrStaticGenes('staticGenes');
  }.property('activity').cacheable(),
  
  _getHiddenOrStaticGenes: function(property){
    var activity = Geniverse.activityController.get('content');
    if (!!activity) {
      
      var genes = "";
      var rawGenes = activity.get(property);
      if (!!rawGenes){
        var genesHash = eval("("+rawGenes+")");
        var sex = this.get('sex');
        if (sex === 0){
          genes = genesHash.male;
        } else if (sex === 1){
          genes = genesHash.female;
        }
        
        if (!genes){
          genes = genesHash.all;
        }
      }
      
      if (!!genes){
        genes = genes.split(/,[ ]*/);
        
        // now we have an array such as ['h', 'a', 'd'],
        // but this won't cover "sister" alleles, such as 'a3', 'a5'
        // we want to make the array ['h', 'a', 'a3', 'a5', 'd', 'dl']
        
        // hard-code extras for now -- not DRY, but much more efficient than searching
        var extras = [];
        for (var i in genes){
          if (genes[i] === "a"){
            extras.push("a1", "a2");
          } else if (genes[i] === "d"){
            extras.push("dl");
          } else if (genes[i] === "m"){
            extras.push("mt");
          }
        }
        
        for (var j in extras){
          if (SC.typeOf(extras[j]) === SC.T_STRING){
            genes.push(extras[j]);
          }
        }
        
        return genes;
      } else {
        return [];
      }
    } else {
      return [];
    }
  },
  
  dragonImageLeft: function() {
    var dragonOnRight = this.get('dragonOnRight');
    if (dragonOnRight){
      return 0;
    } else {
      return 283;
    }
  }.property('dragonOnRight').cacheable(),
  
  chromosomeLeft: function() {
    var dragonOnRight = this.get('dragonOnRight');
    if (dragonOnRight){
      return 205;
    } else {
      return 0;
    }
  }.property('dragonOnRight').cacheable(),
  
  gwtReadyBinding: 'Geniverse.gwtController.isReady',
  
  generateDragonWhenGWTReady: function() {
    var self = this;
    
    // if displayChallengeDragon, first we have to wait for challengePoolController
    // to be ready, and then we have to wait for the length of it to be larger
    // than the idex we have specified
    
    function loadChallengeDragonWhenDragonsLoaded() {
      Geniverse.challengePoolController.addObserver('length', self, self._loadChallengeDragon);
      self._loadChallengeDragon();
    }
    
    if (this.get('displayChallengeDragon')) {
      if (Geniverse.challengePoolController & SC.Record.READY === SC.Record.READY) {
        loadChallengeDragonWhenDragonsLoaded();
      } else {
        Geniverse.challengePoolController.addObserver('status', loadChallengeDragonWhenDragonsLoaded);
      }
    } else if (this.get('generateDragonAtStart')){
      this.initRandomDragon();
    }
  }.observes('gwtReady'),
  
  _loadChallengeDragon: function() {
    // originally we were specifying the index of the dragon from the challengePool that
    // we wanted. However, when dragons are being created, we can't guarantee the order.
    // Instead we just wait to find the first dragon of the correct sex
    var machingDragons = Geniverse.challengePoolController.filterProperty('sex', this.get('sex'));
    if (machingDragons.get('length') > 0){
      var dragon = machingDragons[0];
      var self = this;
      SC.run(function() {
	      self.set('ignoreUpdate', NO);
		    self.set('dragon', dragon);
  	    self.set('ignoreUpdate', YES);
	    });
	    Geniverse.challengePoolController.removeObserver('length', self, self._loadChallengeDragon);
    }
  },
  
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
  
  dragonView: Geniverse.OrganismView.design({
		layout: function() {
		  return {top: 18, left: this.getPath('parentView.dragonImageLeft'), width: 200, height: 170};
		}.property(),
	  organismBinding: "*parentView.dragon",
	  allowDrop: YES,
    isVisibleBinding: "*parentView.showDragon"
	}),
	
	generateNewDragonButton: SC.ButtonView.extend({
		layout: function() {
		  return {top: 280, left: this.getPath('parentView.dragonImageLeft'), width: 200, height: 25};
		}.property(),
	  title: "Create a new dragon",
	  target: 'parentView',
	  action: 'initRandomDragon',
    isVisibleBinding: "*parentView.showGenerateNewDragon"
	}),
	
	motherLabel: SC.LabelView.design({
		layout: function() {
		  return {top: 0, left: this.getPath('parentView.chromosomeLeft'), width: 100, height: 25};
		}.property(),
		value: "From mother"
	}),

  fatherLabel: SC.LabelView.design({
		layout: function() {
		  return {top: 0, left: this.getPath('parentView.chromosomeLeft') + 145, width: 100, height: 25};
		}.property(),
		value: "From father"
	}),
	
	chromosomeA1View: Geniverse.DragonChromosomeView.design({
	  layout: function() {
		  return {top: 25, left: this.getPath('parentView.chromosomeLeft')};
		}.property(),
	  
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
	  layout: function() {
		  return {top: 25, left: this.getPath('parentView.chromosomeLeft') + 145};
		}.property(),
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
	  layout: function() {
		  return {top: 170, left: this.getPath('parentView.chromosomeLeft')};
		}.property(),
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
	  layout: function() {
		  return {top: 170, left: this.getPath('parentView.chromosomeLeft') + 145};
		}.property(),
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
	  layout: function() {
		  return {top: 315, left: this.getPath('parentView.chromosomeLeft')};
		}.property(),
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
	  layout: function() {
		  return {top: 315, left: this.getPath('parentView.chromosomeLeft') + 145};
		}.property(),
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
    layout: function() {
		  return {top: 370, left: this.getPath('parentView.dragonImageLeft') + 10, width: 250, height: 18};
		}.property(),
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
