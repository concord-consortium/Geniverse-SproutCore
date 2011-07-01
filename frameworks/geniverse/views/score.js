// ==========================================================================
// Project:   Geniverse.ScoreView
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Geniverse.ScoreView = SC.LabelView.extend(
/** @scope Geniverse.ScoreView.prototype */ {

  classNames: "scoreLabel",
  scoreBinding: 'Geniverse.scoringController.currentScore',
  targetScoreBinding: 'Geniverse.scoringController.targetScore',

  showScore: YES,
  showTargetScore: NO,

  isVisible: function() {
    return this.get('showScore') || this.get('showTargetScore');
  }.property('showScore', 'showTargetScore').cacheable(),

  value: function() {
    var msg = "";
    if (this.get('showScore')) {
      msg += "moves: " + this.get('score');
      if (this.get('showTargetScore')) {
        msg += "\n";
      }
    }
    if (this.get('showTargetScore')) {
      msg += "target: " + this.get('targetScore');
    }
    return msg;
  }.property('showScore', 'showTargetScore', 'score', 'targetScore').cacheable()

});
