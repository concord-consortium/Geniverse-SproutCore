// ==========================================================================
// Project:   Lab - ChallengePoolView
// Copyright: 2010 Concord Consortium
// ==========================================================================
/*globals Lab */
/**
 * Challenge Pool View with titleView and dragonsView.
 * This is a composite view component.
 * Some code cribbed from http://www.itsgotwhatplantscrave.com/2009/07/29/composite-views/
 * We've broken Rule #3 by setting defaults for DRYness sake. Be sure to set the xPaths to something
 * else if the defaults do not fit your needs. You might also want to use a class in /resources that
 * extends this view.
 * Rule #3: View Bindings must only be set up in the instances in /resources
 * http://www.itsgotwhatplantscrave.com/2009/06/20/bindings-unleashed/
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */

Lab.ChallengePoolView = SC.View.extend(
/** @scope Lab.ChallengePoolView.prototype */ {
  classNames: 'transparent'.w(),

  // childViews
  titleView: null,
  dragonsView: null,
  dragonSize: 75,

  /**
   * Necessary configuration xPath elements to set up binding inside the composite view instances
   */
  //contentPath: '', // Binding Path for the content of the xSubView
  /**
   * Binding Path for the value of the titleView
   */
  //titlePath: '',
  /**
   * Binding Path for the challengePoolController of the ChallengePoolView
   */
  challengePoolControllerPath: 'Geniverse.challengePoolController',

  /**
   * Overwritten createChildView where you set up all
   * the internal child views and where we are
   * going to use the Binding Paths
   */
  createChildViews: function() {
    var childViews = [];

    this.titleView = this.createChildView(
      SC.LabelView.design({
        layout: { centerY: 0, height: 20, left: 0, top:0, width: 70 },
        //valueBinding: this.get('titlePath'),
        value: 'Parent Pool',
        controlSize: "bity",
        fontWeight: SC.BOLD_WEIGHT,
        textAlign: SC.ALIGN_CENTER,
        classNames: "container_label".w()
      })
    );
    childViews.push(this.titleView);

    this.dragonsView = this.createChildView(
      CC.AutoScrollView.design({
        hasHorizontalScroller: NO,
        layout: { left: 0, top: 20, width: 70, height: 280},
        backgroundColor: 'white',
        contentView: SC.GridView.design({
          contentBinding: this.get('challengePoolControllerPath')+'.arrangedObjects',
          selectionBinding: this.get('challengePoolControllerPath')+'.selection',
          rowHeight: this.get('dragonSize'),
          columnWidth: this.get('dragonSize'),
          canEditContent: NO,
          exampleView: Geniverse.OrganismView,
          isSelectable: YES,
          dragDataTypes: ['dragon']
        }),
        autoScrollTriggerBinding: this.get('challengePoolControllerPath')+'.length'
      })
    );
    childViews.push(this.dragonsView);

    this.set('childViews', childViews);
  }
  
});
