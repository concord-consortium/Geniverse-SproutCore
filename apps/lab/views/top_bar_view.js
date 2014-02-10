// ==========================================================================
// Project:   Lab - TopBarView
// Copyright: 2010 Concord Consortium
// ==========================================================================
/*global Lab Geniverse SC YES NO sc_super*/

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

Lab.TopBarView = SC.ToolbarView.extend(
/** @scope Lab.TopBarView.prototype */ {

  layout: { top: 0, left: 0, right: 0, height: 57 },
  layerId: 'topBar',
  classNames: ['brown-toolbar-view'],
  anchorLocation: SC.ANCHOR_TOP,

  // the order the children are defined here determines the order they show up in the top bar!
  childViews: 'homeButton caselogButton introButton geniverseLabelView welcomeLabelView groupLabelView infoButton notepadButton unlockablesButton'.w(),

  homeButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, left: 0, width: 66, height: 57 },
    useStaticLayout: YES,
    layerId: 'homeButton',
    hasHover: YES,
    toolTip: "Home",
    target: 'Lab.routes',
    action: 'openHomePageRoute',
    classNames: 'topbar-hint-available hint-target-bottomMiddle hint-tooltip-topMiddle hint-max-width-75'.w()
  }),

  caselogButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, left: 0, width: 64, height: 57 },
    useStaticLayout: YES,
    layerId: 'caselogButton',
    hasHover: YES,
    toolTip: "Case Log",
    target: 'Lab.routes',
    action: 'openCaselogRoute',
    classNames: 'topbar-hint-available hint-target-bottomMiddle hint-tooltip-topMiddle hint-max-width-90'.w()
  }),

  introButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, left: 0, width: 57, height: 57 },
    useStaticLayout: YES,
    layerId: 'introButton',
    hasHover: YES,
    toolTip: "Narrative introduction",
    target: 'Lab.routes',
    action: 'openAvatarPageRoute',
    classNames: 'topbar-hint-available hint-target-bottomMiddle hint-tooltip-topMiddle hint-max-width-175'.w()
  }),

  geniverseLabelView: SC.View.design({
    layout: { top: 0, height: 57, width: 220 },
    useStaticLayout: YES,
    classNames: ['pageTitle'],
    childViews: 'caseTitle activityTitle'.w(),
    caseTitle: SC.LabelView.design({
      layout: {top: 0 },
      layerId: 'caseLabel',
      valueBinding: 'Geniverse.activityController.caseTitle'
    }),
    activityTitle: SC.LabelView.design({
      layout: {top: 30 },
      layerId: 'activityLabel',
      valueBinding: 'Geniverse.activityController.actTitle'
    })
  }),

  welcomeLabelView: SC.LabelView.design({
    layout: { top: -12,  height: 24 },
    classNames: ['welcomeLabel'],
    useStaticLayout: YES,
    valueBinding: 'Lab.loginController.welcomeMessage',
    isVisibleBinding: 'Lab.loginController.loggedIn'
  }),

  groupLabelView: SC.LabelView.design({
    layout: { top: -15,  height: 24 },
    classNames: ['groupLabel'],
    useStaticLayout: YES,
    valueBinding: 'Lab.loginController.memberGroupMessage',
    isVisibleBinding: 'Lab.loginController.loggedIn'
  }),

  changeGroupButton: SC.LabelView.design({
    layout: {top: -15, height: 24 },
    useStaticLayout: YES,
    layerId: 'changeGroupLabel',
    value: 'edit',
    click: function() {
      Lab.loginController.showGroupPanel();
    },
    isVisibleBinding: 'Lab.loginController.loggedIn',
    toolTip: 'Change your Member number or Group number.',
    classNames: 'topbar-hint-available hint-target-bottomMiddle hint-tooltip-topMiddle'.w()
  }),

  unlockablesButton: SC.PopupButtonView.design({
    layout: { top: 0, left: 0, width: 45, height: 57 },
    useStaticLayout: YES,
    menu: SC.MenuPane.design({
      layout: {width: 350 },
      preferType: SC.PICKER_POINTER,
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
      itemHeight: 20,
      selectedItemBinding: 'Geniverse.unlockablesController.selectedUnlockable'
    }),
    layerId: 'unlockablesButton',
    // hasHover: YES,
    alt: 'Unlockables',
    toolTip: "Access your unlocked items",
    notViewedUnlockablesBinding: 'Geniverse.unlockablesController.*notViewed.length',
    notViewed: function() {
      var style = 'none';
      if ((this.get('notViewedUnlockables') || 0) > 0) {
        style = 'some';
      }

      this.set('classNames', ['sc-view', 'sc-image-view', 'sc-regular-size', style]);
      this.set('layerNeedsUpdate', YES);
    }.observes('notViewedUnlockables'),
    classNames: 'topbar-hint-available hint-target-bottomMiddle hint-tooltip-topMiddle hint-max-width-200'.w()
  }),

  infoButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, left: 0, width: 56, height: 57 },
    useStaticLayout: YES,
    layerId: 'infoButton',
    hasHover: YES,
    toolTip: "Instructions",
    target: 'Lab.infoController',
    action: 'showPane',
    init: function() {
      sc_super();
      if (Geniverse.activityController.get('pageType') === "chromosomeBreedingPage") {
        this.set("toolTip", "When in doubt, read the Instructions.");
        this.$().addClass('hint-available');
      }
      Lab.infoController.set('infoButton', this); // So pop-up pointer works
    },
    classNames: 'topbar-hint-available hint-target-bottomMiddle hint-tooltip-topMiddle hint-max-width-110'.w()
  }),

  blogButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, left: 0, width: 55, height: 57 },
    useStaticLayout: YES,
    layerId: 'blogButton',
    hasHover: YES,
    title:  "Post claim to the Journal",
    toolTip: "Post your claim to the class journal",
    target: 'Lab.statechart',
    action: 'showBlogPostPanel',
    classNames: 'topbar-hint-available hint-target-bottomMiddle hint-tooltip-topMiddle hint-max-width-240'.w()
  }),


  journalButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, left: 0, width: 51, height: 57 },
    useStaticLayout: YES,
    hasHover: YES,
    layerId: 'journalButton',
    title:  "Journal",
    toolTip: "Open class journal",
    target: 'Lab.journalController',
    action: 'openWindow',
    classNames: 'topbar-hint-available hint-target-bottomMiddle hint-tooltip-topMiddle hint-max-width-160'.w()
  }),

  notepadButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, left: 0, width: 50, height: 57 },
    useStaticLayout: YES,
    hasHover: YES,
    alt: 'Your notebook',
    layerId: 'notepadButton',
    toolTip: "Your notepad",
    target: 'Geniverse.notepadController',
    isEnabledBinding: 'Geniverse.notepadController.isEnabledButton',
    action: 'showPane',
    classNames: 'topbar-hint-available hint-target-bottomMiddle hint-tooltip-topMiddle hint-max-width-120'.w()
  }),

  helpButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, left: 0, width: 56, height: 57 },
    useStaticLayout: YES,
    layerId: 'helpButton',
    hasHover: YES,
    alt: 'Help',
    target: 'Lab.helpController',
    action: 'showPane',
    isVisibleBinding: 'Lab.helpController.isVisible',
    init: function() {
      sc_super();
      Lab.helpController.set('helpButton', this); // So pop-up pointer works
    },
    toolTip: "Click here for help on any page.",
    classNames: 'topbar-hint-available topbar-hint-available-show hint-target-bottomMiddle hint-tooltip-topMiddle hint-max-width-220'.w()
  }),

  logoutButton: SC.ImageView.design(Geniverse.SimpleButton, {
    layout: { top: 0, left: 0, width: 67, height: 57 },
    useStaticLayout: YES,
    layerId: 'logOutButton',
    hasHover: YES,
    title:  "Log out",
    toolTip: "Log out",
    target: 'Lab.statechart',
    action: 'logOut',
    classNames: 'topbar-hint-available hint-target-bottomMiddle hint-tooltip-topMiddle hint-max-width-85'.w()
  })
});
