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
	label: 'Organism',
  showLabel: false,
	classNames: ['organism-view opaque'],
	content: null,  //Geniverse.NO_DRAGON,
	childViews: 'labelView imageView revealButtonView'.w(),
  parent: '',       // If set, drag-and-drop will replace parentView's [parent] field
  sex: null,        // If set to 0 or 1, drag-and-drop will only work with males and females, respectively
  
  isDropTarget: NO, // whether this is replaceable by drag-and-drop
  canDrag: NO,      // whether this can be dragged elsewhere
  showBackground: YES,
  useRevealButton: NO,  // hides dragon and show a reveal button

	imageView: SC.ImageView.design({
		layout: {top: 0, bottom: 0, left: 0, right: 0},
		contentBinding: '*parentView.content',
		hideImageBinding: '*parentView.useRevealButton',
    classNames: ['opaque'],
    valueNeedsRecalculated: YES, // simple value we can toggle to trigger the value property being recalculated
   
    // get imageURL and make smaller if necessary
    value: function() {
      console.log("recalculating image")
      if (!this.get('content')){
        return '';
      }
      
      if (this.get('hideImage')){
        return 'http://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Question_mark_alternate.svg/200px-Question_mark_alternate.svg.png';
      }
      
      var imageURL = this.get('content').get('imageURL');
     
      var height = this.get('clippingFrame').height;
      if (!height) {
        return imageURL;
      }
      if (height <= 75){
        imageURL = imageURL.replace('.png', '_75.png');
      }
      return imageURL;
    }.property('content','valueNeedsRecalculated','clippingFrame').cacheable(),

    viewDidResize: function() {
      // we need to recalculate our imageURL
      this.set('valueNeedsRecalculated', (! this.get('valueNeedsRecalculated')));
    },
    
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
  
  revealButtonView: SC.ButtonView.design({
    isVisibleBinding: '*parentView.useRevealButton',
    layout: { centerY: 0, height: 24, bottom:25, left: 5, right: 5 },
    title: "Reveal",
    isEnabled: YES,
    action: "revealClicked",
    target: "Lab.statechart"
  }),
  
  // revealButtonView: SC.ButtonView.design({      
  //   layout: { centerX: 0, centerY: 20, width: 250, height: 24 },      
  //   title: "Change Title",      
  //   action: "toggleGreeting",      
  //   target: "Lab.statechart"     
  // }),
  
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

  isAddedToParent: NO,

  didAddToParent: function(parent) {
    this.set('isAddedToParent', YES);
  },

  scheduledForDestruction: NO,
  didRemoveFromParent: function(parent) {
    // schedule a delayed destruction. collection views tend to do lots of adds/removes
    // in succession, so give it time to settle down.
    var self = this;
    if (! this.get('scheduledForDestruction')) {
      this.set('scheduledForDestruction', YES);
      window.setTimeout(function() {
        if (! self.get('isAddedToParent')) {
          self.destroy();
        }
      }, 2000);
    }
  },

  destroy: function() {
    // SC.Logger.log("OrganismView destroyed!");
    Geniverse.allSelectedDragonsController.removeObserver('selection', this, 'selectionDidChange');
    Geniverse.allSelectedDragonsController.removeObserver('selection', this, this.selectionDidChange);
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

    if (this.get('showBackground')) {
      if (this.get('isSelected')){
        classNames.push((this.getPath('content.sex') === 0) ? 'male-selected' : 'female-selected');
      } else {
        if (!!this.get('content')){
          classNames.push((this.getPath('content.sex') === 0) ? 'male' : 'female');
        }
        classNames.push('empty');
      }

      this.get('imageView').set('classNames', classNames);
      this.get('imageView').displayDidChange();
    }
  },
	
  // // drag methods:
  
  mouseDown: function(evt) {
    if (!!this.get('parentView') && ""+this.get('parentView').constructor === 'SC.GridView'){
      // we are in a grid view, don't need to do anything
      return NO;
    }
    
    var selection = SC.SelectionSet.create();
    selection.addObject(this.get('content'));
    Geniverse.allSelectedDragonsController.set('selection', selection);
    
    return YES;
  },
  
  isDragging: NO,
  
  mouseDragged: function(evt) {
    if (this.get('canDrag') && !this.get('isDragging')){
      var x = SC.Drag.start({
        event: evt,
        source: this,
        dragView: this,
        ghost: NO,
        slideBack: YES,
        ghostActsLikeCursor: YES
      });
      // debugger
      // console.log("x.get('ghostView') = "+x.get('ghostView'));
      // x.get('ghostView').set('value', this.get('content').get('imageURL'));
      this.set('isDragging', YES);
    }
  },
  
  mouseUp: function(evt) {
    this.set('isDragging', NO);
  },
   
	// drop methods: NB: none of these will be called if isDropTarget = NO
  acceptDragOperation: function(drag, op) {
    var dragon = this._getSourceDragon(drag);
    if (!this._canDrop(dragon)){
      return NO;
    }
    SC.Logger.info("can drop");
    return YES;
  },
  
  // this will be called if acceptDragOperation returns YES
  performDragOperation: function(drag, op) {
    var dragon = this._getSourceDragon(drag);
    
    // next, if we are a prent view, check that dragged dragon
    // is not an egg
    var parentType = this.get('parent');
    if (!!parentType && !!this.get('parentView')){
      SC.RunLoop.begin();
        this.get('parentView').set(this.get('parent'), dragon);
        this.get('parentView').set('child', null);   //Geniverse.NO_DRAGON);
      SC.RunLoop.end();
    } else {
      SC.RunLoop.begin();
        this.set('content', dragon);
      SC.RunLoop.end();
    }
    
    this._setClassNames();
    return op;
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
      sourceDragon = dragEvt.get('source').get('content');
    } else {
      sourceDragon = dragEvt.get('source').get('selection').get('firstObject');
    }
    return sourceDragon;
  }

});
