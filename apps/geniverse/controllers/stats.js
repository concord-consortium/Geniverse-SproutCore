// ==========================================================================
// Project:   Geniverse.breedDragonController
// Copyright: ©2010 The Concord Consortium
// ==========================================================================
/*globals Geniverse generateDragonWithSex*/

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.statsController = SC.Controller.create(
/** @scope Geniverse.breedDragonController.prototype */ {
  parentStats: SC.Object.create({
    colors: SC.Object.create({
      red: 0,
      green: 0,
      yellow: 0,
      purple: 0,
      brown: 0
    })
  }),
  
  // http://www.pivotaltracker.com/story/show/5298197
  // rest parents and breeding pool.
  reset: function() {
    this.setPath('parentStats.colors.red',0);
    this.setPath('parentStats.colors.green',0);
    this.setPath('parentStats.colors.yellow',0);
    this.setPath('parentStats.colors.purple',0);
    this.setPath('parentStats.colors.brown',0);
  }.observes('Geniverse.breedDragonController.resetCount'),
  
  newChildObserver: function()  {
    this.updateStats(Geniverse.breedDragonController.get('newChild'));
  }.observes('Geniverse.breedDragonController.newChild'),

  updateStats: function(new_dragon) {
    if (new_dragon) {
      var color = new_dragon.get('color').toLowerCase();
      var value = this.getPath('parentStats.colors.' + color) + 1;
      this.setPath('parentStats.colors.' + color,value);
    }
  }
  
});
