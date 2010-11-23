// ==========================================================================
// Project:   Geniverse - PopupChromosomeView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

Geniverse.PopupChromosomeView = SC.PalettePane.create({
  layout: { width: 440, height: 430, centerX: 0, centerY: 0 },
  isModal:NO,
  contentView: SC.View.extend({
    childViews: 'titleView chromosomeView hideButton'.w(),

    titleView: SC.LabelView.design({
      layout: { centerY: 0, height: 24, left: 0, top:0, width: 440 },
      //valueBinding: this.get('titlePath'),
      value: 'Dragon Chromosomes  -  drag here to move',
      controlSize: "bity",
      fontWeight: SC.BOLD_WEIGHT,
      textAlign: SC.ALIGN_CENTER,
      classNames: "sc-pane sc-main sc-theme".w()
    }),

    hideButton: SC.ButtonView.extend({
      layout: {bottom: 5, right: 5, width: 80, height: 24},
      title: "Close",
      action: "remove",
      target: "Geniverse.chromosomeToolController.pane"
    }),

    chromosomeView: Geniverse.DragonGenomeView.design({
      layout: { left: 10, top: 24, width: 420, height: 400 },
      isEditable: NO,
      showGenerateNewDragon: NO,
      ignoreUpdate: NO,
      dragonBinding: SC.Binding.from("Geniverse.chromosomeToolController.dragon").oneWay()
    })
  })
});