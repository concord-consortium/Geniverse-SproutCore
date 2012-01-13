// ==========================================================================
// Project:   Geniverse.matchController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse Lab*/

/** @class

  This controller containes the list of authored dragons that a student
  is attempting to match.

  @extends SC.Object
*/

sc_require('views/match');
sc_require('views/popup_match');

Geniverse.matchController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Geniverse.challengePoolController.prototype */ {

  allowsSelection: NO,

  pane: Geniverse.PopupMatchView,

  showPane: function() {
    var width = (Geniverse.matchController.get('length') * 130);
    width  = width < 130 ? 130 : width;
    this.get('pane').get('layout').width = 260;
    this.get('pane').layoutDidChange();
    if (!this.get('pane').get('isVisibleInWindow')){
      this.get('pane').append();
    }
  },

  // for one-at-a-time matching
  oneAtATime: NO,
  currentDragonIdx: -1,
  currentDragon: null,
  updateCurrentDragon: function() {
    if (!Geniverse.activityController.get('content')) {
      return;
    }
    
    if (this.get('currentDragonIdx') === -1) {
      this.set('currentDragonIdx', 0);
    }
    var dragons = this.get('arrangedObjects');
    var dragon = Geniverse.NO_DRAGON;
    if (dragons && dragons.get('length') > 0) {
      dragon = dragons.objectAt(this.get('currentDragonIdx'));
    }
    
    if (this.get('currentDragon') !== dragon) {
      this.set("currentDragon", dragon);
      this.propertyDidChange('matchedCountLabel');
      Lab.statechart.sendAction('matchDragonChanged');
    }
    
  }.observes('*arrangedObjects.length'),
  // this will be obsolete once we use a graphic
  matchedCountLabel: function() {
    var numDragons = this.get('arrangedObjects').get('length');
    return "Trial " + (this.get('currentDragonIdx')+1) + " of " + numDragons;
  }.property('currentDragonIdx', 'arrangedObjects.length'),

  nextDragon: function() {
    SC.RunLoop.begin();
    this.set('currentDragonIdx', (this.get('currentDragonIdx') + 1) % this.get('arrangedObjects').length());
    SC.RunLoop.end();
  },

  isLastDragon: function() {
    var idx = this.get('currentDragonIdx');
    return (idx+1) >= this.get('length');
  },

  doesMatch: function(expected, received) {
    if (expected.get('imageURL') === received.get('imageURL')) {
      // match!
      return YES;
    }
    return NO;
  },

  doesMatchCurrent: function(received) {
    return this.doesMatch(this.get("currentDragon"), received);
  },

  // Returns the number of moves that are required to go from a given dragon to
  // the current match dragon.
  // - Each necessary change of an allele is a move
  // - Change of sex is a move
  numberOfMovesToReachCurrent: function(dragon) {
    var moves = 0,
        dragonChars = dragon.get('characteristicMap'),
        current = this.get("currentDragon"),
        currentchars = current.get('characteristicMap'),
        traitRules = Geniverse.Dragon.traitRules;

    moves = this.numberOfAlleleChangesToReachPhenotype(dragonChars, currentchars, dragon.get('alleles'), traitRules);
    if (dragon.get("sex") != current.get("sex")){
      moves++;
    }

    return moves;
  },

  numberOfAlleleChangesToReachPhenotype: function(originalCharacteristics, targetCharacteristics, originalAlleles, traitRules){
    var alleles = originalAlleles.split(",").map(function(a) { return a.split(":")[1]; }),   // creates array of orig alleles from string
        moves   = 0;

    for (var trait in traitRules) {
      if (traitRules.hasOwnProperty(trait)) {
        if (originalCharacteristics.get(trait) !== targetCharacteristics.get(trait)) {
          // first we have to work out what alleles the original drake has that correspond to
          // their non-matching trait
          var possibleTraitAlleles = this._collectAllAllelesForTrait(trait, traitRules),
              characteristicAlleles = [];
          for (var i = 0, ii = alleles.length; i < ii; i++) {
            if (possibleTraitAlleles.indexOf(alleles[i]) >= 0){
              characteristicAlleles.push(alleles[i]);
            }
          }
          // now work out the smallest number of steps to get from there to the desired characteristic
          var possibleSolutions = traitRules[trait][targetCharacteristics.get(trait)],
              shortestPathLength = Infinity;
          for (i = 0, ii = possibleSolutions.length; i < ii; i++) {
            var solution = possibleSolutions[i].copy(),
                pathLength = 0;
            for (var j = 0, jj = characteristicAlleles.length; j < jj; j++){
              if (solution.indexOf(characteristicAlleles[j]) == -1){
                pathLength++;
              } else {
                solution.removeAt(solution.indexOf(characteristicAlleles[j]));      // already matched this one, can't match it again
              }
            }
            shortestPathLength = (pathLength < shortestPathLength) ? pathLength : shortestPathLength;
          }
          moves += shortestPathLength;
        }
      }
    }
    return moves;
  },

  // Goes through the traitRules to find out what unique alleles are associated with each trait
  // E.g. For "tail" it will return ["T", "Tk", "t"]
  _collectAllAllelesForTrait: function(trait, traitRules) {
    if (!!this.possibleAllelesForTrait[trait]) {
      return this.possibleAllelesForTrait[trait];
    }

    var allelesHash = {},
        alleles     = [];
    for (var characteristic in traitRules[trait]){
        for (var possibileAllelesCombo in traitRules[trait][characteristic]) {
          if (traitRules[trait][characteristic].hasOwnProperty(possibileAllelesCombo)){
            for (var i = 0, ii = traitRules[trait][characteristic][possibileAllelesCombo].length; i < ii; i++) {
              allelesHash[traitRules[trait][characteristic][possibileAllelesCombo][i]] = 1;
            }
          }
        }
    }

    for (var allele in allelesHash){
      alleles.push(allele);
    }

    this.possibleAllelesForTrait[trait] = alleles;      // store so we don't need to recalculate it
    return alleles;
  },

  possibleAllelesForTrait: {}
}) ;
