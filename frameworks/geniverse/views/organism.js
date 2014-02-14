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
  content: null,  //Geniverse.NO_DRAGON,
  childViews: 'labelView colorLabelView imageView revealButtonView'.w(),
  parent: '',       // If set, drag-and-drop will replace parentView's [parent] field
  sex: null,        // If set to 0 or 1, drag-and-drop will only work with males and females, respectively

  isDropTarget: NO, // whether this is replaceable by drag-and-drop
  acceptsOffspringDrop: YES,    // set to NO to prevent offspring from being dragged to the parent spot
  canDrag: NO,      // whether this can be dragged elsewhere
  showBackground: YES,
  hideDragon: NO, // hides the dragon
  useRevealButton: NO,  // hides dragon and show a reveal button
  revealButtonEnabled: YES,

  trackScore: NO, // whether this view will increment scoring controller when dragged into

  glow: NO, // whether to show a glow behind drake

  showColorLabelsBinding: 'Geniverse.activityController.showColorLabels',
  colorLabelVisible: function() {
    return (this.get('showColorLabels') || false) && !this.get('hideDragon');
  }.property('hideDragon','showColorLabels'),
  colorLabelBinding: '*content.color',

  imageView: SC.ImageView.design({
    layout: {top: 0, bottom: 0, left: 0, right: 0},
    contentBinding: '*parentView.content',
    hideDragonBinding: '*parentView.hideDragon',
    useRevealButtonBinding: '*parentView.useRevealButton',
    hideImage: function() {
      return this.get('hideDragon') || this.get('useRevealButton');
    }.property('hideDragon', 'useRevealButton').cacheable(),
    classNames: ['opaque'],
    valueNeedsRecalculated: YES, // simple value we can toggle to trigger the value property being recalculated

    // get imageURL and make smaller if necessary
    value: function() {
      if (!this.get('content')){
        return '';
      }

      if (this.get('hideImage')){
        return sc_static('question_mark.png');
      }

      var imageURL = this.get('content').get('imageURL');

      var height = this.get('clippingFrame').height;
      if (!height) {
        return imageURL;
      }
      if (height <= 75){
        // move /a/b/drake.png to /a/b/75/drake.png
        imageURL = imageURL.replace(/^(.*)\/(.*?)$/, '$1/75/$2');
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
    layout: { height: 20, left: 0, top:0, right: 0 },
    valueBinding: '*parentView.label',
    fontWeight: SC.BOLD_WEIGHT,
    textAlign: SC.ALIGN_CENTER
  }),

  colorLabelView: SC.LabelView.design({
    isVisibleBinding: '*parentView.colorLabelVisible',
    colorOffsetBinding: '*parentView.colorOffset',
    layout: function () {
      var btm = 10;
      var offset = this.get('colorOffset');
      if (offset) {
        btm += offset;
      }
      var height = this.getPath('parentView.clippingFrame').height;
      if (height <= 75) {
        btm = -5;
        this.set('classNames', ['sc-view','sc-label-view','small-color-label']);
      } else {
        this.set('classNames', ['sc-view','sc-label-view','normal-color-label']);
      }

      return { height: 20, left: 0, bottom: btm, right: 0 };
    }.property('*parentView.clippingFrame').cacheable(),
    valueBinding: '*parentView.colorLabel',
    fontWeight: SC.BOLD_WEIGHT,
    textAlign: SC.ALIGN_CENTER
  }),

  revealButtonView: SC.ButtonView.design({
    isVisibleBinding: '*parentView.useRevealButton',
    layout: { height: 24, bottom: 0, left: 5, right: 5 },
    title: "Reveal",
    isEnabledBinding: '*parentView.revealButtonEnabled',
    action: "revealClicked",
    target: "Lab.statechart"
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

    if (this.get('glow')) {
      var width = this.get('layout').width,
          glow = width >= 200 ? 'glow' : width >= 170 ? 'glow-180' : 'glow-82';
      this.set('classNames', ['sc-view organism-view opaque '+glow]);
    } else {
      this.set('classNames', ['sc-view organism-view opaque']);
    }

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
    SC.RunLoop.begin();
    this._checkForNullDragon();
    this._setClassNames();
    this.setPath('imageView.layerNeedsUpdate', YES);
    SC.RunLoop.end();
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
      // SC.Logger.info("Dragon was null!");
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

  insideGridView: function() {
    return !!this.get('parentView') && ""+this.get('parentView').constructor === 'SC.GridView';
  },

  // // drag methods:
  mouseDownEvent: null,
  mouseDown: function(evt) {
    if (this.insideGridView()){
      // we are in a grid view, don't need to do anything
      return NO;
    }

    var selection = SC.SelectionSet.create();
    selection.addObject(this.get('content'));
    Geniverse.allSelectedDragonsController.set('selection', selection);

    this.set('mouseDownEvent', evt);
    return YES;
  },

  isDragging: NO,

  dragDidEnd: function(drag, loc, op) {
    this.set('isDragging', NO);
  },

  mouseDragged: function(evt) {
    if (this.get('canDrag') && !this.get('isDragging')){
      var x = SC.Drag.start({
        event: this.get('mouseDownEvent'),
        source: this,
        dragView: this,
        ghost: NO,
        slideBack: YES,
        ghostActsLikeCursor: NO
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

  touchStart: function(touch) {
    this.set('touchStartEvent', touch);
    return YES;
  },

  touchesDragged: function(evt, touches) {
    if (!this.get('isDragging') &&
        (this.get('canDrag') || this.insideGridView())){
      var x = SC.Drag.start({
        event: this.get('touchStartEvent'),
        source: this,
        dragView: this,
        ghost: NO,
        slideBack: YES,
        ghostActsLikeCursor: NO
      });
      this.set('isDragging', YES);
    }
  },

  touchEnd: function(touch) {
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
        if (dragon.get('isEgg')){
          var stableCount = Geniverse.stableOrganismsController.get('length');
          var stableSize = Geniverse.stableOrganismsController.get('maxSize');
          if (stableCount >= stableSize){
            Lab.logController.logEvent(Lab.EVENT.KEPT_OFFSPRING_FAILED,
              {alleles: dragon.get('alleles'), draggedToParentSlot: true});
            SC.AlertPane.error("Can't move dragon",
              "Your stable is full. If you want to save more dragons, sell some to the marketplace");
            return;
          }
          // move dragon from eggs controller to stable if our stable isn't full already
          Lab.logController.logEvent(Lab.EVENT.KEPT_OFFSPRING,
            {alleles: dragon.get('alleles'), draggedToParentSlot: true});
          dragon.set('isEgg',NO);
          var oldEggs = Geniverse.eggsController.get('content');
          Geniverse.eggsController.set('content', oldEggs.without(dragon));
        }
        Lab.logController.logEvent(Lab.EVENT.SELECTED_PARENT,
          {alleles: dragon.get('alleles'), sex: dragon.get('sex')});
        this.get('parentView').set(this.get('parent'), dragon);
        this.get('parentView').set('child', null);   //Geniverse.NO_DRAGON);
      SC.RunLoop.end();
    } else {
      SC.RunLoop.begin();
        this.set('content', dragon);
      SC.RunLoop.end();
    }

    if (this.get('trackScore')){
      Geniverse.scoringController.incrementScore(1);
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
    if (this._isNull(dragon) || (dragon.get('bred') && !this.get('acceptsOffspringDrop'))) {
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
