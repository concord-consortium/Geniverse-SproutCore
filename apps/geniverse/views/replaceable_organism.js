Geniverse.ReplaceableOrganismView = Geniverse.OrganismView.extend({
  
  isDropTarget: YES,
  
  acceptDragOperation: function(drag, op) {
    var dragon = this._getSourceDragon(drag);
      var sex = dragon.get('sex');
      if (this.get('allowDrop') && sex === this.get('sex')){
        this.get('parentView').set(this.get('parent'), dragon);
        this.get('parentView').set('child', null);
      }
      // this.appendChild(drag.get('source')) ;
      return op ;
    },

  computeDragOperations: function(drag, evt) {
    return SC.DRAG_ANY ;
  },
  
  dragEntered: function(drag, evt) {
    var sex = this._getSourceDragon(drag).get('sex');
    if (this.get('allowDrop') && sex === this.get('sex')){
      this.$().addClass('drop-target') ;
    }
  },

  dragExited: function(drag, evt) {
    this.$().removeClass('drop-target') ;
  },
  
  _getSourceDragon: function(dragEvt) {
    var sourceDragon;
    if ((""+dragEvt.get('source').constructor === 'Geniverse.OrganismView')){
      sourceDragon = dragEvt.get('source').get('organism');
    } else {
      sourceDragon = dragEvt.get('source').get('selection').get('firstObject');
    }
    return sourceDragon;
  }
  
});
