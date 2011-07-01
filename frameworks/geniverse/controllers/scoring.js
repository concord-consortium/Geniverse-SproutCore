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
  targetScore: 0,

  incrementScore: function(num) {
    this.set('currentScore', this.get('currentScore')+num);
  },

  decrementScore: function(num) {
    this.set('currentScore', this.get('currentScore')-num);
  },

  resetScore: function() {
    this.set('currentScore', 0);
  }

}) ;
