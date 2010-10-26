// ==========================================================================
// Project:   Geniverse.BreedView
// Copyright: ©2010 Concord Consortium, Inc.
// ==========================================================================
/*globals Geniverse, generateDragonWithSex CC alert */

/** @class

  Geniverse.BreedView
  Show statistics about dragons which have been bread.

  @extends SC.View
*/
sc_require('views/chromosome_tool');

Geniverse.BreedView = SC.View.extend(
  /** @scope Geniverse.BreedView.prototype */ {
  childViews: 'breedView breedingChromosomeToolView breedingPenView'.w(),

  // ma n' pa dragons:
  breedView: Geniverse.BreedDragonView.design({
    layout: { top: 30 , left: 0, height: 300, width: 150 },
    showChildView: NO // child as in baby dragon
  }),

  // magifying glass:
  breedingChromosomeToolView: Geniverse.ChromosomeToolView.design({
  layout: {right: 0, top: 0, width: 35, height: 30 },
    selectionBinding: 'Geniverse.eggsController.selection'
  }),
  
  // Breeding pen with eggs
  breedingPenView: SC.View.design ({
    childViews: "titleView penView".w(),
    layout: { right: 0, top: 30, width: 300, height: 300 },
    classNames: ('transparent').w(),
    titleView: SC.LabelView.design({
      layout: { centerY: 0, height: 20, left: 0, top:0, width: 300 },
      value: "Breeding Pen",
      controlSize: "bity",
      textAlign: SC.ALIGN_CENTER,
      fontWeight: SC.BOLD_WEIGHT,
      classNames: "container_label".w()
    }),

    penView: CC.AutoScrollView.design({
      hasHorizontalScroller: NO,
      layout: { left: 0, top: 20, width: 300, height: 280 },
      backgroundColor: 'white',
      contentView: SC.GridView.design({
        contentBinding: 'Geniverse.eggsController.arrangedObjects',
        selectionBinding: 'Geniverse.eggsController.selection',
        rowHeight: 60,
        columnWidth: 60,
        canEditContent: NO,
        exampleView: Geniverse.OrganismView,
        isSelectable: YES,
        dragDataTypes: ['dragon']
      }),
      autoScrollTriggerBinding: 'Geniverse.eggsController.length'
    })
  })
});
  
  
