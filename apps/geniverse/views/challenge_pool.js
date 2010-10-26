// ==========================================================================
// Project:   Geniverse.ChallengePoolView
// Copyright: ©2010 Concord Consortium, Inc.
// ==========================================================================
/*globals Geniverse, generateDragonWithSex CC alert */

/** @class

  Geniverse.ChallengePoolView
  Show statistics about dragons which have been bread.

  @extends SC.View
*/

sc_require('views/chromosome_tool');


Geniverse.ChallengePoolView = SC.View.extend(
  /** @scope Geniverse.ChallengePoolView.prototype */ {
  childViews: "challengeChromosomeToolView titleView dragonsView ".w(),
  challengeChromosomeToolView: Geniverse.ChromosomeToolView.design({
    layout: { right: 0, top: 0, width: 35, height: 30 },
    selectionBinding: 'Geniverse.challengePoolController.selection'
  }),
  titleView: SC.LabelView.design({
    layout: { centerY: 0, height: 20, left: 0, top:30, width: 70 },
    value: "Parent Pool",
    controlSize: "bity",
    fontWeight: SC.BOLD_WEIGHT,
    textAlign: SC.ALIGN_CENTER,
    classNames: "container_label".w()
  }),
  dragonsView: CC.AutoScrollView.design({
    layout: { left: 0, top: 55, width: 70, height: 280},
    hasHorizontalScroller: NO,
    backgroundColor: 'white',
    contentView: SC.GridView.design({
      contentBinding: 'Geniverse.challengePoolController.arrangedObjects',
      selectionBinding: 'Geniverse.challengePoolController.selection',
      rowHeight: 70,
      columnWidth: 70,
      canEditContent: NO,
      exampleView: Geniverse.OrganismView,
      isSelectable: YES,
      dragDataTypes: ['dragon']
    }),
    autoScrollTriggerBinding: 'Geniverse.challengePoolController.length'
  })
});
  
