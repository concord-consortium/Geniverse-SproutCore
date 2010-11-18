// ==========================================================================
// Project:   Lab - TopBarView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/**
 * Top toolbar with labels and logout button.
 * This is a composite view component.
 * Some code cribbed from http://www.itsgotwhatplantscrave.com/2009/07/29/composite-views/
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
   * These xPaths must NOT be set to a binding in views like this (set them to ''):
   * Rule #3: View Bindings must only be set up in the ‘.lproj’ layer
   * Fight the urge to set up bindings for the view layer anywhere but in the ‘.lproj’ layer.
   * You should never be directly setting bindings in a view class even if you know what something is supposed to be.
   * This is a maintenance nightmare and will cause lots of problems if you ever have to change something.
   * It also violates some of the basic OO design structure. If you need a bind set up further down,
   * use the ‘-Path’ naming convention.
   * http://www.itsgotwhatplantscrave.com/2009/06/20/bindings-unleashed/
   */
  //contentPath: '', // Binding Path for the content of the xSubView
  /**
   * Binding Path for the value of the geniverseLabelView
   */
  titlePath: '',
  /**
   * Binding Path for the value of the welcomeLabelView
   */
  welcomePath: '',
  /**
   * Binding Path for the isVisible property of the welcomeLabelView
   */
  welcomeIsVisiblePath: '',
  /**
   * Binding Path for the target property of the logoutButton
   */
  logoutButtonTargetPath: '',
  /**
   * Binding Path for the isVisible property of the logoutButton
   */
  logoutButtonIsVisiblePath: '',

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
