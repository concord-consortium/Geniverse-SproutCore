// ==========================================================================
// Project:   Lab - BottomBarView
// Copyright: 2010 Concord Consortium
// ==========================================================================
/*globals Lab SC YES NO*/


Lab.BottomBarView = SC.ToolbarView.extend(
/** @scope Lab.TopBarView.prototype */ {
  
  layout: { bottom: 0, left: 0, right: 0, height: 36 },
  layerId: 'bottomBar',
  classNames: ['brown-toolbar-view'],
  anchorLocation: SC.ANCHOR_BOTTOM,

  // childViews
  navBarLeftArrowBW: null,
  navBarRightArrowBW: null,
  navBarLeftArrow: null,
  navBarRightArrow: null,
  navBarRightArrowRed: null,

  /**
   * Overwritten createChildView where you set up all
   * the internal child views and where we are
   * going to use the Binding Paths
   */
  createChildViews: function() {
    var childViews = [];
    
    // this is a little funny, but it seems to be much more stable to lay the
    // active buttons ontop of the disabled images, binding the button's isVisible 
    // to the controller, than to bind the button's image value to the controller.
    // In the latter method the image frequently doesn't repaint right away...
    
    this.navBarLeftArrowBW = this.createChildView(
      SC.ImageView.design({
        layout: { centerY: 0, centerX: -40, width:38, height: 38 },
        value: static_url('arrow_left_bw.png'),
        canLoadInBackground: YES,
    		useImageCache: YES
      })
    );
    childViews.push(this.navBarLeftArrowBW);

    this.navBarRightArrowBW = this.createChildView(
      SC.ImageView.design({
        layout: { centerY: 0, centerX: 40, width:38, height: 38 },
        value: static_url('arrow_right_bw.png'),
        canLoadInBackground: YES,
       useImageCache: YES
      })
    );
    childViews.push(this.navBarRightArrowBW);
    
    this.navBarLeftArrow = this.createChildView(
      SC.ImageView.design(Geniverse.SimpleButton, {
        layout: { centerY: 0, centerX: -40, width:38, height: 38 },
        layerId: 'navBarLeftArrow',
        value: static_url('arrow_left_green.png'),
        alt: 'Back',
        toolTip: "Click to go to back to the previous activity",
        target: 'Lab.statechart',
        action: 'gotoPreviousActivity',
        canLoadInBackground: NO,
    		useImageCache: NO,
    		isVisibleBinding: 'Lab.navigationController.showPreviousButton'
      })
    );
    childViews.push(this.navBarLeftArrow);

    this.navBarRightArrow = this.createChildView(
      SC.ImageView.design(Geniverse.SimpleButton, {
        layout: { centerY: 0, centerX: 40, width:38, height: 38 },
        layerId: 'navBarRightArrow',
        value: static_url('arrow_right_green.png'),
        alt: 'Forward',
        toolTip: "Click to go to forward to the next activity",
        target: 'Lab.statechart',
        action: 'gotoNextActivity',
        canLoadInBackground: NO,
    		useImageCache: NO,
    		isVisibleBinding: 'Lab.navigationController.showNextButton'
      })
    );
    childViews.push(this.navBarRightArrow);
    
    this.navBarRightArrowRed = this.createChildView(
      SC.ImageView.design({
        layout: { centerY: 0, centerX: 40, width:38, height: 38 },
        value: static_url('arrow_right_red.png'),
        canLoadInBackground: YES,
    		useImageCache: YES,
    		toolTip: "You can't move forward until you complete the challenge",
    		isVisibleBinding: 'Lab.navigationController.blockNextButton'
      })
    );
    childViews.push(this.navBarRightArrowRed);

    this.set('childViews', childViews);
  }
  
});
