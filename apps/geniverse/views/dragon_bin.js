// ==========================================================================
// Project:   Geniverse.DragonBinView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse CC*/

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Geniverse.DragonBinView = SC.View.extend( SC.Border,
/** @scope Geniverse.PublishedArticles.prototype */ {
  
  dragonViews: [],
  dragonBinIsEmptyBinding: 'Geniverse.dragonBinController.isEmpty',
  isDropTarget: YES,
  
  borderStyle: function () {
    return this.get('isDropTarget') ? SC.BORDER_BLACK : null;
  }.property('isDropTarget').cacheable(),
  
  showAddDragonsLabel: function() {
    return (this.get('isDropTarget') && this.get('dragonBinIsEmpty'));
  }.property('dragonBinIsEmpty'),
  
  addDragonsLabel: SC.LabelView.design({
    layout: {left: 5, top: 0, right: 5, bottom: 0},
    value: "Drag dragons here to attach them as evidence",
    isVisibleBinding: '*parentView.showAddDragonsLabel'
  }),
  
  childViews: 'addDragonsLabel'.w(),
    
  updateDragonViews: function () {
    // clear dragons
    var dragonViews = this.get('dragonViews');
    for (var i = 0, ii = dragonViews.get('length'); i < ii; i++) {
      this.removeChild(dragonViews[i]);
    }
    this.set('dragonViews', []);
    
    // add dragon views
    var dragons = this.get('dragons');
    for (i = 0, ii = dragons.get('length'); i < ii; i++) {
      this.addDragonView(dragons.objectAt(i), i);
    }
  }.observes('*dragons.[]'),
  
  addDragonView: function (dragon, i) {
    var height = this.get('layout').height;
    var dragonView = Geniverse.OrganismView.create({
      layout: {top: 0, bottom: 0, left: (i * height), width: height},
      organism: dragon,
      backgroundColor: 'white'
    });
    this.appendChild(dragonView);
    dragonView.set('organism', dragon);
    
    this.get('dragonViews').insertAt(i, dragonView);
  },
  
  // drag methods.
	acceptDragOperation: function(drag, op) {
	  var dragon = this._getSourceDragon(drag);
	  Geniverse.dragonBinController.pushObject(dragon);
    return op ;
  },

  computeDragOperations: function(drag, evt) {
    return SC.DRAG_ANY ;
  },
  
  dragEntered: function(drag, evt) {
    // var sex = drag.get('source').get('selection').get('firstObject').get('sex');
    //    if (this.get('allowDrop') && sex === this.get('sex')){
      this.$().addClass('drop-target') ;
    // }
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
