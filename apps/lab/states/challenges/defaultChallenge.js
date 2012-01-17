// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

Lab.defaultChallenge = Ki.State.extend({

  challengeComplete: YES,

  enterState: function() {
    this.get('statechart').sendAction('unblockNextNavButton');
  },

  exitState: function() {
    // award the user 1 "star" for entering and exiting this challenge
    var pageId = Geniverse.activityController.get('guid');
    Geniverse.userController.setPageStars(pageId, 1);
  }

});
