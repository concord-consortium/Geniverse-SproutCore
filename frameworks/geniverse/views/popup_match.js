// ==========================================================================
// Project:   Geniverse - PopupMatchView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

Geniverse.PopupMatchView = SC.PalettePane.create({
  layout: { width: 488, height: 194, centerX: 0, centerY: 0 },
  isModal:NO,
  contentView: SC.View.extend({
    childViews: 'titleView matchView hideButton'.w(),

    titleView: SC.LabelView.design({
      layout: { centerY: 0, height: 24, left: 0, top:0, right: 0 },
      //valueBinding: this.get('titlePath'),
      value: 'Dragons to Match  -  drag here to move',
      controlSize: "bity",
      fontWeight: SC.BOLD_WEIGHT,
      textAlign: SC.ALIGN_CENTER,
      classNames: "sc-pane sc-main sc-theme".w()
    }),

    hideButton: SC.ButtonView.extend({
      layout: {bottom: 5, right: 5, width: 80, height: 24},
      title: "Close",
      action: "remove",
      target: "Geniverse.matchController.pane"
    }),

    matchView: Geniverse.MatchView.design({
      layout: { left: 0, top: 24, right: 0, height: 130 }
    })
  })
});