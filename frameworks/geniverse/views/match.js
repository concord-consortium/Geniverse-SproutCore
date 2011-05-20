// ==========================================================================
// Project:   Geniverse.MatchView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

sc_require('mixins/match_organism');
sc_require('mixins/shifted_organism');

Geniverse.MatchView = SC.View.extend(
/** @scope Geniverse.MatchingView.prototype */ {

  matchDragonsControllerPath: 'Geniverse.matchController',
  dragonSize: 75,
  dragonExampleView: Geniverse.OrganismView.extend(Geniverse.MatchOrganism, Geniverse.ShiftedOrganism),

  titleView: null,
  dragonsView: null,
  
  isVisible: function() {
    return Geniverse.matchController.get('length') > 0;
  }.property('Geniverse.matchController.length'),
  
  updateIsVisible: function(){
    this.propertyDidChange('isVisible');
  }.observes('Geniverse.matchController.arrangedObjects.[]'),

  destroy: function() {
    Geniverse.matchController.removeObserver("arrangedObjects", this, this.updateIsVisible);
    Geniverse.matchController.removeObserver("[]", this, this.updateIsVisible);
    sc_super();
  },
 

  createChildViews: function() {
    var childViews = [];
    this.dragonsView = this.createChildView(
      CC.AutoScrollView.design({
        hasHorizontalScroller: NO,
        layout: { left: 0, top: 20, right: 0, bottom: 0},
        contentView: SC.GridView.design({
          classNames: ['dragon-grid'],
          contentBinding: this.get('matchDragonsControllerPath')+'.arrangedObjects',
          selectionBinding: this.get('matchDragonsControllerPath')+'.selection',
          rowHeight: this.get('dragonSize'),
          columnWidth: this.get('dragonSize'),
          canEditContent: NO,
          exampleView: this.get('dragonExampleView'),
          isSelectable: NO,
          dragDataTypes: ['dragon']
        }),
        autoScrollTriggerBinding: this.get('matchDragonsControllerPath')+'.length'
      })
    );
    childViews.push(this.dragonsView);

    this.titleView = this.createChildView(
      SC.LabelView.design({
        classNames: 'container_label'.w(),
        layout: { top:0, height: 20, left: 0, right: 0, minWidth: 130 },
        controlSize: "bity",
        textAlign: SC.ALIGN_CENTER,
        fontWeight: SC.BOLD_WEIGHT,
        value: "Target Drakes"
      })
    );
    childViews.push(this.titleView);

    this.set('childViews', childViews);
  }

});
