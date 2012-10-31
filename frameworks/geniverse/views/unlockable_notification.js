// ==========================================================================
// Project:   Geniverse - GeniverseView
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Geniverse */

Geniverse.UnlockableNotificationView = SC.PanelPane.extend({
  layout: { right: 30, top: 50, width: 200, height: 60 },
  isModal: NO,
  message: "",
  contentView: SC.View.design({
    classNames: 'notification'.w(),
    childViews: 'title message closeButton'.w(),
    messageBinding: '*parentView.message',
    title: SC.LabelView.design({
      layout: { top: 5, left: 5, width: 190, height: 24 },
      classNames: ['notification-title'],
      fontWeight: SC.BOLD_WEIGHT,
      value: "You've unlocked:"
    }),
    closeButton: SC.ImageView.design({
      layout: { right: -8, top: -8, width: 24, height: 24 },
      value: 'sc-icon-cancel-24',
      click: function() {
        Geniverse.unlockablesController.removeCurrentNotification();
      }
    }),
    message: SC.LabelView.design({
      layout: { bottom: 5, left: 5, width: 190, height: 24 },
      classNames: ['notification-message'],
      valueBinding: '*parentView.message'
    })
  })
});
