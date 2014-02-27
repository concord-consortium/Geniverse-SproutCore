// ==========================================================================
// Project:   Geniverse.statisticsController
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.statisticsController = SC.Controller.create(
/** @scope Geniverse.statisticsController.prototype */ {

  isBreedingBinding: 'Geniverse.breedDragonController.isBreeding',
  dragonsBinding: 'Geniverse.eggsController.content',
  previousBreedingStatus: NO,
  breedingComplete: YES,
  dragonGroups: {},
  dragonSize: 0,
  cumulativeCounts: {},
  cumulativeSize: 0,
  traitList: [
    { title: "Horns" },
    { title: "Wings" },
    { title: "Forelimbs" },
    { title: "Hindlimbs" },
    { title: "Armor" },
    { title: "Tail" },
    { title: "Color" },
    { title: "Nose spike"},
    { title: "Health"}
  ],


  breedingStatus: function(){
    if (this.get('isBreeding') == NO){
      this.calculateStats();
    }
  }.observes('isBreeding'),

  calculateStats: function() {
    var dragonGroups = {};
    var cumulativeCounts = this.get('cumulativeCounts');
    var cumulativeSize = this.get('cumulativeSize');
    var dragons = this.get('dragons');
    if (dragons !== null){
      dragons.forEach(function(dragon){
        var traitList = this.get('traitList');
        cumulativeSize++;
        for (var i = 0; i < traitList.length; i++){
          var trait = traitList[i].title;
          var characteristic = dragon.characteristicValue(trait);
          var sex = dragon.sexAsString();
          if (!dragonGroups[trait]){
            dragonGroups[trait] = {};
          }
          if (!dragonGroups[trait][characteristic]) {
            dragonGroups[trait][characteristic] = {};
            dragonGroups[trait][characteristic].Male = 0;
            dragonGroups[trait][characteristic].Female = 0;
          }
          if (!cumulativeCounts[trait]){
            cumulativeCounts[trait] = {};
          }
          if (!cumulativeCounts[trait][characteristic]) {
            cumulativeCounts[trait][characteristic] = {};
            cumulativeCounts[trait][characteristic].Male = 0;
            cumulativeCounts[trait][characteristic].Female = 0;
          }
          dragonGroups[trait][characteristic][sex] += 1;
          cumulativeCounts[trait][characteristic][sex] += 1;
        }
      },this);
      this.set('dragonGroups',dragonGroups);
      this.set('cumulativeCounts',cumulativeCounts);
      this.set('cumulativeSize',cumulativeSize);
      this.set('breedingComplete',!this.get('breedingComplete'));
    }
  },

  reset: function(){
    this.set('cumulativeCounts',{});
    this.set('cumulativeSize',0);
  }

}) ;
