// ==========================================================================
// Project:   Geniverse - PopupAnimationView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */
sc_require('views/animation');

/** @class

  // TODO: (Document Your View Here)
  @author  Dr. Baba Kofi Weusijana <kofi@edutek.net>
  @extends SC.PalettePane
*/
Geniverse.PopupAnimationView = SC.PalettePane.design({
  layout: { width: 440, height: 430, centerX: 0, centerY: 0 },
  isModal:NO,
  contentView: SC.View.extend({
    childViews: 'titleView meiosisView hideButton'.w(),

    titleView: SC.LabelView.design({
      layout: { centerY: 0, height: 24, left: 0, top:0, width: 440 },
      //valueBinding: this.get('titlePath'),
      value: 'Dragon Animations  -  drag here to move',
      controlSize: "bity",
      fontWeight: SC.BOLD_WEIGHT,
      textAlign: SC.ALIGN_CENTER,
      classNames: "sc-pane sc-main sc-theme".w()
    }),

    hideButton: SC.ButtonView.extend({
      layout: {bottom: 5, right: 5, width: 80, height: 24},
      title: "Close",
      action: "close",
      target: "Geniverse.meiosisAnimationController"
    }),

    meiosisView: Geniverse.AnimationView.design({
      layout: { left: 10, top: 24, width: 420, height: 400 },
//      mode: 'offspring',
//      meiosisOwner: 'offspring',
//      jsondataurl: static_url('chromosomes.json')
      jsondataurl: null
    })
  })
});