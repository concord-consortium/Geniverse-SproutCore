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
        // FIXME We should also destroy all the Organism views associated with these eggs.
        // Without an explicit destroy() call, they stick around, and GridView doesn't do this automatically
        this.get('content').forEach(function(egg){
          // tell the datastore to remove the egg from it's data hashes to save memory
          // SC.Logger.log("Destroying egg", egg.get('id'));
          egg.destroy();
        });
        Geniverse.store.commitRecords();
      }
      this.set('content',[]);
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
}) ;
