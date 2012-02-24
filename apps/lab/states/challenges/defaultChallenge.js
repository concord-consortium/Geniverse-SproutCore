// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

Lab.defaultChallenge = Ki.State.extend({

  challengeComplete: YES,
  
  _pageId: null,

  enterState: function() {
    this.get('statechart').sendAction('unblockNextNavButton');
    this._pageId = Geniverse.activityController.get('guid');
  },

  exitState: function() {
    // use previously-saved pageId, because exitState is usually called after the page has
    // already changed, so it's too late to get the pageId at that point.
    var pageId = this._pageId || Geniverse.activityController.get('guid');
    
    // award the user 3 stars for entering and exiting this challenge
    Geniverse.userController.setPageStars(pageId, 3);
    Geniverse.store.commitRecords();

    Lab.caselogController.propertyDidChange("userMetadata")
  }

});
