// ==========================================================================
// Project:   Lab - BreedingPenView
// Copyright: 2010 Concord Consortium
// ==========================================================================
/*globals Lab CC Geniverse */
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
  classNames: ('transparent overflowVis').w(),

  // childViews
  titleView: null,
  penView: null,

  breedingRecordRight: -20,

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
  dragonSize: 75,

  shownAgain: function() {
    if (this.tabView && this.penView && this.get('isVisibleInWindow')) {
      this.tabView.set('nowShowing', this.penView);
    }
  }.observes('isVisibleInWindow'),

  /**
   * Overwritten createChildView where you set up all
   * the internal child views and where we are
   * going to use the Binding Paths
   */
  createChildViews: function() {
    var childViews = [];

    this.penView = this.createChildView(
      CC.AutoScrollView.design({
        hasHorizontalScroller: NO,
        layout: { left: 0, top: 0, bottom: 0, right: 0 },
        contentView: SC.GridView.design({
          classNames: ['dragon-grid'],
          contentBinding: this.get('eggsControllerPath')+'.arrangedObjects',
          selectionBinding: this.get('eggsControllerPath')+'.selection',
          rowHeight: this.get('dragonSize'),
          columnWidth: this.get('dragonSize'),
          canEditContent: NO,
          exampleView: Geniverse.OrganismView,
          isSelectable: YES,
          dragDataTypes: ['dragon']
        }),
        autoScrollTriggerBinding: this.get('eggsControllerPath')+'.length'
      })
    );

    this.statsView = this.createChildView(
      Geniverse.StatsView.design({
        layout: { left: 0, top: 0, bottom: 0, right: 0 },
        contentBinding: 'Geniverse.eggsController.arrangedObjects'
      })
    );

    this.tabView = this.createChildView(
      SC.TabView.design({
        layout: { left: 0, top: 0, bottom: 30, right: 0 },
        items: [
          {title: "Breeding pen", value: this.penView },
          {title: "Stats", value: this.statsView }
        ],
        itemTitleKey: 'title',
        itemValueKey: 'value',
        nowShowing: this.penView
      })
    );

    childViews.push(this.tabView);

    this.recordLink = this.createChildView(
      Geniverse.RecordLinkView.design({
        layout: { right: this.get('breedingRecordRight'), bottom: 0, height: 25, width: 253},
        tabView: this.tabView
      })
    );

    this.tabView.addObserver('nowShowing', function() {
      if (this.getPath('nowShowing.statsView')) {
        Lab.logController.logEvent(Lab.EVENT.OPENED_STATS);
      } else {
        Lab.logController.logEvent(Lab.EVENT.CLOSED_STATS);
      }
    });

    childViews.push(this.recordLink);

    __this = this;

    this.recordButton = this.createChildView(
      SC.ButtonView.design({
        layout: { bottom: 5, right: 10, width: 150, height: 24 },
        action: function() {
          window.saveBreedingDragonsToBackend();
          __this.recordButton.set("isEnabled", false);
          setTimeout(function() {
            __this.recordButton.set("isEnabled", true);
          }, 1200);
        },
        // WTF, SproutCore, why can't we just use an `isVisible` property?
        isVisibleObserver: function() {
          this.set("isVisible", Geniverse.eggsController.get('length') > 0 &&
            !this.getPath("parentView.recordLink.isVisible"))
        }.observes('Geniverse.eggsController.length', '*parentView.recordLink.isVisible'),
        title: "Save breeding record"
      })
    );
    childViews.push(this.recordButton);

    this.set('childViews', childViews);
  }

});
