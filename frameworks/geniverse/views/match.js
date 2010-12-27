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
      isMatched: NO,
      isDropTarget: YES,
      mouseDown: function(evt) {      // no selection allowed
        return NO;
      },
      // drop methods: NB: none of these will be called if isDropTarget = NO
      acceptDragOperation: function(drag, op) {
        var dragon = this._getSourceDragon(drag);
        
        var targetURL = this.get('content').get('imageURL');
        console.log("targetURL = "+targetURL);
        
        if (dragon.get('imageURL') === targetURL){
          SC.RunLoop.begin();
            // this.get('parentView').get('proposedDragons').addObject(dragon);
            this.set('isMatched', YES);
          SC.RunLoop.end();
          
        } else {
          alert("Those dragons don't look exactly the same.");
        }

        this._setClassNames();

        return op ;
      },

      dragEntered: function(drag, evt) {
          this.set('isSelected', YES);
          this._setClassNames();
      },
      
      _setClassNames: function(){
        var classNames = [];
        
        console.log("this.get('isMatched') = "+this.get('isMatched'));
        if (this.get('isMatched')){
          classNames.push('matched');
        } else if (this.get('isSelected')){
          classNames.push('male-selected');
        } else {
          classNames.push('empty');
        }

        this.get('imageView').set('classNames', classNames);

        this.get('imageView').displayDidChange();
      }
    });
    this.appendChild(dragonView);
  }

});
