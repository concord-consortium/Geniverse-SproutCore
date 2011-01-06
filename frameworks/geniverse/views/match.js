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
  
  childViews: 'title dragonViews'.w(),
  
  title: SC.LabelView.design({
    classNames: 'container_label'.w(),
    layout: { top:0, height: 20, left: 0 },
    controlSize: "bity",
    textAlign: SC.ALIGN_CENTER,
    fontWeight: SC.BOLD_WEIGHT,
    value: "Target Drakes"
  }),
  
  isVertical: NO,
  
  isVisible: function() {
    var titleWidth = (Geniverse.matchController.get('length') * this.get('layout').height);
    titleWidth  = (titleWidth < 130 || this.get('isVertical')) ? 130 : titleWidth;
    this.get('title').get('layout').width = titleWidth;
    this.get('title').set('textAlign', this.get('isVertical') ? SC.ALIGN_LEFT : SC.ALIGN_CENTER);
    this.get('title').layoutDidChange();
    return Geniverse.matchController.get('length') > 0;
  }.property('Geniverse.matchController.arrangedObjects.[]'),
  
  updateIsVisible: function(){
    this.propertyDidChange('isVisible');
  }.observes('Geniverse.matchController.arrangedObjects.[]'),
  
  dragonViews: SC.View.design({
    layout: { top:0, bottom: 0, left: 0, right: 0 }
  }),
  
  updateMatchViews: function () {
    
    // add dragon views
    var matchDragons = this.get('matchDragons');
    this.get('dragonViews').removeAllChildren();
    for (var i = 0, ii = matchDragons.get('length'); i < ii; i++) {
      this.addDragonView(matchDragons.objectAt(i), i);
    }
  }.observes('*matchDragons.[]'),
  
  addDragonView: function (dragon, i) {
    var height = this.get('layout').height;
    var width = this.get('layout').width;
    var top, left;
    if (!this.get('isVertical')){
      top = 20;
      left = (i * height);
      width = height;
    } else {
      top = 20 + (i * width);
      left = 0;
    }
    var dragonView = Geniverse.OrganismView.create({
      layout: {top: top, height: width, left: left, width: width},
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

        return NO ;
      },

      dragEntered: function(drag, evt) {
          SC.RunLoop.begin();
          this.set('isSelected', YES);
          SC.RunLoop.end();
          this._setClassNames();
      },
      
      _setClassNames: function(){
        var classNames = [];
        
        if (this.get('isMatched')){
          classNames.push('matched');
        } else if (this.get('isSelected')){
          classNames.push('male-selected');
        } else {
          classNames.push('empty');
        }
        this.get('imageView').set('classNames', classNames);
        this.set('classNames', classNames);
        this.get('imageView').displayDidChange();
      }
    });
    this.get('dragonViews').appendChild(dragonView);
  }

});
