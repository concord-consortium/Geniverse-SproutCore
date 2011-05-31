// ==========================================================================
// Project:   Geniverse.MatchOrganismMixin
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  intended to work with Geniverse.OrganismView
*/

Geniverse.MatchOrganism = {
  isDropTarget: YES,

  mouseDown: function(evt) {
    return NO;
  },

  acceptDragOperation: function(drag, op) {
    var dragon = this._getSourceDragon(drag);
    
    var targetURL = this.get('content').get('imageURL');
    console.log("targetURL = "+targetURL);
    
    if (dragon.get('imageURL') === targetURL){
      SC.RunLoop.begin();
        this.get('content').set('hasBeenMatched', YES);
      SC.RunLoop.end();
      
    } else {
      SC.AlertPane.info("", "Those dragons don't look exactly the same!");
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
    var imageView = this.get('imageView');
    if (this.get('content').get('hasBeenMatched')){
      imageView.set('classNames', ['matched']);
    } else if (this.get('isSelected')) {
      imageView.set('classNames', ['male-selected']);
    } else {
      imageView.set('classNames', ['empty']);
    }
    imageView.displayDidChange();
  }

};
