// ==========================================================================
// Project:   Lab - BottomBarView
// Copyright: 2010 Concord Consortium
// ==========================================================================
/*globals Lab SC YES NO*/

sc_require('mixins/simple_button');

Lab.BottomBarView = SC.ToolbarView.extend(
/** @scope Lab.TopBarView.prototype */ {
  
  layout: { bottom: 0, left: 0, right: 0, height: 36 },
  layerId: 'bottomBar',
  classNames: ['brown-toolbar-view'],
  anchorLocation: SC.ANCHOR_BOTTOM,

  // childViews
  geniverseLabelView: null,

  /**
   * Overwritten createChildView where you set up all
   * the internal child views and where we are
   * going to use the Binding Paths
   */
  createChildViews: function() {
    var childViews = [];
    
    this.navBarLeftArrow = this.createChildView(
      SC.ImageView.design(Lab.SimpleButton, {
        layout: { centerY: 0, centerX: -40, width:38, height: 38 },
        layerId: 'navBarLeftArrow',
        value: 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/GreenButton_LeftArrow.svg/200px-GreenButton_RightArrow.svg.png',
        alt: 'Back',
        toolTip: "Click to go to back to the previous activity",
        target: 'Lab.statechart',
        action: 'gotoPreviousActivity',
        isVisibleBinding: 'Lab.navigationController.showPreviousButton'
      })
    );
    childViews.push(this.navBarLeftArrow);

    this.navBarRightArrow = this.createChildView(
      SC.ImageView.design(Lab.SimpleButton, {
        layout: { centerY: 0, centerX: 40, width:38, height: 38 },
        layerId: 'navBarRightArrow',
        value: 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/GreenButton_RightArrow.svg/200px-GreenButton_RightArrow.svg.png',
        alt: 'Forward',
        toolTip: "Click to go to forward to the next activity",
        target: 'Lab.statechart',
        action: 'gotoNextActivity',
        isVisibleBinding: 'Lab.navigationController.showNextButton'
      })
    );
    childViews.push(this.navBarRightArrow);

    this.set('childViews', childViews);
  }
  
});
