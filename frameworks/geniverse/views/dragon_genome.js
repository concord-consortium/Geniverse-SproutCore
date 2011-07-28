// ==========================================================================
// Project:   Geniverse.DragonGenomeView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse generateDragonWithCallback SC YES NO sc_require sc_super*/

/** @class

  (Document Your View Here)

  @extends SC.View   // no more Geniverse.dragonGenomeController!
*/
sc_require('views/dragon_chromosome');
sc_require('views/organism');

Geniverse.DragonGenomeView = SC.View.extend(
/** @scope Geniverse.DragonGenomeView.prototype */ {
  
  dragon: null,

  childViews: 'motherLabel fatherLabel chromosomeA1View chromosomeA2View chromosomeAXView chromosomeB1View chromosomeB2View chromosomeBXView generateNewDragonButton isEditableCheck allelesOutputTitle allelesOutput dragonView'.w(),
              
  showDragon: YES,
  
  generateDragonAtStart: NO,
  
  showGenerateNewDragon: YES,
  
  isEditable: YES,
 
  showSwitchSex: NO,

  showIsEditableCheck: NO,
  
  showAllelesOutput: NO,

  showEmptyOptions: NO,

  startWithEmptyOptions: NO,

  showFromLabels: YES,

  authoredAlleleString: null,
  
  displayChallengeDragon: NO,   // overrides generateDragonAtStart
  
  dragonOnRight: NO,            // dragon image on left by default
  
  useRevealButton: NO,          // hide drake image and show reveal button

  revealButtonEnabled: YES,
  
  sex: null,        // used when generating new dragons
  fixedAlleles: null,    // used when generating new dragons
  
  alleles: [],

  ignoreUpdate: YES,

  resetDragonOnInit: NO,

  trackScore: NO,
  
  activityBinding: 'Geniverse.activityController.content',
  
  hiddenGenes: function() {
    return Geniverse.activityController.getHiddenOrStaticGenes('hiddenGenes', this.get('sex'));
  }.property('activity').cacheable(),
  
  staticGenes: function() {
    return Geniverse.activityController.getHiddenOrStaticGenes('staticGenes', this.get('sex'));
  }.property('activity').cacheable(),
	
  init: function() {
    sc_super();
    if (this.get('resetDragonOnInit')) {
      var oldIgnoreUpdate = this.get('ignoreUpdate');
      this.set('ignoreUpdate', NO);
      this._processAlleleString();
      this.set('ignoreUpdate', oldIgnoreUpdate);
      this.set('layerNeedsUpdate', YES);
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

  destroy: function() {
    Geniverse.challengePoolController.removeObserver('length', this, this._loadChallengeDragon);
    sc_super();
  },

  gwtReadyBinding: 'Geniverse.gwtController.isReady',
  
  generateDragonWhenGWTReady: function() {
    var self = this;
    
    // if displayChallengeDragon, first we have to wait for challengePoolController
    // to be ready, and then we have to wait for the length of it to be larger
    // than the idex we have specified
    
    function loadChallengeDragonWhenDragonsLoaded() {
      Geniverse.challengePoolController.addObserver('firstFemale', self, self._loadChallengeDragon);
      Geniverse.challengePoolController.addObserver('firstMale', self, self._loadChallengeDragon);
      
      Geniverse.challengePoolController.removeObserver('status', loadChallengeDragonWhenDragonsLoaded);
      self._loadChallengeDragon();
    }
    
    if (this.get('displayChallengeDragon')) {
      if (Geniverse.challengePoolController.get('status') & SC.Record.READY) {
        loadChallengeDragonWhenDragonsLoaded();
      } else {
        Geniverse.challengePoolController.addObserver('status', loadChallengeDragonWhenDragonsLoaded);
      }
    } else if (this.get('generateDragonAtStart')){
      this.initRandomDragon();
    }
  }.observes('gwtReady'),
  
  _loadChallengeDragon: function() {
    var dragon = (this.get('sex') === 1) ? Geniverse.challengePoolController.get('firstFemale') : Geniverse.challengePoolController.get('firstMale');
    if (!dragon) {
      // if we didn't find any drakes of the expected sex, see if we can find one of the other sex and
      // then later we'll switch the sex of this genome panel.
      dragon = (this.get('sex') === 0) ? Geniverse.challengePoolController.get('firstFemale') : Geniverse.challengePoolController.get('firstMale');
    }
    if (!!dragon) {
      var self = this;
      SC.run(function() {
        self.set('ignoreUpdate', NO);
        self.set('sex', dragon.get('sex'));
        self.set('dragon', dragon);
        self.set('ignoreUpdate', YES);
      });
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
		  return {top: 18, left: this.getPath('parentView.dragonImageLeft'), width: 200, height: 215};
		}.property(),
	  contentBinding: "*parentView.dragon",
	  allowDrop: YES,
    isVisibleBinding: "*parentView.showDragon",
    useRevealButtonBinding: "*parentView.useRevealButton",
    revealButtonEnabledBinding: "*parentView.revealButtonEnabled",
    showBackground: NO
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
		value: "From mother",
		isVisibleBinding: '*parentView.showFromLabels'
	}),

  fatherLabel: SC.LabelView.design({
		layout: function() {
		  return {top: 0, left: this.getPath('parentView.chromosomeLeft') + 145, width: 100, height: 25};
		}.property(),
		value: "From father",
		isVisibleBinding: '*parentView.showFromLabels'
	}),

  switchSex: function() {
      this.set('sex', (this.get('sex') + 1) % 2);
      this._initDragon(this.get('sex'), this.getPath('dragon.alleles'));
      if (this.get('trackScore')) {
        Geniverse.scoringController.incrementScore(1);
      }
  },

  allAllelesSelected: NO,
  a1AllSelectedBinding: '*chromosomeA1View.allAllelesSelected',
  b1AllSelectedBinding: '*chromosomeB1View.allAllelesSelected',
  a2AllSelectedBinding: '*chromosomeA2View.allAllelesSelected',
  b2AllSelectedBinding: '*chromosomeB2View.allAllelesSelected',
  aXAllSelectedBinding: '*chromosomeAXView.allAllelesSelected',
  bXAllSelectedBinding: '*chromosomeBXView.allAllelesSelected',
  pulldownsDidChange: function() {
    this.set('allAllelesSelected', (
      this.get('a1AllSelected') &&
      this.get('b1AllSelected') &&
      this.get('a2AllSelected') &&
      this.get('b2AllSelected') &&
      this.get('aXAllSelected') &&
      this.get('bXAllSelected')
    ));
  }.observes('a1AllSelected', 'a2AllSelected', 'aXAllSelected',
             'b1AllSelected', 'b2AllSelected', 'bXAllSelected' ),
	
	chromosomeA1View: Geniverse.DragonChromosomeView.design({
	  layout: function() {
		  return {top: 25, left: this.getPath('parentView.chromosomeLeft')};
		}.property(),
	  
	  // allelesBinding doesn't work when we have more than one instance of
	  // dragonGenomeView. Don't know how to get it to work correctly, so
	  // added the non-sproutcorish "updateAlleles" instead...
	  
    // allelesBinding: SC.Binding.oneWay('*parentView.a1Alleles'),
	  updateDragon: function(){
      if (!!this.get('parentView')) {
        this.get('parentView').updateDragon();
      }
    }.observes('alleles'),
    updateAlleles: function(){
      if (!!this.get('parentView')) {
        this.set('alleles', this.get('parentView').get('a1Alleles'));
      }
    }.observes('*parentView.a1Alleles'),
    hiddenGenesBinding: '*parentView.hiddenGenes',
	  showEmptyOptionInPulldowns: function() {
      return (this.getPath('parentView.showAllelesOutput') || this.getPath('parentView.showEmptyOptions'));
    }.property(),
    startWithEmptyOptionBinding: '*parentView.startWithEmptyOptions',
    trackScoreBinding: '*parentView.trackScore',
	  chromosome: '1',
    side: 'A'
	}),
	
	chromosomeB1View: Geniverse.DragonChromosomeView.design({
	  layout: function() {
		  return {top: 25, left: this.getPath('parentView.chromosomeLeft') + 145};
		}.property(),
	  updateDragon: function(){
      if (!!this.get('parentView')) {
	      this.get('parentView').updateDragon();
      }
	  }.observes('alleles'),
	  updateAlleles: function(){
      if (!!this.get('parentView')) {
        this.set('alleles', this.get('parentView').get('b1Alleles'));
      }
    }.observes('*parentView.b1Alleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  showEmptyOptionInPulldowns: function() {
      return (this.getPath('parentView.showAllelesOutput') || this.getPath('parentView.showEmptyOptions'));
    }.property(),
    startWithEmptyOptionBinding: '*parentView.startWithEmptyOptions',
    trackScoreBinding: '*parentView.trackScore',
	  chromosome: '1',
    side: 'B'
	}),
	
	chromosomeA2View: Geniverse.DragonChromosomeView.design({
	  layout: function() {
		  return {top: 170, left: this.getPath('parentView.chromosomeLeft')};
		}.property(),
	  updateDragon: function(){
      if (!!this.get('parentView')) {
	      this.get('parentView').updateDragon();
      }
	  }.observes('alleles'),
	  updateAlleles: function(){
      if (!!this.get('parentView')) {
        this.set('alleles', this.get('parentView').get('a2Alleles'));
      }
    }.observes('*parentView.a2Alleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  showEmptyOptionInPulldowns: function() {
      return (this.getPath('parentView.showAllelesOutput') || this.getPath('parentView.showEmptyOptions'));
    }.property(),
    startWithEmptyOptionBinding: '*parentView.startWithEmptyOptions',
    trackScoreBinding: '*parentView.trackScore',
	  chromosome: '2',
    side: 'A'
	}),
	
	chromosomeB2View: Geniverse.DragonChromosomeView.design({
	  layout: function() {
		  return {top: 170, left: this.getPath('parentView.chromosomeLeft') + 145};
		}.property(),
	  updateDragon: function(){
      if (!!this.get('parentView')) {
	      this.get('parentView').updateDragon();
      }
	  }.observes('alleles'),
	  updateAlleles: function(){
      if (!!this.get('parentView')) {
        this.set('alleles', this.get('parentView').get('b2Alleles'));
      }
    }.observes('*parentView.b2Alleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  showEmptyOptionInPulldowns: function() {
      return (this.getPath('parentView.showAllelesOutput') || this.getPath('parentView.showEmptyOptions'));
    }.property(),
    startWithEmptyOptionBinding: '*parentView.startWithEmptyOptions',
    trackScoreBinding: '*parentView.trackScore',
	  chromosome: '2',
    side: 'B'
	}),
	
	chromosomeAXView: Geniverse.DragonChromosomeView.design({
	  layout: function() {
		  return {top: 315, left: this.getPath('parentView.chromosomeLeft')};
		}.property(),
	  updateDragon: function(){
      if (!!this.get('parentView')) {
	      this.get('parentView').updateDragon();
      }
	  }.observes('alleles'),
	  updateAlleles: function(){
      if (!!this.get('parentView')) {
        this.set('alleles', this.get('parentView').get('aXAlleles'));
      }
    }.observes('*parentView.aXAlleles'),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  showEmptyOptionInPulldowns: function() {
      return (this.getPath('parentView.showAllelesOutput') || this.getPath('parentView.showEmptyOptions'));
    }.property(),
    startWithEmptyOptionBinding: '*parentView.startWithEmptyOptions',
    trackScoreBinding: '*parentView.trackScore',
	  chromosome: 'X',
    side: 'A'
	}),
	
	chromosomeBXView: Geniverse.DragonChromosomeView.design({
	  layout: function() {
		  return {top: 315, left: this.getPath('parentView.chromosomeLeft') + 145};
		}.property(),
	  hiddenGenesBinding: '*parentView.hiddenGenes',
	  showEmptyOptionInPulldowns: function() {
      return (this.getPath('parentView.showAllelesOutput') || this.getPath('parentView.showEmptyOptions'));
    }.property(),
    startWithEmptyOptionBinding: '*parentView.startWithEmptyOptions',
    trackScoreBinding: '*parentView.trackScore',
	  updateDragon: function(){
      if (!!this.get('parentView')) {
	      this.get('parentView').updateDragon();
      }
	  }.observes('alleles'),
	  updateAlleles: function(){
      if (!!this.get('parentView')) {
        this.set('alleles', this.get('parentView').get('bXAlleles'));
      }
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
      if (!!this.get('parentView')) {
        var authoredAlleleString = this.get('parentView').get('authoredAlleleString');
        if (!!authoredAlleleString){
          this.set('value', authoredAlleleString);
        } else {
          this.set('value', this.get('parentView').getPath('dragon.alleles'));
        }
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
      SC.RunLoop.begin();
      var dragon = this.get('dragon');

      if (dragon === null || typeof(dragon) == "undefined") {
        this.set('alleles', []);
        return;
      }

      var alleleString = dragon.get('alleles');
      var alleles = Geniverse.chromosomeController.processAlleleString(alleleString);
      
      this.set('alleles', alleles);
      SC.RunLoop.end();
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
    
		if (typeof(generateDragonWithCallback) != "undefined") {
		  var sex = this.get('sex');
		  var fixedAlleles = this.get('fixedAlleles');
      this._initDragon(sex, fixedAlleles);
		}
  },

  secondXAlleles: null,
  _initDragon: function(sex, fixedAlleles) {
    var self = this;
    var currentDragon = this.get('dragon');
    if (sex === 1 && !!currentDragon && currentDragon.get('sex') === 0 && !!this.get('secondXAlleles')) {
      // going from male to female. Restore second X chromosome alleles
      fixedAlleles = fixedAlleles + "," + this.get('secondXAlleles');
      this.secondXAlleles = null;
    }
    function updateDragon(dragon) {
      if (sex === 0 && !!currentDragon && currentDragon.get('sex') === 1) {
        // we're switching from female to male, store the current alleles of the second X chromosome
        // so that we can restore them if we switch back to female again
        var oldAlleles = currentDragon.get('alleles').split(",");
        var newAlleles = dragon.get('alleles').split(",");
        var save = oldAlleles.filter(function(allele) { return newAlleles.indexOf(allele) === -1; });
        self.set('secondXAlleles', save.join(","));
      }
      SC.run(function() {
        self.set('ignoreUpdate', NO);
        self.set('dragon', dragon);
        self.set('ignoreUpdate', YES);
      });
    }

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
});
