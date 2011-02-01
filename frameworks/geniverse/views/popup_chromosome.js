// ==========================================================================
// Project:   Geniverse - PopupChromosomeView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

Geniverse.PopupChromosomeView = SC.PalettePane.extend({
  layout: { width: 488, height: 430, centerX: 0, centerY: 0 },
  isModal:NO,
  classNames: ['popup-chromosome-view'],
  contentView: SC.View.design({
    childViews: 'titleView chromosomeView hideButton'.w(),

    titleView: SC.LabelView.design({
      layout: { centerY: 0, height: 24, left: 0, top:0, width: 488 },
      //valueBinding: this.get('titlePath'),
      value: 'Dragon Chromosomes  -  drag here to move',
      controlSize: "bity",
      fontWeight: SC.BOLD_WEIGHT,
      textAlign: SC.ALIGN_CENTER,
      classNames: "sc-pane sc-main sc-theme".w()
    }),

    hideButton: SC.ButtonView.design({
      layout: {bottom: 5, right: 5, width: 80, height: 24},
      title: "Close",
      action: "closePane",
      target: "Geniverse.chromosomeToolController"
    }),

    chromosomeView: Geniverse.DragonGenomeView.design({
      layout: { left: 10, top: 24, width: 468, height: 400 },
      isEditable: NO,
      showGenerateNewDragon: NO,
      ignoreUpdate: NO,
      resetDragonOnInit: YES,
      dragon: null,
      init: function() {
        sc_super();
        // we have to bind in the init function (rather than using
        // dragonBinding: attribute) because we create many of these
        // over time, and for whatever reason, the binding ceases to
        // work on the later created instances.
        this.bind('dragon', SC.Binding.from("Geniverse.chromosomeToolController.dragon").oneWay());
      }
    })
  })
});
