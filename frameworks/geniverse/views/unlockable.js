// ==========================================================================
// Project:   Geniverse - GeniverseView
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Geniverse */

Geniverse.UnlockableView = SC.PanelPane.create({
  layout: { centerX: 0, top: 75, width: 1180, height: 620 },
  isModal:YES,
  contentView: SC.View.extend({
    childViews: 'unlockableView hideButton'.w(),
    classNames: 'parchment'.w(),

    hideButton: SC.ImageView.design(Geniverse.SimpleButton, {
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
      layout: {left: 5, right: 5, top: 5, bottom: 40 },
      valueBinding: SC.Binding.transform(function(value) { return "<div class='centered-content'>" + value + "</div>"; }).from('Geniverse.unlockablesController.*selectedUnlockable.content'),
      escapeHTML: NO
    })
  })
});
