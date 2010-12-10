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
      // this.get('content').forEach(function(egg){
      //   egg.set('isEgg', false);
      //   egg.set('isInMarketplace', true);
      // });
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
      if (selIndex<0) selIndex = 0;
      this.selectObject(this.objectAt(selIndex));
    },

    // http://www.pivotaltracker.com/story/show/5298197
    // rest parents and breeding pool.
    reset: function() {
      this.removeAllEggs();
    }.observes('Geniverse.breedDragonController.resetCount')
}) ;
