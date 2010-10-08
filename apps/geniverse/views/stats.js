// ==========================================================================
// Project:   Geniverse.BreedDragonView
// Copyright: ©2010 Concord Consortium, Inc.
// ==========================================================================
/*globals Geniverse, generateDragonWithSex */

/** @class

  Geniverse.StatsView
  Show statistics about dragons which have been bread.

  @extends SC.View
*/

Geniverse.StatsView = SC.View.extend(
  /** @scope Geniverse.StatsView.prototype */ {
	
		classNames: "statsLabel".w(),
    childViews: "resetButtonView red green yellow purple brown".w(),

    resetButtonView: SC.ButtonView.design({
      layout: { centerX: 0, top: 0, width: 100, height: 24 },
      target: 'Geniverse.breedDragonController',
      action: "reset",
      isBreedingBinding: 'Geniverse.breedDragonController.isBreeding',
      hasParentsBinding: 'Geniverse.breedDragonController.hasParents',
      isEnabled: function() {
        return (this.get('hasParents') && (! this.get('isBeeding')));
      }.property('hasParents','isBreeding').cacheable(),
      
      title: 'reset'	
    }),
	
	
    red: SC.LabelView.design({
      layout: {left: 3, top: 30, width: 70, height: 18},
      classNames: "red stats".w(),
	    valueBinding: 'Geniverse.statsController.redLabel'
    }),

    green: SC.LabelView.design({
      layout: {left: 3, top: 48, width: 70, height: 18},
      classNames: "green stats".w(),
	    valueBinding: 'Geniverse.statsController.greenLabel'
    }),

    yellow: SC.LabelView.design({
      layout: {left: 3, top: 66, width: 70, height: 18},
      classNames: "yellow stats".w(),
	    valueBinding: 'Geniverse.statsController.yellowLabel'
    }),

    purple: SC.LabelView.design({
      layout: {left: 3, top: 84, width: 70, height: 18},
      classNames: "purple stats".w(),
	    valueBinding: 'Geniverse.statsController.purpleLabel'
    }),
    
    brown: SC.LabelView.design({
      layout: {left: 3, top: 102, width: 70, height: 18},
      classNames: "orange stats".w(),
	    valueBinding: 'Geniverse.statsController.brownLabel'
    })
});
