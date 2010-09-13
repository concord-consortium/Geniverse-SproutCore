// ==========================================================================
// Project:   Geniverse.OrganismView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Geniverse.OrganismView = SC.View.extend( 
/** @scope Geniverse.OrganismView.prototype */ {
	organismBinding: '*content',
	label: 'Organism',
	classNames: ['organism-view'],
	contentBinding: '*organism',
	childViews: 'imageView'.w(),
	
  isDropTarget: NO, // change this to YES in view if you want replaceable by drag-and-drop
  parent: '',       // If set, drag-and-drop will replace parentView's [parent] field
  sex: null,        // If set to 0 or 1, drag-and-drop will only work wil males and females, respectively
  
	
	imageView: SC.ImageView.design({
		layout: {top: 0, bottom: 0, left: 0, right: 0},
		contentBinding: '*parentView.content',
		contentValueKey: 'imageURL',
		canLoadInBackground: NO,
		useImageCache: NO
    // classNames: 'isSelected'.w()
	}),
	
	contentDidChange: function() {
		this.setPath('imageView.layerNeedsUpdate', YES);
	}.observes('*content'),
	
	isSelectedDidChange: function() {
		this.set('layerNeedsUpdate', YES);
	}.observes('isSelected'),

  // TODO: This could probably be done cleaner with child views...
  render: function(context, firstTime) {
			this._selected_style(context);
	    sc_super();
  },

  _selected_style: function(context) {
    // this.get('imageView').set('classNames', ['isSelected']);

    if (this.get('organism') !== null){
      var classNames = [];
      if (this.get('parentView') !== null && ""+this.get('parentView').constructor === 'SC.GridView'){
        classNames.push((this.getPath('organism.sex') === 0) ? 'male' : 'female');
      }
      this.get('imageView').set('classNames', classNames);
    }
	},
	
	// drag methods:
	
  mouseDown: function(evt) {
      SC.Drag.start({ 
       event: evt, 
       source: this, 
       dragView: this, 
       ghost: NO, 
       slideBack: YES, 
       dataSource: this 
     }) ;
      return YES;
   },
   
	// drop methods: NB: none of these will be called if isDropTarget = NO
  acceptDragOperation: function(drag, op) {
    SC.Logger.log("here??");
    var dragon = this._getSourceDragon(drag);
    if (!this._canDrop(dragon)){
      return;
    }
    
    SC.Logger.log("here");
    
    
    // next, if we are a prent view, check that dragged dragon
    // is not an egg
    var parentType = this.get('parent');
    if (!!parentType){
      this.get('parentView').set(this.get('parent'), dragon);
      this.get('parentView').set('child', null);
    } else {
      SC.Logger.log("woo?");
      this.set('organism', dragon);
    }
    SC.Logger.log("now here");
    
    return op ;
  },

  computeDragOperations: function(drag, evt) {
    return SC.DRAG_ANY ;
  },
  
  dragEntered: function(drag, evt) {
    if (this._canDrop(this._getSourceDragon(drag))){
      this.$().addClass('drop-target') ;
    }
  },

  dragExited: function(drag, evt) {
    this.$().removeClass('drop-target') ;
  },
  
  _canDrop: function(dragon) {
    
    // if we require a sex, check that the dragged dragon
    // is of the right sex
    var requiredSex = this.get('sex');
    if (requiredSex !== null){
      var sex = dragon.get('sex');
      if (sex !== requiredSex){
        return NO;
      }
    }
    
    var parentType = this.get('parent');
    if (!!parentType){
      SC.Logger.log("dragon.get('isEgg') = "+dragon.get('isEgg'));
      if (dragon.get('isEgg')){
        return NO;
      }
    }
    
    return YES;
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
