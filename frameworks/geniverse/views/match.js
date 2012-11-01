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
  // FIXME dragonSize of 200 or 201 causes Chrome and Firefox to freeze when zooming in/out
  // It's some sort of bad interaction with the Geniverse.ShiftedOrganism mixin
  dragonSize: 83,
  dragonExampleView: Geniverse.OrganismView.extend(Geniverse.MatchOrganism, Geniverse.ShiftedOrganism, {
    glow: YES,
    oneAtATimeBinding: SC.Binding.oneWay('Geniverse.matchController.oneAtATime').bool(),
    colorOffset: function() {
      if (!this.get('oneAtATime')) {
        return -15;
      } else {
        return 0;
      }
    }.property('oneAtATime').cacheable()
  }),

  onlyOneBinding: 'Geniverse.matchController.oneAtATime',

  labelPosition: "bottom",

  dragonsView: null,
  dragonView: null,
  titleView: null,

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
        content: Geniverse.NO_DRAGON,
        glow: YES
      }));
      childViews.push(this.dragonView);

      var labelPos = this.get('labelPosition');
      var bgLayout, countTitleLayout, countLayout;
      if (labelPos == "right") {
        // set it up to the right
        bgLayout = {height: 42, width: 90, right: 0, centerY: 0};
      } else {
        // labelPos == "bottom" and everything else
        bgLayout = {height: 42, left: 13, right: 13, bottom: 0};
      }
      this.backgroundView = this.createChildView(SC.View.design({
        layout: bgLayout,
        classNames: ['genome-view-intro'],
        childViews: 'title count'.w(),

        title: SC.LabelView.design({
          layout: {top: 0, left: 0, right: 0, height: 23},
          fontWeight: SC.BOLD_WEIGHT,
          textAlign: SC.ALIGN_CENTER,
          value: 'TRIAL'
        }),

        count: SC.LabelView.design({
          layout: {bottom: 0, left: 0, right: 0, height: 23},
          fontWeight: SC.BOLD_WEIGHT,
          textAlign: SC.ALIGN_CENTER,
          valueBinding: 'Geniverse.matchController.matchedCountLabel'
        })
      }));
      childViews.push(this.backgroundView);

    } else {
      var titleLayout = { top:0, height: 21, left: 0, right: 0, minWidth: 130 };
      this.titleView = this.createChildView(
       SC.LabelView.design({
       layout: titleLayout,
       controlSize: SC.REGULAR_CONTROL_SIZE,
       textAlign: SC.ALIGN_CENTER,
       fontWeight: SC.BOLD_WEIGHT,
       value: "Target Drake" + (this.get('onlyOne') ? "" : "s")
       })
      );
      childViews.push(this.titleView);

      this.dragonsView = this.createChildView(this._getDragonsViewDesign({ centerX: 0, top: 22, bottom: 0, width: 100}));
      childViews.push(this.dragonsView);
    }

    this.set('childViews', childViews);
  },

  // the GridView doesn't respond well to being resized, so just replace it entirely with a new GridView
  updateWidth: function() {
    if (!this.get('onlyOne') && this.get('dragonsView') && this.get('dragonsView').get('isVisibleInWindow')) {
      var size = Geniverse.matchController.get('length'),
          width = (size * (this.get('dragonSize') + 4)) + 16,
          design = this.createChildView(this._getDragonsViewDesign({ centerX: 0, top: 22, bottom: 0, width: width}));

      this.get('dragonsView').destroy();
      this.set('dragonsView', design);
      this.appendChild(design);
      this.displayDidChange();
    }
  }.observes('Geniverse.matchController.length'),

  _getDragonsViewDesign: function(layout) {
    dragonSize = this.get('dragonSize');
    exampleView = this.get('dragonExampleView');
    return SC.GridView.design({
      layout: layout,
      classNames: ['trans-grid'],
      contentBinding: 'Geniverse.matchController.arrangedObjects',
      selectionBinding: 'Geniverse.matchController.selection',
      rowHeight: dragonSize,
      columnWidth: dragonSize,
      canEditContent: NO,
      exampleView: exampleView,
      isSelectable: NO,
      useFastPath: NO,
      dragDataTypes: ['dragon']
    });
  }

});
