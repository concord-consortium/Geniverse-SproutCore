// ==========================================================================
// Project:   Lab - TopBarView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/**
 * Top toolbar with labels and logout button
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Lab */

Lab.TopBarView = SC.ToolbarView.extend(
/** @scope Lab.TopBarView.prototype */ {
  layout: { top: 0, left: 0, right: 0, height: 36 },
  childViews: 'geniverseLabelView welcomeLabelView logoutButton'.w(),
  anchorLocation: SC.ANCHOR_TOP,

  geniverseLabelView: SC.LabelView.design({
    layout: { centerY: 0, height: 24, left: 8, width: 200 },
    controlSize: SC.LARGE_CONTROL_SIZE,
    fontWeight: SC.BOLD_WEIGHT,
    //valueBinding:   'Geniverse.activityController.title'
    value: "Geniverse Labs"
  }),

  welcomeLabelView: SC.LabelView.design({
    layout: { centerY: 0, height: 24, right: 130, width: 500},
    fontWeight: SC.BOLD_WEIGHT,
    textAlign: SC.ALIGN_RIGHT,
    valueBinding: 'Geniverse.loginController.welcomeMessage',
    isVisibleBinding: 'Geniverse.appController.userLoggedIn'
  }),

  logoutButton: SC.ButtonView.design({
    layout: { centerY: 0, height: 24, right: 12, width: 100 },
    layerId: 'logOutButton',
    title:  "Log out",
    target: 'Geniverse.appController',
    action: 'logout',
    isVisibleBinding: 'Geniverse.appController.userLoggedIn'
  })
});
