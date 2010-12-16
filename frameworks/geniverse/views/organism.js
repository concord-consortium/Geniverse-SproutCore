// ==========================================================================
// Project:   Geniverse.OrganismView
// Copyright: ©2010 Concord Consortium
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
  showLabel: false,
	classNames: ['organism-view'],
	content: null,  //Geniverse.NO_DRAGON,
	contentBinding: '*organism',
	childViews: 'labelView imageView'.w(),
  isDropTarget: NO, // change this to YES in view if you want replaceable by drag-and-drop
  parent: '',       // If set, drag-and-drop will replace parentView's [parent] field
  sex: null,        // If set to 0 or 1, drag-and-drop will only work wil males and females, respectively

	imageView: SC.ImageView.design({
		layout: {top: 0, bottom: 0, left: 0, right: 0},
		contentBinding: '*parentView.content',
		contentValueKey: 'imageURL',
		canLoadInBackground: NO,
		useImageCache: NO
	}),

  labelView: SC.LabelView.design({
    isVisibleBinding: '*parentView.showLabel',
    layout: { centerY: 0, height: 20, left: 0, top:0, right: 0 },
    valueBinding: '*parentView.label',
    // fontWeight: SC.BOLD_WEIGHT,
    textAlign: SC.ALIGN_CENTER,
    classNames: "dragon_label extra-transparent".w()
  }),
  // 
  // SC.LabelView.design({
  //   //valueBinding: this.get('titlePath'),
  //   value: "Breeding Pen",
  //   controlSize: "bity",
  //   textAlign: SC.ALIGN_CENTER,
  //   fontWeight: SC.BOLD_WEIGHT,
  //   classNames: "container_label".w()
  // })
	
  init: function() {
	  this.invokeLast(function() {
	    this._checkForNullDragon();
	  });
	  sc_super();
	},
	
	contentDidChange: function() {
	  this._checkForNullDragon();
		this.setPath('imageView.layerNeedsUpdate', YES);
	}.observes('*content'),
	
  // isSelectedBinding: 'Geniverse.allDragonsSelectionController.selection',
  
  selectionDidChange: function() {
    if (Geniverse.allSelectedDragonsController.get('selection').contains(this.get('content'))){
      this.set('isSelected', YES);
    } else {
      this.set('isSelected', NO);
    }
  }.observes('Geniverse.allSelectedDragonsController.selection'),
	
	isSelectedDidChange: function() {
    this._setClassNames();
	}.observes('isSelected'),

  // TODO: This could probably be done cleaner with child views...
  render: function(context, firstTime) {
			this._setClassNames();
	    sc_super();
  },
  
  _isNull: function(object) {
    if (object === null || typeof(object) == "undefined") {
      return YES;
    }
    return NO;
  },
  
  _checkForNullDragon: function() {
    var dragon = this.get('content');
  	if (this._isNull(dragon)) {
      SC.Logger.info("Dragon was null!");
      this.set('content', this.get('defaultContent'));
      return YES;
    }
    return NO;
  },
  
  _setClassNames: function(){
    var classNames = [];
    
    if (this.get('parentView') !== null && ""+this.get('parentView').constructor === 'Geniverse.DragonGenomeView'){
      // no background
      return;
    }
    
      if (this.get('isSelected')){
        classNames.push((this.getPath('organism.sex') === 0) ? 'male-selected' : 'female-selected');
      } else {
        if (!!this.get('organism')){
          classNames.push((this.getPath('organism.sex') === 0) ? 'male' : 'female');
        }
        classNames.push('empty');
      }
      
    this.get('imageView').set('classNames', classNames);
    
    this.get('imageView').displayDidChange();
  },
	
  // // drag methods:
  
  mouseDown: function(evt) {
    if (this.get('parentView') !== null && ""+this.get('parentView').constructor === 'SC.GridView'){
      // we are in a grid view, don't need to do anything
      return NO;
    }
    
    var selection = SC.SelectionSet.create();
    selection.addObject(this.get('content'));
    Geniverse.allSelectedDragonsController.set('selection', selection);
    
    return NO;
  },
   
	// drop methods: NB: none of these will be called if isDropTarget = NO
  acceptDragOperation: function(drag, op) {
    var dragon = this._getSourceDragon(drag);
    if (!this._canDrop(dragon)){
      return;
    }
    
    // next, if we are a prent view, check that dragged dragon
    // is not an egg
    var parentType = this.get('parent');
    if (!!parentType){
      SC.RunLoop.begin();
        this.get('parentView').set(this.get('parent'), dragon);
        this.get('parentView').set('child', null);   //Geniverse.NO_DRAGON);
      SC.RunLoop.end();
    } else {
      SC.RunLoop.begin();
        this.set('organism', dragon);
      SC.RunLoop.end();
    }
    
    this._setClassNames();
    
    return op ;
  },

  computeDragOperations: function(drag, evt) {
    return SC.DRAG_ANY ;
  },
  
  dragEntered: function(drag, evt) {
    if (this._canDrop(this._getSourceDragon(drag))){
      SC.RunLoop.begin();
      // this.$().addClass('drop-target') ;
      this.set('isSelected', YES);
      SC.RunLoop.end();
    }
  },

  dragExited: function(drag, evt) {
    // this.$().removeClass('drop-target') ;
    this.set('isSelected', NO);
  },
  
  _canDrop: function(dragon) {
    if (this._isNull(dragon)) {
      return NO;
    }
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
      if (dragon.get('isEgg')){
        //HACK: We used to prevent eggs from becomming parents
        //HACK: now we turn the eggs into parents without complaint.
        //return NO;
        dragon.set('isEgg',NO);
        Geniverse.store.commitRecords();
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
