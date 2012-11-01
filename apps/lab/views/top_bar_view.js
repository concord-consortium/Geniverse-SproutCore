// ==========================================================================
// Project:   Lab - TopBarView
// Copyright: 2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse */

/**
 * Top toolbar with labels and logout button.
 * This is a composite view component.
 * Some code cribbed from http://www.itsgotwhatplantscrave.com/2009/07/29/composite-views/
 * We've broken Rule #3 by setting defaults for DRYness sake. Be sure to set the xPaths to something
 * else if the defaults do not fit your needs. You might also want to use a class in /resources that
 * extends this view.
 * Rule #3: View Bindings must only be set up in the instances in /resources
 * http://www.itsgotwhatplantscrave.com/2009/06/20/bindings-unleashed/
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
sc_require('mixins/simple_button');
sc_require('views/link');

Lab.TopBarView = SC.ToolbarView.extend(
/** @scope Lab.TopBarView.prototype */ {

  layout: { top: 0, left: 0, right: 0, height: 57 },
  layerId: 'topBar',
  classNames: ['brown-toolbar-view'],
  anchorLocation: SC.ANCHOR_TOP,

  childViews: 'homeButton caselogButton introButton infoButton geniverseLabelView welcomeLabelView groupLabelView logoutButton blogButton notepadButton journalButton helpButton unlockablesButton'.w(),

  homeButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, left: 7, width: 66, height: 57 },
    layerId: 'homeButton',
    hasHover: YES,
    alt: 'Home',
    toolTip: "Click to go to the Lab's Home page",
    target: 'Lab.routes',
    action: 'openHomePageRoute'
  }),

  caselogButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, left: 66, width: 64, height: 57 },
    layerId: 'caselogButton',
    hasHover: YES,
    alt: 'Case Log',
    toolTip: "Click to go to the Lab's Case Log page",
    target: 'Lab.routes',
    action: 'openCaselogRoute'
  }),

  introButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, left: 133, width: 57, height: 57 },
    layerId: 'introButton',
    hasHover: YES,
    alt: 'Introduction',
    toolTip: "Click to see introduction",
    target: 'Lab.routes',
    action: 'openAvatarPageRoute'
  }),

  geniverseLabelView: SC.LabelView.design({
    layout: { centerY: 9, height: 24, left: 195, width: 400 },
    controlSize: SC.LARGE_CONTROL_SIZE,
    valueBinding: 'Geniverse.activityController.title'
  }),

  welcomeLabelView: SC.LabelView.design({
    layout: { top: 30,  height: 24, right: 550, width: 345},
    textAlign: SC.ALIGN_LEFT,
    valueBinding: 'Lab.loginController.welcomeMessage',
    // useStaticLayout: YES,
    isVisibleBinding: 'Lab.loginController.loggedIn'
  }),

  groupLabelView: SC.LabelView.design({
    layout: { top: 30,  height: 24, right: 550, width: 345},
    textAlign: SC.ALIGN_RIGHT,
    valueBinding: 'Lab.loginController.memberGroupMessage',
    isVisibleBinding: 'Lab.loginController.loggedIn'
  }),

  changeGroupButton: Lab.LinkView.design({
    layout: { top: 30,  height: 24, right: 500, width: 40 },
    layerId: 'changeGroup',
    title:  "edit",
    target: 'Lab.loginController',
    action: 'showGroupPanel',
    isVisibleBinding: 'Lab.loginController.loggedIn',
    toolTip: 'Change your Member number or Group number.',
    tagName: 'a'
  }),

  unlockablesButton: SC.PopupButtonView.design({
    layout: { centerY: 10, right: 341, width: 45, height: 57 },
    menu: SC.MenuPane.design({
      layout: {width: 250 },
      rawItemsBinding: 'Geniverse.unlockablesController.*unlocked.length',
      rawItemsChanged: function() {
        var rawItems = Geniverse.unlockablesController.get('unlocked');
        if (rawItems.get('length') === 0) {
          rawItems = [{title: "Nothing unlocked yet", isEnabled: NO}];
        }
        this.set('items', rawItems);
        this.propertyDidChange('items');
      }.observes('rawItems'),
      itemTitleKey: 'title',
      itemValueKey: 'guid',
      itemIconKey: 'icon',
      selectedItemBinding: 'Geniverse.unlockablesController.selectedUnlockable'
    }),
    layerId: 'unlockablesButton',
    classNames: ['none'],
    // hasHover: YES,
    alt: 'Unlockables',
    toolTip: "Click to see items you've unlocked",
    notViewedUnlockablesBinding: 'Geniverse.unlockablesController.*notViewed.length',
    notViewed: function() {
      var style = 'none';
      if ((this.get('notViewedUnlockables') || 0) > 0) {
        style = 'some';
      }

      this.set('classNames', ['sc-view', 'sc-image-view', 'sc-regular-size', style]);
      this.set('layerNeedsUpdate', YES);
    }.observes('notViewedUnlockables')
  }),

  infoButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, right: 285, width: 56, height: 57 },
    layerId: 'infoButton',
    hasHover: YES,
    alt: 'Info',
    toolTip: "Click to see instructions",
    target: 'Lab.infoController',
    action: 'showPane',
    init: function() {
      sc_super();
      Lab.infoController.set('infoButton', this); // So pop-up pointer works
    }
  }),

  blogButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, right: 230, width: 55, height: 57 },
    layerId: 'blogButton',
    hasHover: YES,
    alt: 'Post claim to the Journal',
    title:  "Post claim to the Journal",
    toolTip: "Post claim to the Journal",
    target: Lab.statechart,
    action: 'showBlogPostPanel'
  }),


  journalButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, right: 179, width: 51, height: 57 },
    hasHover: YES,
    alt: 'Your journal',
    layerId: 'journalButton',
    title:  "Journal",
    toolTip: "Click to open the class journal",
    target: 'Lab.journalController',
    action: 'openWindow'
  }),

  notepadButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, right: 129, width: 50, height: 57 },
    hasHover: YES,
    alt: 'Your notebook',
    layerId: 'notepadButton',
    title:  "Note Pad",
    toolTip: "Click to open your notepad",
    target: 'Geniverse.notepadController',
    isEnabledBinding: 'Geniverse.notepadController.isEnabledButton',
    action: 'showPane'
  }),

  helpButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, right: 73, width: 56, height: 57 },
    layerId: 'helpButton',
    hasHover: YES,
    alt: 'Help',
    toolTip: "View the Help window for this page",
    target: 'Lab.helpController',
    action: 'showPane',
    isVisibleBinding: 'Lab.helpController.isVisible',
    init: function() {
      sc_super();
      Lab.helpController.set('helpButton', this); // So pop-up pointer works
    }
  }),

  logoutButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, right: 6, width: 67, height: 57 },
    layerId: 'logOutButton',
    hasHover: YES,
    alt: 'Log out',
    title:  "Log out",
    toolTip: "Click to log out",
    target: Lab.statechart,
    action: 'logOut'
  })
});
