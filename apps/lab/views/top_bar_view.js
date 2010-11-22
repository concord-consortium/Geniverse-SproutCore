// ==========================================================================
// Project:   Lab - TopBarView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
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
/*globals Lab */

Lab.TopBarView = SC.ToolbarView.extend(
/** @scope Lab.TopBarView.prototype */ {
  layout: { top: 0, left: 0, right: 0, height: 36 },
  anchorLocation: SC.ANCHOR_TOP,

  // childViews
  geniverseLabelView: null,
  welcomeLabelView: null,
  logoutButton: null,

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
  welcomeIsVisiblePath: 'Lab.LOGIN.userLoggedIn',
  /**
   * Binding Path for the target property of the logoutButton
   */
  logoutButtonTargetPath: 'Lab.ACTIVITY',
  /**
   * Binding Path for the isVisible property of the logoutButton
   */
  logoutButtonIsVisiblePath: 'Lab.LOGIN.userLoggedIn',

  /**
   * Overwritten createChildView where you set up all
   * the internal child views and where we are
   * going to use the Binding Paths
   */
  createChildViews: function() {
    var childViews = [];

    this.geniverseLabelView = this.createChildView(
      SC.LabelView.design({
        layout: { centerY: 0, height: 24, left: 8, width: 400 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        //value: "Geniverse Labs"
        valueBinding: this.get('titlePath') //'Geniverse.activityController.title'
      })
    );
    childViews.push(this.geniverseLabelView);

    this.welcomeLabelView = this.createChildView(
      SC.LabelView.design({
        layout: { centerY: 0, height: 24, right: 130, width: 500},
        fontWeight: SC.BOLD_WEIGHT,
        textAlign: SC.ALIGN_RIGHT,
        valueBinding: this.get('welcomePath'),
        isVisibleBinding: this.get('welcomeIsVisiblePath')
      })
    );
    childViews.push(this.welcomeLabelView);

    this.logoutButton = this.createChildView(
      SC.ButtonView.design({
        layout: { centerY: 0, height: 24, right: 12, width: 100 },
        layerId: 'logOutButton',
        title:  "Log out",
        target: this.get('logoutButtonTargetPath'),
        action: 'logout',
        isVisibleBinding: this.get('logoutButtonIsVisiblePath')
      })
    );
    childViews.push(this.logoutButton);

    this.set('childViews', childViews);
  }
  
});
