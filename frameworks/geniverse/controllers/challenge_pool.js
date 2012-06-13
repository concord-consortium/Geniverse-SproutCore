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

  males: [],
  females: [],

  // TODO: Add your own code here.
  dragonsChanged: function() {
    if (this.get('length') > 0) {
      var matchingDragons = this.filterProperty('sex', 1);
      this.set('females', matchingDragons);
      var dragon = null;
      if (matchingDragons.get('length') > 0){
        dragon = matchingDragons[0];
        this.set('firstFemale', dragon);
      } else {
        this.set('firstFemale', null);
      }
      matchingDragons = this.filterProperty('sex', 0);
      this.set('males', matchingDragons);
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
  
  configContains: function(sex) {
    var user = Geniverse.userController.get('content');
    var group = user.get('groupId')  - 1;
    var member = user.get('memberId')- 1;
    var conf = Geniverse.activityController.getConfigurationForRoomMember(group,member, false);
    for (var i = 0, ii = conf.length; i < ii; i++){
      if (conf[i].sex === sex){
        return true;
      }
    }
    return false;
  },
  
  firstFemale: null,
  firstMale: null
});
