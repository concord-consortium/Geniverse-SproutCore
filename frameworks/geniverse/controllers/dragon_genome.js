// ==========================================================================
// Project:   Geniverse.dragonGenomeController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse Lab*/

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.dragonGenomeController = SC.Object.create({
  
  firstDragon: null,
  secondDragon: null,
  thirdDragon: null,
  
  dragonIndexMap: {
    1: "firstDragon",
    2: "secondDragon",
    3: "thirdDragon"
  },
  
  dragonAllelesMap: {},
  
  secondXAllelesMap: {},
  
  waitingForMap: {},        // for each view, which drake we're expecting to receive. Allows us to ignore obsolete requests
  
  // creates a dragon for a view, given a sex and whether the dragon should be pulled from
  // the challenge list or be generated randomly
  initDragonForView: function(index, sex, isChallengeDragon) {
    this.waitingForMap[index] = null;
    if (isChallengeDragon) {
      this._generateChallengeDragon(sex, index);
    } else {
      this._generateRandomDragon(sex, index);
    }
    // this.get('arrangedObjects').propertyDidChange();    // not sure if this is necessary
  },
  
  updateDragon: function(index, alleles, sex, name, hiddenGenes) {
    if (!alleles || !alleles[1]){
      return;
    }
    
    var outStr = "";
  
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
    hiddenGenes = hiddenGenes.join();
    var rmHidden = new RegExp(".:["+hiddenGenes+"],","ig");         // rm hidden genes
    outStrIgnoredGenesRemoved = outStrIgnoredGenesRemoved.replace(rmHidden,"");
    // this.set("authoredAlleleString", outStrIgnoredGenesRemoved);
    
    if (outStr === this.dragonAllelesMap[index]) {
      return;       // don't create new dragon if alleles are the same
    }
    this.dragonAllelesMap[index] = outStr;
    
    var self = this;
    var waitingFor;
    waitingFor = this.waitingForMap[index] = Math.floor(Math.random() * 1000);
    Geniverse.gwtController.generateDragonWithAlleles(outStr, sex, name, function(dragon) {
     SC.run(function() {
       self._setDragon(index, dragon, waitingFor);
        // self.set(self.dragonIndexMap[index], dragon);
     });
    });
  },
  
  _generateChallengeDragon: function(sex, index) {
    var self = this;
    function challengeDragonsLoaded() {
      var dragon = (sex === 1) ? 
        Geniverse.challengePoolController.get('firstFemale') : 
        Geniverse.challengePoolController.get('firstMale');
        
      if (!dragon && !Geniverse.challengePoolController.configContains(sex)) {
        // if we didn't find any drakes of the expected sex, see if we can find one of the other sex and
        // then later the sex of this genome panel will switch automatically.
        dragon = (sex === 0) ? Geniverse.challengePoolController.get('firstFemale') : Geniverse.challengePoolController.get('firstMale');
      }
      
      if (!!dragon) {
        Geniverse.challengePoolController.removeObserver('firstFemale', challengeDragonsLoaded);
        Geniverse.challengePoolController.removeObserver('firstMale', challengeDragonsLoaded);
        self._setDragon(index, dragon);
      }
    }
    
    if (Geniverse.challengePoolController.get("firstFemale") || Geniverse.challengePoolController.get("firstMale")) {
      challengeDragonsLoaded();
    } else {
      Geniverse.challengePoolController.addObserver('firstFemale', challengeDragonsLoaded);
      Geniverse.challengePoolController.addObserver('firstMale', challengeDragonsLoaded);
    }
  },
  
  _generateRandomDragon: function(sex, index) {
    this._initFixedDragon(sex, '', index);
  },
  
  _initFixedDragon: function(sex, fixedAlleles, index) {
    if (!fixedAlleles) {
      return;
    }

    var self = this;
    var currentDragon = this.get(this.dragonIndexMap[index]);
    if (sex === 1 && !!currentDragon && currentDragon.get('sex') === 0 && !!this.secondXAllelesMap[index]) {
      // going from male to female. Restore second X chromosome alleles
      fixedAlleles = fixedAlleles + "," + this.secondXAllelesMap[index];
      this.secondXAllelesMap[index] = null;
    }
    
    var waitingFor;
    waitingFor = this.waitingForMap[index] = Math.floor(Math.random() * 1000);
    
    function updateDragon(dragon) {
      if (sex === 0 && !!currentDragon && currentDragon.get('sex') === 1) {
        // we're switching from female to male, store the current alleles of the second X chromosome
        // so that we can restore them if we switch back to female again
        var oldAlleles = currentDragon.get('alleles').split(",");
        var newAlleles = dragon.get('alleles').split(",");
        var save = oldAlleles.filter(function(allele) { return newAlleles.indexOf(allele) === -1; });
        self.secondXAllelesMap[index] = save.join(",");
      }
      SC.run(function() {
        self._setDragon(index, dragon, waitingFor);
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
  
  },
  
  _setDragon: function (index, dragon, waitingFor) {
    if (!!this.waitingForMap[index] && this.waitingForMap[index] !== waitingFor){
      return;             // stale drake returned
    }
    if (dragon.get('alleles') !== this.dragonAllelesMap[index]) {
      this.set(this.dragonIndexMap[index], dragon);
      Lab.statechart.sendAction("chromosomeDragonChanged");
    }
  }
   
  // generateDragonWhenGWTReady: function() {
  //   var self = this;
  //   
  //   // if displayChallengeDragon, first we have to wait for challengePoolController
  //   // to be ready, and then we have to wait for the length of it to be larger
  //   // than the idex we have specified
  //   
  //   function addChallengeDragonsObserver() {
  //     Geniverse.challengePoolController.addObserver('firstFemale', self, self._loadChallengeDragon);
  //     Geniverse.challengePoolController.addObserver('firstMale', self, self._loadChallengeDragon);
  //     
  //     Geniverse.challengePoolController.removeObserver('status', loadChallengeDragonWhenDragonsLoaded);
  //     self._loadChallengeDragon();
  //   }
  //   
  //   if (Geniverse.challengePoolController.get('status') & SC.Record.READY) {
  //     addChallengeDragonsObserver();
  //   } else {
  //     Geniverse.challengePoolController.addObserver('status', addChallengeDragonsObserver);
  //   }
  //   
  //   // if (this.get('displayChallengeDragon')) {
  //   //   if (Geniverse.challengePoolController.get('status') & SC.Record.READY) {
  //   //     loadChallengeDragonWhenDragonsLoaded();
  //   //   } else {
  //   //     Geniverse.challengePoolController.addObserver('status', loadChallengeDragonWhenDragonsLoaded);
  //   //   }
  //   // } else if (this.get('generateDragonAtStart')){
  //   //   this.initRandomDragon();
  //   // }
  // }.observes('gwtReady'),
  // 
  // gwtReadyBinding: 'Geniverse.gwtController.isReady',
  
  // _loadChallengeDragon: function() {
  //    var dragon = (this.get('sex') === 1) ? Geniverse.challengePoolController.get('firstFemale') : Geniverse.challengePoolController.get('firstMale');
  // 
  //    if (!dragon && !Geniverse.challengePoolController.configContains(this.get('sex'))) {
  //      // if we didn't find any drakes of the expected sex, see if we can find one of the other sex and
  //      // then later we'll switch the sex of this genome panel.
  //      dragon = (this.get('sex') === 0) ? Geniverse.challengePoolController.get('firstFemale') : Geniverse.challengePoolController.get('firstMale');
  //    }
  //    
  //    // dragon may be null -- that's ok
  //    var self = this;
  //    SC.run(function() {
  //      self.set('ignoreUpdate', NO);
  //      if (!!dragon){
  //        self.set('sex', dragon.get('sex'));
  //      }
  //      self.set('dragon', dragon);
  //      self.set('ignoreUpdate', YES);
  //    });
  //  },
  //  
  //  initRandomDragon: function () {
  //    
  //    if (typeof(generateDragonWithCallback) != "undefined") {
  //      var sex = this.get('sex');
  //      var fixedAlleles = this.get('fixedAlleles');
  //      this._initDragon(sex, fixedAlleles);
  //    }
  //  },
  //  
  //  _initDragon: function(sex, fixedAlleles) {
  //    var self = this;
  //    var currentDragon = this.get('dragon');
  //    if (sex === 1 && !!currentDragon && currentDragon.get('sex') === 0 && !!this.get('secondXAlleles')) {
  //      // going from male to female. Restore second X chromosome alleles
  //      fixedAlleles = fixedAlleles + "," + this.get('secondXAlleles');
  //      this.secondXAlleles = null;
  //    }
  //    function updateDragon(dragon) {
  //      if (sex === 0 && !!currentDragon && currentDragon.get('sex') === 1) {
  //        // we're switching from female to male, store the current alleles of the second X chromosome
  //        // so that we can restore them if we switch back to female again
  //        var oldAlleles = currentDragon.get('alleles').split(",");
  //        var newAlleles = dragon.get('alleles').split(",");
  //        var save = oldAlleles.filter(function(allele) { return newAlleles.indexOf(allele) === -1; });
  //        self.set('secondXAlleles', save.join(","));
  //      }
  //      SC.run(function() {
  //        self.set('ignoreUpdate', NO);
  //        self.set('dragon', dragon);
  //        self.set('ignoreUpdate', YES);
  //      });
  //    }
  // 
  //    if (sex !== undefined && sex !== null && fixedAlleles !== undefined && fixedAlleles !== null){
  //      Geniverse.gwtController.generateDragonWithAlleles(fixedAlleles, sex, "", updateDragon);
  //    } else if (sex !== undefined && sex !== null) {
  //      Geniverse.gwtController.generateDragon(sex, "", updateDragon);
  //    } else if (fixedAlleles !== undefined && fixedAlleles !== null) {
  //      Geniverse.gwtController.generateDragonWithAlleles(fixedAlleles, -1, "", updateDragon);
  //    } else {
  //      Geniverse.gwtController.generateRandomDragon(updateDragon);
  //    }
  //  
  //  }
  
  }) ;