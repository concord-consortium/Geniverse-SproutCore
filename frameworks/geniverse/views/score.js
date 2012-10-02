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

  isVisibleBinding: SC.Binding.oneWay('Geniverse.activityController.isArgumentationChallenge').not(),

  childViews: 'background targetScoreView scoreView '.w(),

  background: SC.View.design({
    layout: {top: 0, left: 0, right: 0, bottom: 0},
    classNames: ['genome-view-intro']
  }),

  targetScoreView: SC.LabelView.design({
    layout: {left: 0, right: 0, top: 5, height: 14 },
    isVisibleBinding: '*parentView.showTargetScore',
    fontWeight: SC.BOLD_WEIGHT,
    textAlign: SC.ALIGN_CENTER,
    targetScoreBinding: 'Geniverse.scoringController.targetScore',
    value: function() {
      return "GOAL is " + this.get('targetScore') + " MOVE" + (this.get('targetScore') == 1 ? "" : "S");
    }.property('isVisible', 'targetScore').cacheable()
  }),

  scoreView: SC.LabelView.design({
    layout: {left: 5, right: 0, top: 22, height: 14 },
    isVisibleBinding: '*parentView.showScore',
    fontWeight: SC.BOLD_WEIGHT,
    textAlign: SC.ALIGN_CENTER,
    scoreBinding: 'Geniverse.scoringController.currentScore',
    value: function() {
      return "Your moves: " + this.get('score');
    }.property('isVisible', 'score').cacheable()
  })
});
