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
  dragonsBinding: 'Geniverse.matchController.arrangedObjects',
  dragonSize: 75,
  dragonExampleView: Geniverse.OrganismView.extend(Geniverse.MatchOrganism, Geniverse.ShiftedOrganism),

  onlyOne: NO,

  titleView: null,
  dragonsView: null,
  dragonView: null,

  currentDragonIdx: 0,
  updateCurrentDragon: function() {
    this.setPath('dragonView.content', this.get('currentDragon'));
  }.observes('currentDragonIdx', 'Geniverse.matchController.arrangedObjects.[]'),

  currentDragon: function() {
    var dragons = this.get('dragons');
    var dragon = Geniverse.NO_DRAGON;
    if (dragons && dragons.get('length') > 0) {
      dragon = dragons.objectAt(this.get('currentDragonIdx') % dragons.length());
    }
    return dragon;
  }.property('currentDragonIdx', 'Geniverse.matchController.arrangedObjects.[]').cacheable(),
  
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
    sc_super();
  },

  nextDragon: function() {
    SC.RunLoop.begin();
    this.set('currentDragonIdx', this.get('currentDragonIdx') + 1);
    SC.RunLoop.end();
  },

  createChildViews: function() {
    var childViews = [];

    if (this.get('onlyOne')) {
      SC.Logger.log("Only one!");
      this.dragonView = this.createChildView(this.get('dragonExampleView').extend({
        layout: { left: 0, top: 20, width: this.get('dragonSize'), height: this.get('dragonSize')},
        content: Geniverse.NO_DRAGON
      }));
      childViews.push(this.dragonView);
    } else {
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
    }

    var titleLayout = { top:0, height: 20, left: 0, right: 0, minWidth: 130 };
    if (this.get('onlyOne')) {
      titleLayout = { top: 0, height: 20, left: 0, width: this.get('dragonSize'), minWidth: this.get('dragonSize') };
    }
    this.titleView = this.createChildView(
      SC.LabelView.design({
        classNames: 'container_label'.w(),
        layout: titleLayout,
        controlSize: "bity",
        textAlign: SC.ALIGN_CENTER,
        fontWeight: SC.BOLD_WEIGHT,
        value: "Target Drake" + (this.get('onlyOne') ? "" : "s")
      })
    );
    childViews.push(this.titleView);

    this.set('childViews', childViews);
  }

});
