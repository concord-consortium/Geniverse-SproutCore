// ==========================================================================
// Project:   Geniverse.challengePoolController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.challengePoolController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Geniverse.challengePoolController.prototype */ {
  selectionBinding: 'Geniverse.allSelectedDragonsController.selection',
  // TODO: Add your own code here.
  dragonsChanged: function() {
    if (this.get('length') > 0) {
      var matchingDragons = this.filterProperty('sex', 1);
      var dragon = null;
      if (matchingDragons.get('length') > 0){
        dragon = matchingDragons[0];
        this.set('firstFemale', dragon);
      } else {
        this.set('firstFemale', null);
      }
      matchingDragons = this.filterProperty('sex', 0);
      if (matchingDragons.get('length') > 0){
        dragon = matchingDragons[0];
        this.set('firstMale', dragon);
      } else {
        this.set('firstMale', null);
      }
    } else {
      this.set('firstFemale', null);
      this.set('firstMale', null);
    }
  }.observes('length'),

  firstFemale: null,
  firstMale: null
});
