// ==========================================================================
// Project:   Geniverse - GeniverseView
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Geniverse */

Geniverse.UnlockableNotificationView = SC.PanelPane.extend({
  // TODO Popup, when clicked, shows that unlocked item
  layout: { right: 30, top: 35, width: 200, height: 60 },
  isModal: NO,
  message: "",
  contentView: SC.View.design({
    classNames: 'notification'.w(),
    childViews: 'title message'.w(),
    messageBinding: '*parentView.message',
    title: SC.LabelView.design({
      layout: { top: 5, left: 5, width: 190, height: 24 },
      value: "You've unlocked:"
    }),
    message: SC.LabelView.design({
      layout: { bottom: 5, left: 5, width: 190, height: 24 },
      valueBinding: '*parentView.message'
    })
  })
});
