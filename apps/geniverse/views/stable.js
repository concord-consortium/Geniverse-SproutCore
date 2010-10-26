// ==========================================================================
// Project:   Geniverse.StableView
// Copyright: ©2010 Concord Consortium, Inc.
// ==========================================================================
/*globals Geniverse, generateDragonWithSex CC alert */

/** @class

  Geniverse.StableView
  Show statistics about dragons which have been bread.

  @extends SC.View
*/

Geniverse.StableView = SC.View.extend(
  /** @scope Geniverse.StableView.prototype */ {
	
  childViews: 'stableChromosomeToolView title stable '.w(),
  stableChromosomeToolView: Geniverse.ChromosomeToolView.design({
    layout: { right: 0, top: 0, width: 35, height: 30 },
    selectionBinding: 'Geniverse.stableOrganismsController.selection'
  }),
  
  title: SC.LabelView.design({
    classNames: 'container_label'.w(),
    layout: { centerX: 0, top:30, height: 20, width: 240 },
    controlSize: "bity",
    textAlign: SC.ALIGN_CENTER,
    fontWeight: SC.BOLD_WEIGHT,
    woo: function() {
      // SC.Logger.log("woo");
      this.propertyDidChange('value');
    }.observes("Geniverse.stableOrganismsController.arrangedObjects.[]"),
    value:  function() {
      var numDragons = Geniverse.stableOrganismsController.get('length');
      var spaces = 50 - numDragons;
      // SC.Logger.log("recalculating");
      return "Your Stable      -   " + spaces + " spaces remaining";
    }.property('Geniverse.stableOrganismsController.arrangedObjects.[]')
  }),

  stable: CC.AutoScrollView.design({
    hasHorizontalScroller: NO,
    layout: { left: 0, top:30+20, width: 240 },
    contentView: SC.GridView.design({
      contentBinding: 'Geniverse.stableOrganismsController.arrangedObjects',
      selectionBinding: 'Geniverse.stableOrganismsController.selection',
      rowHeight: 60,
      columnWidth: 60,
      canEditContent: NO,
      exampleView: Geniverse.OrganismView,
      isSelectable: YES,
      dragDataTypes: ['dragon']
    }),

    autoScrollTriggerBinding: 'Geniverse.stableOrganismsController.length',

    isDropTarget: YES,

    dragonNum: 0,
    acceptDragOperation: function(drag, op) {
      var self = this;
      // can we accept this dragon?
      function acceptDragon(dragon){
        if (!dragon){
          return;
        }
        var dragonNum = self.get('dragonNum');

        // check if there are existing dragons
        var allStableDragons = Geniverse.stableOrganismsController.get('arrangedObjects');
        var count = Geniverse.stableOrganismsController.get('length');
        if (count >= 50){
          alert("Your stable is full");
          return;
        }
        if (count > 0){
          var lastDragon = allStableDragons.objectAt(count-1);
          var lastStableOrder = lastDragon.get('stableOrder');
          if (!!lastStableOrder && lastStableOrder > count){
            dragonNum = lastStableOrder + 1;
          } else {
            dragonNum = count + 1;
          }
          self.set('dragonNum', dragonNum);
        }
        
        SC.RunLoop.begin();
          dragon.set('isEgg', false);
          dragon.set('stableOrder', dragonNum);
        SC.RunLoop.end();
        Geniverse.store.commitRecords();
        self.dragonNum = self.dragonNum + 1;
        SC.Logger.info("Stable has %d dragons", self.dragonNum);
      }
      
      if (drag.hasDataType('dragonChat')) {
        SC.Logger.info("we found a dragon from chat");
        var jsonData = drag.get('data');
        Geniverse.dragonChattingController.createNewDragonFromChat(jsonData,
          function(dragon) {
            acceptDragon(dragon);
        });
      }
      else if ((""+drag.get('source').constructor === 'Geniverse.OrganismView')){
        var dragon = drag.get('source').get('organism');
        acceptDragon(dragon);
      } else {
        var selection = drag.get('source').get('selection').clone();
        // NB: This works, while the forEach method below only removes half of them.
        // This is because each time acceptDragon is called, the dragon gets removed from
        // the list, and the other dragons shift indices.
        for (var i = 0; i < selection.get('length'); i++){
          acceptDragon(selection.firstObject());
        }
        // selection.forEach(function (dragon){
        //  SC.Logger.log("selection.length = "+selection.get('length'));
        //  acceptDragon(dragon);
        //  });
      }

      this.invokeLast(function () {
        // this is quite specific to the eggsController. We should really be checking the source
        SC.RunLoop.begin();
        Geniverse.eggsController.set('selection', null);
        SC.RunLoop.end();
      });
      return op ;
    },
    computeDragOperations: function(drag, evt) {
      return SC.DRAG_ANY ;
    },
    dragEntered: function(drag, evt) {
      this.$().addClass('drop-target') ;
    },
    dragExited: function(drag, evt) {
      this.$().removeClass('drop-target') ;
    }
  })
});

