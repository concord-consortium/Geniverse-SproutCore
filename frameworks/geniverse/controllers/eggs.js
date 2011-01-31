// ==========================================================================
// Project:   Geniverse.eggs
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.eggsController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Geniverse.eggsController.prototype */ {

  selectionBinding: 'Geniverse.allSelectedDragonsController.selection',

  removeAllEggs: function () {
    if (this.get('content') !== null) {
      this.get('content').forEach(Geniverse.eggsController._destroyEgg);
      Geniverse.store.commitRecords();
    }
    this.set('content',[]);
  },

  _destroyEgg: function(egg) {
    // tell the datastore to remove the egg from it's data hashes to save memory
    // SC.Logger.log("Destroying egg", egg.get('id'));
    if (egg.get('state') & SC.Record.READY) {
      egg.removeObserver('state', Geniverse.eggsController, '_destroyEgg');
      egg.destroy();
    } else {
      // egg isn't in a ready state -- add an observer to remove the egg when it is ready.
      // it's ok to add the same observer multiple times, as SC will detect the duplicate and only
      // end up with 1 registered observer
      egg.addObserver('state', Geniverse.eggsController, '_destroyEgg');
    }
  },

  saveData: function() {
    Geniverse.store.commitRecords();
  }.observes('[]'),

  collectionViewDeleteContent: function(view, content, indexes) {
    // destroy the records
    var records = indexes.map(function(idx) {
      return this.objectAt(idx);
    }, this);
    records.invoke('destroy');

    var selIndex = indexes.get('min')-1;
    if (selIndex<0) {
      selIndex = 0;
    }
    this.selectObject(this.objectAt(selIndex));
  },

  // http://www.pivotaltracker.com/story/show/5298197
  // rest parents and breeding pool.
  reset: function() {
    this.removeAllEggs();
  }.observes('Geniverse.breedDragonController.resetCount')
});
