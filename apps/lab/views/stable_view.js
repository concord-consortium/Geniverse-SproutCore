// ==========================================================================
// Project:   Lab - StableView
// Copyright: 2010 Concord Consortium
// ==========================================================================
/*globals Lab */
/**
 * Stable View with title and stable sub-views.
 * This is a composite view component.
 * Some code cribbed from http://www.itsgotwhatplantscrave.com/2009/07/29/composite-views/
 * We've broken Rule #3 by setting defaults for DRYness sake. Be sure to set the xPaths to something
 * else if the defaults do not fit your needs. You might also want to use a class in /resources that
 * extends this view.
 * Rule #3: View Bindings must only be set up in the instances in /resources
 * http://www.itsgotwhatplantscrave.com/2009/06/20/bindings-unleashed/
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */

Lab.StableView = SC.View.extend(
/** @scope Lab.StableView.prototype */ {
  layout: { left: 680, top: 70, height: 300, width: 240 },

  // childViews
  title: null,
  stable: null,

  /**
   * Necessary configuration xPath elements to set up binding inside the composite view instances
   */
  //contentPath: '', // Binding Path for the content of the xSubView
  /**
   * Binding Path for the value of the title
   */
  //titlePath: '',
  /**
   * Binding Path for the stableOrganismsController of the StableView
   */
  stableOrganismsControllerPath: 'Geniverse.stableOrganismsController',

  /**
   * Overwritten createChildView where you set up all
   * the internal child views and where we are
   * going to use the Binding Paths
   */
  createChildViews: function() {
    var childViews = [];

    this.title = this.createChildView(
      SC.LabelView.design({
        classNames: 'container_label'.w(),
        layout: { centerX: 0, top:0, height: 20, width: 240 },
        controlSize: "bity",
        textAlign: SC.ALIGN_CENTER,
        fontWeight: SC.BOLD_WEIGHT,
        // TODO: set these stableOrganismsController-based properties
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
      })
    );
    childViews.push(this.title);

    this.stable = this.createChildView(
      CC.AutoScrollView.design({
        hasHorizontalScroller: NO,
        layout: { left: 0, bottom: 0, height: 280, width: 240 },
        backgroundColor: 'white',
        classNames: 'transparent'.w(),
        contentView: SC.GridView.design({
          contentBinding: this.get('stableOrganismsControllerPath')+'.arrangedObjects',
          selectionBinding: this.get('stableOrganismsControllerPath')+'.selection',
          rowHeight: 60,
          columnWidth: 60,
          canEditContent: NO,
          exampleView: Geniverse.OrganismView,
          isSelectable: YES,
          dragDataTypes: ['dragon']
        }),

        autoScrollTriggerBinding: this.get('stableOrganismsControllerPath')+'.length',

        isDropTarget: YES,

        dragonNum: 0,
        acceptDragOperation: function(drag, op) {
          var self = this;
          //
          // can we accept this dragon?
          function acceptDragon(dragon){
            if (!dragon){
              return;
            }
            var dragonNum = self.get('dragonNum');

            // check if there are existing dragons
            // TODO: set these stableOrganismsController-based properties
            var allStableDragons = Geniverse.stableOrganismsController.get('arrangedObjects');
            var count = Geniverse.stableOrganismsController.get('length');
            if (count >= 50){
              alert("Your stable is full");
              return;
            }
            if (count > 0){
              var lastDragon = allStableDragons.objectAt(length-1);
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
              Geniverse.eggsController.removeObject(dragon);
            SC.RunLoop.end();

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
    );
    childViews.push(this.stable);

    this.set('childViews', childViews);
  }
  
});
