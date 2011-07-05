// ==========================================================================
// Project:   Geniverse.ScoreView
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Geniverse.ScoreView = SC.View.extend(
/** @scope Geniverse.ScoreView.prototype */ {

  classNames: "scoreLabel",

  showScore: YES,
  showTargetScore: NO,

  childViews: 'background targetScoreView scoreView '.w(),

  background: SC.View.design({
    layout: {top: 0, left: 0, right: 0, bottom: 0},
    classNames: ['genome-view-intro']
  }),

  targetScoreView: SC.LabelView.design({
    layout: {left: 5, right: 0, top: 0, height: 14 },
    isVisibleBinding: '*parentView.showTargetScore',
    fontWeight: SC.BOLD_WEIGHT,
    targetScoreBinding: 'Geniverse.scoringController.targetScore',
    value: function() {
      return "Goal is " + this.get('targetScore') + " moves";
    }.property('isVisible', 'targetScore').cacheable()
  }),

  scoreView: SC.LabelView.design({
    layout: {left: 5, right: 0, top: 16, height: 14 },
    isVisibleBinding: '*parentView.showScore',
    fontWeight: SC.BOLD_WEIGHT,
    scoreBinding: 'Geniverse.scoringController.currentScore',
    value: function() {
      return "Your moves: " + this.get('score');
    }.property('isVisible', 'score').cacheable()
  })
});
