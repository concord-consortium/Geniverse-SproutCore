// ==========================================================================
// Project:   Geniverse.scoringController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.scoringController = SC.Controller.create(
/** @scope Geniverse.scoringController.prototype */ {
  currentScore: 0,
  currentChallengeScore: 0,
  numberOfTrials: 1,

  // TODO this should be set by the auto-calculation methods, if possible
  minimumScore: 0,

  // set when the activity is loaded
  twoStarThreshold: 2,
  threeStarThreshold: 1,

  twoStarChallengeThreshold: function() {
    return this.get('twoStarThreshold') * this.get('numberOfTrials');
  }.property('twoStarThreshold','numberOfTrials').cacheable(),

  threeStarChallengeThreshold: function() {
    return this.get('threeStarThreshold') * this.get('numberOfTrials');
  }.property('threeStarThreshold','numberOfTrials').cacheable(),

  targetScore: function() {
    return this.get('minimumScore') + this.get('threeStarThreshold');
  }.property('minimumScore','threeStarThreshold').cacheable(),

  achievedStars: function() {
    var min = this.get('minimumScore');
    var threeStars = this.get('threeStarThreshold') + min;
    var twoStars = this.get('twoStarThreshold') + min;

    var score = this.get('currentScore');
    return this._stars(score, threeStars, twoStars);
  }.property('minimumScore','currentScore','twoStarThreshold','threeStarThreshold').cacheable(),

  achievedChallengeStars: function() {
    var min = this.get('minimumScore') * this.get('numberOfTrials');
    var threeStars = this.get('threeStarChallengeThreshold') + min;
    var twoStars = this.get('twoStarChallengeThreshold') + min;

    var score = this.get('currentChallengeScore');
    return this._stars(score, threeStars, twoStars);
  }.property('minimumScore','currentChallengeScore','numberOfTrials','twoStarThreshold','threeStarThreshold').cacheable(),

  _stars: function(score, threeStars, twoStars) {
    if (score <= threeStars) {
      return 3;
    } else if (score <= twoStars) {
      return 2;
    } else {
      return 1;
    }
  },

  incrementScore: function(num) {
    this.set('currentScore', this.get('currentScore')+num);
    this.set('currentChallengeScore', this.get('currentChallengeScore')+num);
  },

  decrementScore: function(num) {
    this.set('currentScore', this.get('currentScore')-num);
    this.set('currentChallengeScore', this.get('currentChallengeScore')-num);
  },

  resetScore: function() {
    this.set('currentScore', 0);
  },

  resetChallengeScore: function() {
    this.set('currentChallengeScore', 0);
  }

}) ;
