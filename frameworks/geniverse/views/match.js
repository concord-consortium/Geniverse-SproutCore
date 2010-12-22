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
  
  childViews: 'title'.w(),
  
  title: SC.LabelView.design({
    classNames: 'container_label'.w(),
    layout: { centerX: 0, top:0, height: 20, right: 0 },
    controlSize: "bity",
    textAlign: SC.ALIGN_CENTER,
    fontWeight: SC.BOLD_WEIGHT,
    value: "Your Target Dragons"
  }),
  
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
      layout: {top: 20, bottom: 0, left: (i * height), width: height},
      content: dragon,
      backgroundColor: 'green'
    });
    this.appendChild(dragonView);
  }

});
