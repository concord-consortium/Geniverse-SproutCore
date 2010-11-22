// ==========================================================================
// Project:   Lab - BreedingPenView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */
/**
 * BreedingPen View with titleView and penView for eggs.
 * This is a composite view component.
 * Some code cribbed from http://www.itsgotwhatplantscrave.com/2009/07/29/composite-views/
 * We've broken Rule #3 by setting defaults for DRYness sake. Be sure to set the xPaths to something
 * else if the defaults do not fit your needs. You might also want to use a class in /resources that
 * extends this view.
 * Rule #3: View Bindings must only be set up in the instances in /resources
 * http://www.itsgotwhatplantscrave.com/2009/06/20/bindings-unleashed/
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */

Lab.BreedingPenView = SC.View.extend(
/** @scope Lab.BreedingPenView.prototype */ {
  classNames: ('transparent').w(),
  layout: { left: 265, top: 70, width: 300, height: 300 },

  // childViews
  titleView: null,
  penView: null,

  /**
   * Necessary configuration xPath elements to set up binding inside the composite view instances
   */
  //contentPath: '', // Binding Path for the content of the xSubView
  /**
   * Binding Path for the value of the titleView
   */
  //titlePath: '',
  /**
   * Binding Path for the eggsController of the BreedingPenView
   */
  eggsControllerPath: 'Geniverse.eggsController',

  /**
   * Overwritten createChildView where you set up all
   * the internal child views and where we are
   * going to use the Binding Paths
   */
  createChildViews: function() {
    var childViews = [];

    this.titleView = this.createChildView(
      SC.LabelView.design({
        layout: { centerY: 0, height: 20, left: 0, top:0, width: 300 },
        //valueBinding: this.get('titlePath'),
        value: "Breeding Pen",
        controlSize: "bity",
        textAlign: SC.ALIGN_CENTER,
        fontWeight: SC.BOLD_WEIGHT,
        classNames: "container_label".w()
      })
    );
    childViews.push(this.titleView);

    this.penView = this.createChildView(
      CC.AutoScrollView.design({
        hasHorizontalScroller: NO,
        layout: { left: 0, top: 20, width: 300, height: 280 },
        backgroundColor: 'white',
        contentView: SC.GridView.design({
          contentBinding: this.get('eggsControllerPath')+'.arrangedObjects',
          selectionBinding: this.get('eggsControllerPath')+'.selection',
          rowHeight: 60,
          columnWidth: 60,
          canEditContent: NO,
          exampleView: Geniverse.OrganismView,
          isSelectable: YES,
          dragDataTypes: ['dragon']
        }),
        autoScrollTriggerBinding: this.get('eggsControllerPath')+'.length'
      })
    );
    childViews.push(this.penView);

    this.set('childViews', childViews);
  }
  
});
