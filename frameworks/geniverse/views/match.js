// ==========================================================================
// Project:   Geniverse.MatchView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse SC CC YES NO sc_require sc_super*/

/** @class

  (Document Your View Here)

  @extends SC.View
*/

sc_require('mixins/match_organism');
sc_require('mixins/shifted_organism');

Geniverse.MatchView = SC.View.extend(
/** @scope Geniverse.MatchingView.prototype */ {

  dragonsBinding: 'Geniverse.matchController.arrangedObjects',
  dragonSize: 200,
  dragonExampleView: Geniverse.OrganismView.extend(Geniverse.MatchOrganism, Geniverse.ShiftedOrganism),

  onlyOneBinding: 'Geniverse.matchController.oneAtATime',

  dragonsView: null,
  dragonView: null,

  updateCurrentDragon: function() {
    this.setPath('dragonView.content', Geniverse.matchController.get('currentDragon'));
    if (!!this.get('dragonView')) {
      this.get('dragonView').contentDidChange();
    }
  }.observes('Geniverse.matchController.currentDragonIdx', 'Geniverse.matchController.arrangedObjects.[]', 'Geniverse.matchController.currentDragon'),

  
  isVisible: function() {
    return Geniverse.matchController.get('length') > 0;
  }.property('Geniverse.matchController.length'),
  
  updateIsVisible: function(){
    this.propertyDidChange('isVisible');
  }.observes('Geniverse.matchController.arrangedObjects.[]'),

  destroy: function() {
    Geniverse.matchController.removeObserver("arrangedObjects", this, this.updateIsVisible);
    Geniverse.matchController.removeObserver("[]", this, this.updateIsVisible);
    Geniverse.matchController.removeObserver("arrangedObjects", this, this.updateCurrentDragon);
    Geniverse.matchController.removeObserver("[]", this, this.updateCurrentDragon);
    Geniverse.matchController.removeObserver("currentDragonIdx", this, this.updateCurrentDragon);
    sc_super();
  },

  createChildViews: function() {
    var childViews = [];

    if (this.get('onlyOne')) {
      this.dragonView = this.createChildView(this.get('dragonExampleView').extend({
        layout: { left: 0, top: 20, width: this.get('dragonSize'), height: this.get('dragonSize')},
        content: Geniverse.NO_DRAGON
      }));
      childViews.push(this.dragonView);
      
      // we will probably make this a graphic later
      this.labelView = this.createChildView(SC.LabelView.design({
        layout: { bottom: 0, left: 0, height: 24, right: 0 },
        fontWeight: SC.BOLD_WEIGHT,
        textAlign: SC.ALIGN_CENTER,
        valueBinding: 'Geniverse.matchController.matchedCountLabel'
      }));
      childViews.push(this.labelView);
    } else {
      this.dragonsView = this.createChildView(
        CC.AutoScrollView.design({
          hasHorizontalScroller: NO,
          layout: { left: 0, top: 20, right: 0, bottom: 0},
          contentView: SC.GridView.design({
            classNames: ['dragon-grid'],
            contentBinding: 'Geniverse.matchController.arrangedObjects',
            selectionBinding: 'Geniverse.matchController.selection',
            rowHeight: this.get('dragonSize'),
            columnWidth: this.get('dragonSize'),
            canEditContent: NO,
            exampleView: this.get('dragonExampleView'),
            isSelectable: NO,
            dragDataTypes: ['dragon']
          }),
          autoScrollTriggerBinding: 'Geniverse.matchController.length'
        })
      );
      childViews.push(this.dragonsView);
    }

    this.set('childViews', childViews);
  }

});
