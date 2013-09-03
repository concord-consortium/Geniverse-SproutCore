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
    if (this._canDrag(dragon)){
      Lab.statechart.sendAction('checkMatchDragon', [this.get('content'), dragon], this);

      // if (Geniverse.matchController.doesMatch(this.get('content'), dragon)) {
      //   this.setPath('content.hasBeenMatched', YES);
      //   this._setClassNames();
      // } else {
      //   SC.AlertPane.info("", "Those dragons don't look exactly the same!");
      // }

      if (this.get('trackScore')){
        Geniverse.scoringController.incrementScore(1);
      }
    }
    return NO ;
  },

  dragEntered: function(drag, evt) {
    if (this._canDrag(this._getSourceDragon(drag))){
      SC.RunLoop.begin();
      this.set('isSelected', YES);
      SC.RunLoop.end();
      this._setClassNames();
    }
  },

  _setClassNames: function(){
    var imageView = this.get('imageView');
    if (this.getPath('content.hasBeenMatched')){
      imageView.set('classNames', ['matched']);
    } else if (this.get('isSelected')) {
      imageView.set('classNames', ['male-selected']);
    } else {
      imageView.set('classNames', ['empty']);
    }
    imageView.displayDidChange();
  },

  _canDrag: function(dragon) {
    var drg = dragon.get('bred');
    return dragon.get('bred');
  }

};
