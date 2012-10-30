// ==========================================================================
// Project:   Geniverse - GeniverseView
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Geniverse */

Geniverse.UnlockableView = SC.PanelPane.extend({
  layout: { centerX: 0, top: 75, width: 1180, height: 620 },
  isModal:YES,
  contentView: SC.View.extend({
    childViews: 'unlockableView hideButton'.w(),
    classNames: 'parchment'.w(),

    hideButton: SC.ImageView.extend(Geniverse.SimpleButton, {
      layout: { bottom: 8, right: 8, width: 118, height: 27 },
      isEnabled: YES,
      hasHover: YES,
      classNames: 'closeButton'.w(),
      alt: 'Close',
      title: "Close",
      action: "removePane",
      target: "Geniverse.unlockablesController"
    }),

    unlockableView: SC.LabelView.design({
      layout: { left: 10, top: 24, bottom: 42, right: 10 },
      valueBinding: 'Geniverse.unlockablesController.*selectedUnlockable.content',
      escapeHTML: NO
    })
  })
});
