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
	
		classNames: "statsLabel brown".w(),
    childViews: "red green yellow purple".w(),

    red: SC.LabelView.design({
      layout: {centerX: 0, top: 0, width: 100, height: 18},
      classNames: "red stats".w(),
	    valueBinding: 'Geniverse.statsController.parentStats.colors.red'
    }),

    green: SC.LabelView.design({
      layout: {centerX: 0, top: 18, width: 100, height: 18},
      classNames: "green stats".w(),
	    valueBinding: 'Geniverse.statsController.parentStats.colors.green'
    }),

    yellow: SC.LabelView.design({
      layout: {centerX: 0, top: 36, width: 100, height: 18},
      classNames: "yellow stats".w(),
	    valueBinding: 'Geniverse.statsController.parentStats.colors.yellow'
    }),

    purple: SC.LabelView.design({
      layout: {centerX: 0, top: 54, width: 100, height: 18},
      classNames: "purple stats".w(),
	    valueBinding: 'Geniverse.statsController.parentStats.colors.purple'
    })
});
