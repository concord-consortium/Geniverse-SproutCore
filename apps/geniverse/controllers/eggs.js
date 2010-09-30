// ==========================================================================
// Project:   Geniverse.eggs
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.eggsController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Geniverse.eggsController.prototype */ {
    
    removeAllEggs: function () {
      if (Geniverse.EGGS_QUERY === null || typeof Geniverse.EGGS_QUERY == "undefined") {
        SC.Logger.warn("null eggs query!");
      } else {
        var eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
        eggs.forEach(function (egg){
          egg.set('isInMarketplace', true);
        });
      }
    },
    
    collectionViewDeleteContent: function(view, content, indexes) {
      // destroy the records
      var records = indexes.map(function(idx) {
        return this.objectAt(idx);
      }, this);
      records.invoke('destroy');

      var selIndex = indexes.get('min')-1;
      if (selIndex<0) selIndex = 0;
      this.selectObject(this.objectAt(selIndex));
    }
}) ;
