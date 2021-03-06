// ==========================================================================
// Project:   Geniverse - GeniverseView
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Geniverse */

Geniverse.UnlockableView = SC.PanelPane.create({
  layout: { centerX: 0, top: 15, width: 1040, height: 811 },
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
      valueBinding: SC.Binding.transform(function(value) {
        var val = (value || "").replace(/\{\{avatar\}\}/gm, Geniverse.userController.get('avatar'));
        val = val.replace(/<script[\s\S]*?<\/script>/m, '');
        var scpt = RegExp.lastMatch;
        if (scpt && scpt != "{{avatar}}") {
          setTimeout(function() { $("body").append($(scpt)); }, 500);
        }
        return "<div class='centered-content'>" + val + "</div>";
      }).from('Geniverse.unlockablesController.*selectedUnlockable.content'),
      escapeHTML: NO
    })
  })
});
