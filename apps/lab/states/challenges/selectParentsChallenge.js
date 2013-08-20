// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

Lab.selectParentsChallenge = Lab.challenge.extend({

  challengeComplete: NO,
  challengeWasAlreadyComplete: NO,

  solved: NO,

  timesAttempted: 0,

  enterState: function() {
    this.startChallenge();
  },

  startChallenge: function() {
    this.set('challengeComplete', NO);
    this.set('challengeWasAlreadyComplete', NO);
    this.set('timesAttempted', 0);
    this.set('solved', NO);

    this.get('statechart').sendAction('blockNextNavButton');
    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', NO);
  },

  endChallenge: function() {
    this.set('challengeComplete', YES);
    this.get('statechart').sendAction('unblockNextNavButton');

    var pageId = Geniverse.activityController.get('route');
    Geniverse.userController.setPageStars(pageId, this.get('starsEarned'));
    Geniverse.store.commitRecords();

    // why can't bindings in SC work as advertised?
    Lab.caselogController.propertyDidChange("userMetadata");
  },

  submitParents: function() {
    var targetConfigs = Geniverse.activityController.getConfigurationForRoomMember(0,0, true),
        target1Alleles = targetConfigs[0].alleles,
        target2Alleles = targetConfigs[1].alleles,
        targetCharacteristics = this._getPossibleCharacteristics(target1Alleles, target2Alleles),
        parent1Alleles = Geniverse.breedDragonController.getPath('mother.alleles'),
        parent2Alleles = Geniverse.breedDragonController.getPath('father.alleles'),
        currentCharacteristics = this._getPossibleCharacteristics(parent1Alleles, parent2Alleles),
        timesAttempted = this.timesAttempted;
    this.timesAttempted = timesAttempted + 1;

    var allMatch = true;
    var trait, characteristic;
    for (trait in targetCharacteristics) {
      if (!targetCharacteristics.hasOwnProperty(trait)) continue;
      characteristics = targetCharacteristics[trait];
      for (characteristic in characteristics) {
        if (!characteristics.hasOwnProperty(characteristic)) continue;
        if (characteristics[characteristic] !== currentCharacteristics[trait][characteristic]) {
          allMatch = false;
        }
      }
    }

    if (allMatch) {
      this.solved = YES;
      this.set('starsEarned', Math.max(3-timesAttempted, 1));
      SC.AlertPane.extend({layout: {top: 0, centerX: 0, width: 300, height: 100 }}).plain(
        "Good work!",
        "Those parents will do perfectly!",
        "",
        "OK",
        "",
        this
      );
    } else {
      SC.AlertPane.extend({layout: {top: 0, centerX: 0, width: 300, height: 100 }}).error(
        "That's not right!",
        "Those parents will not produce the right proportions of offspring. Keep trying!",
        "",
        "OK",
        "",
        this
      );
    }
  },

  _getPossibleCharacteristics: function(parent1Alleles, parent2Alleles) {
    var parent1aAlleles = parent1Alleles.match(/a:([^,]*)/g).map(function(str) {
          return str.match(/[^:]+$/)[0];
        }),
        parent1bAlleles = parent1Alleles.match(/b:([^,]*)/g).map(function(str) {
          return str.match(/[^:]+$/)[0];
        }),
        parent2aAlleles = parent2Alleles.match(/a:([^,]*)/g).map(function(str) {
          return str.match(/[^:]+$/)[0];
        }),
        parent2bAlleles = parent2Alleles.match(/b:([^,]*)/g).map(function(str) {
          return str.match(/[^:]+$/)[0];
        }),
        possibleConfigs = {},
        possibleChars = {};
    var i,j,k;
    for (i = 0, ii=parent1aAlleles.length; i<ii; i++) {
      a1 = parent1aAlleles[i];
      trait = this._getTraitOfAllele(a1);
      // first generate the combos for this allele
      alleleCombos = [];
      alleleCombos[0] = [a1, parent2aAlleles[i]];
      alleleCombos[1] = [a1, parent2bAlleles[i]];
      alleleCombos[2] = [parent1bAlleles[i], parent2aAlleles[i]];
      alleleCombos[3] = [parent1bAlleles[i], parent2bAlleles[i]];

      var existingPossibilities = possibleConfigs[trait];
      var allPossibilities = [];
      if (typeof(existingPossibilities) != 'undefined') {
        // we already have possibilities for this trait,
        // so multiply this alleles possibilities with the existing ones
        // to get all the combinations (so far) for this trait
        // ex: existing aA/aA: [[a,a],[a,A],[A,a],[A,A]]
        //     new      BB/bB: [[B,b],[B,B],[B,b],[B,B]
        //     result: the 16 combinations of the two sets
        //
        //     MAKE SURE TO USE ARRAY CLONES FOR THIS!!
        var possible, combo;
        for (j=0, jj=existingPossibilities.length; j<jj; j++){
          possible = existingPossibilities[j];
          for (k=0, kk=alleleCombos.length; k<kk; k++) {
            combo = alleleCombos[k].slice(0);
            currentCombo = possible.slice(0);
            currentCombo.pushObjects(combo);
            allPossibilities.push(currentCombo);

          }
        }
      } else {
        allPossibilities = alleleCombos;
      }
      possibleConfigs[trait] = allPossibilities;
    }

    for (var trait in possibleConfigs) {
      if (!possibleConfigs.hasOwnProperty(trait)) continue;
      possibleChars[trait] = {};
      configs = possibleConfigs[trait];
      for (i=0, ii=configs.length; i<ii; i++){
        config = configs[i];
        // config could be a long list of alleles, so concat by pairs
        alleleString = "";
        for (j=0, jj=config.length; j<jj; j += 2) {
          alleleString += "a:"+config[j]+",b:"+config[j+1]+",";
        }
        alleleString = alleleString.slice(0,alleleString.length-1);
        org = new BioLogica.Organism.createOrganism(BioLogica.Species.Drake, alleleString);
        characteristic = org.getCharacteristic(trait);
        if (!possibleChars[trait][characteristic]) possibleChars[trait][characteristic] = 0;
        possibleChars[trait][characteristic]++;
      }
    }
    return possibleChars;
  },

  _getTraitOfAllele: function(allele) {
    var trait, traitName, _ref, charName;
    _ref = BioLogica.Species.Drake.traitRules;
    for (traitName in _ref) {
      if (!_ref.hasOwnProperty(traitName)) continue;
      trait = _ref[traitName];
      for (charName in trait) {
        if (!trait.hasOwnProperty(charName)) continue;
        charac = trait[charName];
        for (var i=0, ii=charac.length; i<ii; i++){
          var possibility = charac[i];
          if (~possibility.indexOf(allele)) {
            return traitName;
          }
        }
      }
    }
  },

  alertPaneDidDismiss: function() {
    if (this.solved) {
      this._challengeComplete(" ");
    }
  },

  exitState: function() {
  }

});
