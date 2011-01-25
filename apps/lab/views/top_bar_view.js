// ==========================================================================
// Project:   Lab - TopBarView
// Copyright: 2010 Concord Consortium
// ==========================================================================
/*globals Lab */

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
  layout: { top: 0, left: 0, right: 0, height: 36 },
  layerId: 'topBar',
  classNames: ['brown-toolbar-view'],
  anchorLocation: SC.ANCHOR_TOP,

  // childViews
  navBarLeft: null,
  homeButton: null,
  caseLogButton: null,
  infoButton: null,
  geniverseLabelView: null,
  welcomeLabelView: null,
  navBarRight: null,
  logoutButton: null,
  notepadButton: null,
  helpButton: null,

  /**
   * Necessary configuration xPath elements to set up binding inside the composite view instances
   */
  //contentPath: '', // Binding Path for the content of the xSubView
  /**
   * Binding Path for the value of the geniverseLabelView
   */
  titlePath: 'Geniverse.activityController.title',
  /**
   * Binding Path for the value of the welcomeLabelView
   */
  welcomePath: 'Lab.loginController.welcomeMessage',
  /**
   * Binding Path for the isVisible property of the welcomeLabelView
   */
  welcomeIsVisiblePath: 'Lab.loginController.loggedIn',
  /**
   * Binding Path for the target property of the logoutButton
   */
  logoutButtonTargetPath: 'Lab.loginController',
  /**
   * Binding Path for the isVisible property of the logoutButton
   */
  logoutButtonIsVisiblePath: 'Lab.loginController.loggedIn',
  
  /**
   * Binding Path for the target property of the changeGroupButton
   */
  changeGroupButtonTargetPath: 'Lab.loginController',
  /**
   * Binding Path for the isVisible property of the changeGroupButton
   */
  changeGroupButtonIsVisiblePath: 'Lab.loginController.loggedIn',

  /**
   * Binding Path for the target property of the notepadButton
   */
  notepadButtonTargetPath: 'Geniverse.notepadController',
  /**
   * Binding Path for the isVisible property of the notepadButton
   */
  notepadButtonIsVisiblePath: 'Lab.LOGIN.userLoggedIn',
  /**
   * Binding Path for the isEnabledButton property of the notepadController
   */
  notepadControllerIsEnabledButtonPath: 'Geniverse.notepadController.isEnabledButton',

  /**
   * Overwritten createChildView where you set up all
   * the internal child views and where we are
   * going to use the Binding Paths
   */
  createChildViews: function() {
    var childViews = [];

    this.navBarLeft = this.createChildView(
      SC.ImageView.design({
        layout: { centerY: 0, left: 0, width: 75, height: 38 },
        layerId: 'navBarLeft',
        value: static_url('navbar-left.png')
      })
    );
    childViews.push(this.navBarLeft);

    this.homeButton = this.createChildView(
      SC.ImageView.design(Lab.SimpleButton, {
        layout: { centerY: 0, left: 7, width: 27, height: 26 },
        layerId: 'homeButton',
        hasHover: YES,
        alt: 'Home',
        toolTip: "Click to go to the Lab's Home page",
        target: 'Lab.routes',
        action: 'gotoHomePage'
      })
    );
    childViews.push(this.homeButton);

    this.caseLogButton = this.createChildView(
      SC.ImageView.design(Lab.SimpleButton, {
        layout: { centerY: 0, left: 41, width: 27, height: 26 },
        layerId: 'caseLogButton',
        hasHover: YES,
        alt: 'Case Log',
        toolTip: "Click to go to the Lab's Case Log page",
        target: 'Lab.routes',
        action: 'gotoCaseLogPage'
      })
    );
    childViews.push(this.caseLogButton);

    this.geniverseLabelView = this.createChildView(
      SC.LabelView.design({
        layout: { centerY: 0, height: 24, left: 77, width: 400 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        //value: "Geniverse Labs"
        valueBinding: this.get('titlePath') //'Geniverse.activityController.title'
      })
    );
    childViews.push(this.geniverseLabelView);

    this.welcomeLabelView = this.createChildView(
      SC.LabelView.design({
        layout: { top: 5,  height: 24, right: 340, width: 345},
        textAlign: SC.ALIGN_RIGHT,
        valueBinding: this.get('welcomePath'),
        isVisibleBinding: this.get('welcomeIsVisiblePath')
      })
    );
    childViews.push(this.welcomeLabelView);

    this.changeGroupButton = this.createChildView(
      Lab.LinkView.design({
        layout: { centerY: 0,  height: 24, right: 300, width: 40 },
        layerId: 'changeGroup',
        title:  "Change",
        target: this.get('changeGroupButtonTargetPath'),
        action: 'showGroupPanel',
        isVisibleBinding: this.get('changeGroupButtonIsVisiblePath'),
        toolTip: 'Change your Member number or Group number.',
        tagName: 'a'
      })
    );
    childViews.push(this.changeGroupButton);

    this.navBarRight = this.createChildView(
      SC.ImageView.design({
        layout: { centerY: 0, right: 0, width: 174, height: 38 },
        layerId: 'navBarRight',
        value: static_url('navbar-right.png')
      })
    );
    childViews.push(this.navBarRight);

    // this.infoButton = this.createChildView(
    //   Lab.InfoButtonView.design()
    // );
    this.infoButton = this.createChildView(
      SC.ImageView.design(Lab.SimpleButton, {
        layout: { centerY: 0, right: 141, width: 27, height: 26 },
        layerId: 'infoButton',
        hasHover: YES,
        alt: 'Info',
        toolTip: "Click to see instructions",
        target: 'Lab.infoController',
        action: 'showPane'
      })
    );
    Lab.infoController.set('infoButton', this.infoButton); // So pop-up pointer works
    childViews.push(this.infoButton);

    this.helpButton = this.createChildView(
      SC.ImageView.design(Lab.SimpleButton, {
        layout: { centerY: 0, right: 107, width: 27, height: 26 },
        layerId: 'helpButton',
        hasHover: YES,
        alt: 'Help',
        toolTip: "View the Help window for this page",
        target: 'Lab.helpController',
        action: 'showPane',
        isVisibleBinding: 'Lab.helpController.isVisible'
      })
    );
    Lab.helpController.set('helpButton', this.helpButton); // So pop-up pointer works
    childViews.push(this.helpButton);

    this.notepadButton = this.createChildView(
      SC.ImageView.design(Lab.SimpleButton, {
        layout: { centerY: 0, right: 73, width: 27, height: 26 },
        hasHover: YES,
        alt: 'Your notebook',
        layerId: 'notepadButton',
        title:  "Note Pad",
        target: this.get('notepadButtonTargetPath'),
        action: 'showPane'
      })
    );
    childViews.push(this.notepadButton);

    this.logoutButton = this.createChildView(
      SC.ImageView.design(Lab.SimpleButton, {
        layout: { centerY: 0, right: 6, width: 27, height: 26 },
        layerId: 'logOutButton',
        title:  "Log out",
        target: this.get('logoutButtonTargetPath'),
        action: 'logoutPortal'
      })
    );
    childViews.push(this.logoutButton);

    this.set('childViews', childViews);
  }
  
});
