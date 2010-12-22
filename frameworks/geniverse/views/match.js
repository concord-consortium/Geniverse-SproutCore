// ==========================================================================
// Project:   Geniverse.MatchView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Geniverse.MatchView = SC.View.extend(
/** @scope Geniverse.MatchingView.prototype */ {

  matchDragonsBinding: 'Geniverse.matchController.arrangedObjects',
  
  proposedDragonsBinding: 'Geniverse.proposedController.arrangedObjects',
  
  updateMatchViews: function () {
    
    // add dragon views
    var matchDragons = this.get('matchDragons');
    for (var i = 0, ii = matchDragons.get('length'); i < ii; i++) {
      this.addDragonView(matchDragons.objectAt(i), i);
    }
  }.observes('*matchDragons.[]'),
  
  addDragonView: function (dragon, i) {
    var height = this.get('layout').height;
    var dragonView = Geniverse.OrganismView.create({
      layout: {top: 0, bottom: 0, left: (i * height), width: height},
      content: dragon,
      backgroundColor: 'green'
    });
    this.appendChild(dragonView);
  }

});
