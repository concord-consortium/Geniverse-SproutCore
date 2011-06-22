// ==========================================================================
// Project:   Geniverse.matchController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  This controller containes the list of authored dragons that a student
  is attempting to match.

  @extends SC.Object
*/

sc_require('views/match');
sc_require('views/popup_match');

Geniverse.matchController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Geniverse.challengePoolController.prototype */ {
  
  allowsSelection: NO,

  pane: Geniverse.PopupMatchView,
  
  showPane: function() {
    var width = (Geniverse.matchController.get('length') * 130);
    width  = width < 130 ? 130 : width;
    this.get('pane').get('layout').width = 260;
    this.get('pane').layoutDidChange();
    if (!this.get('pane').get('isVisibleInWindow')){
      this.get('pane').append();
    }
  },

  // for one-at-a-time matching
  oneAtATime: NO,
  currentDragonIdx: 0,
  currentDragon: function() {
    var dragons = this.get('arrangedObjects');
    var dragon = Geniverse.NO_DRAGON;
    if (dragons && dragons.get('length') > 0) {
      dragon = dragons.objectAt(this.get('currentDragonIdx') % dragons.length());
    }
    this.propertyDidChange('matchedCountLabel');
    return dragon;
  },
  // this will be obsolete once we use a graphic
  matchedCountLabel: function() {
    var numDragons = this.get('arrangedObjects').get('length');
    return "" + (this.get('currentDragonIdx')+1) + "/" + numDragons;
  }.property('currentDragonIdx', 'arrangedObjects.length'),
  
  nextDragon: function() {
    SC.RunLoop.begin();
    this.set('currentDragonIdx', this.get('currentDragonIdx') + 1);
    SC.RunLoop.end();
  },

  isLastDragon: function() {
    var idx = this.get('currentDragonIdx');
    return (idx !== 0 && (idx+1) >= this.get('length'));
  },

  doesMatch: function(expected, received) {
    if (expected.get('imageURL') === received.get('imageURL')) {
      // match!
      expected.set('hasBeenMatched', YES);
      return YES;
    }
    return NO;
  },

  doesMatchCurrent: function(received) {
    return this.doesMatch(this.currentDragon(), received);
  }
}) ;
