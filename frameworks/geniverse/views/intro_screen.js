// ==========================================================================
// Project:   Geniverse - NotepadView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

Geniverse.IntroScreenView = SC.PanelPane.design({
  isModal: YES,

  defaultResponder: 'Lab.statechart',

  contentView: SC.View.extend({
    childViews: 'titleView imageView hideButton'.w(),

    titleView: SC.LabelView.design({
      layout: { height: 24, left: 0, top:0, width: 200 },
      value: 'Introduction',
      controlSize: "bity",
      fontWeight: SC.BOLD_WEIGHT,
      textAlign: SC.ALIGN_LEFT,
      classNames: "sc-pane sc-main sc-theme".w()
    }),

    hideButton: SC.ButtonView.extend({
      layout: { bottom: 5, right: 5, width: 200, height: 24 },
      title: "Continue",
      action: "closePanel"
    }),

    imageView: SC.ImageView.design({
      layout: { left: 5, top: 29, right: 5, bottom: 34 },
      valueBinding: "Geniverse.introScreenController.imageUrl"
    })

  })
});
