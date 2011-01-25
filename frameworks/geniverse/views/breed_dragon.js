// ==========================================================================
// Project:   Geniverse.BreedDragonView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse, generateDragonWithSex */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('views/organism');
Geniverse.BreedDragonView = SC.View.extend(
/** @scope Geniverse.BreedDragonView.prototype */ {

  classNames: ['breed-organism-view'],

  motherBinding: 'Geniverse.breedDragonController.mother',

  fatherBinding: 'Geniverse.breedDragonController.father',

  childBinding: 'Geniverse.breedDragonController.child',

  childViews: 'fatherView motherView childView childLabel breedButtonView breedCountLabel'.w(),

  hasParentsBinding: 'Geniverse.breedDragonController.hasParents',

  showChildView: YES,
  showCount: YES,

  // init: function() {
  //   sc_super();
  //   Geniverse.breedDragonController.set('numberOfOffspring', 20);
  // },

  breedCountLabel: SC.LabelView.design({
    layout: {top: 3, left: 115, width: 60, height: 18},
    classNames: "childLabel",
    countBinding: 'Geniverse.breedDragonController.breedCount',
    isVisibleBinding: '*parentView.showCount',
    value: function() {
      return "C: " + this.get('count');
    }.property('count').cacheable()
  }),

  breedButtonView: SC.ButtonView.design({
    layout: { top: 0, left: 10, width: 100, height: 24 },
    target: 'Geniverse.breedDragonController',
    action: "breed",
    isBreedingBinding: 'Geniverse.breedDragonController.isBreeding',
    hasParentsBinding: 'Geniverse.breedDragonController.hasParents',
    isEnabled: function() {
      return (this.get('hasParents') && !this.get('isBreeding'));
    }.property('hasParents', 'isBreeding').cacheable(),

    title: function () {
      return this.get('isBreeding') ? 'Breeding...' :  'Breed';
    }.property('isBreeding').cacheable()
  }),


  motherView: Geniverse.OrganismView.design({
    layout: {top: 30, right: 0, width: 150, height: 150},
    classNames: "sc-theme motherView opaque".w(),
    contentBinding: "*parentView.mother",
    parent: "mother",
    label: "mother",
    showLabel: true,
    sex: 1,
    isDropTarget: YES
  }),

  fatherView: Geniverse.OrganismView.design({
    layout: {bottom: 0, right: 0, width: 150, height: 150},
    classNames: "fatherView opaque".w(),
    contentBinding: "*parentView.father",
    parent: "father",
    label: "father",
    showLabel: true,
    sex: 0,
    isDropTarget: YES
  }),


  childView: Geniverse.OrganismView.design({
    layout: {bottom: 20, centerX: 0, width: 180, height: 150},
    classNames: "childView",
    contentBinding: "*parentView.child",
    isVisibleBinding: "*parentView.showChildView"
  }),

  childLabel: SC.LabelView.design({
    layout: {centerX: 0, bottom: 170, width: 40, height: 18},
    classNames: "childLabel",
    value: "Child",
    woo: function() {
      this.propertyDidChange('isVisible');
    }.observes("*parentView.child"),
    isVisible: function() {
      if (!!this.get('parentView')) {
        return !!this.get('parentView').get('child') && this.get('parentView').get('showChildView');
      }
      return NO;
    }.property("*parentView.child")
  }),

  viewDidResize: function() {
    this._resize_children();
  },

  _resize_children: function() {
    var width_ratio = 188/144;
    var height_ratio = 144/188;

    var width = this.get('layer').offsetWidth;
    var height = this.get('layer').offsetHeight;

    var new_width = width/2;
    var new_height = (height-(24+18+18))/2;

    var calc_width = new_height * width_ratio;
    var calc_height = new_width * height_ratio;

    var actual_w = new_width;
    var actual_h = calc_height;

    if (calc_height > new_height) {
      actual_h = new_height;
      actual_w = calc_width;
    }

    this._adjust_size(this.get('fatherView'), actual_w, actual_h);
    this._adjust_size(this.get('motherView'), actual_w, actual_h);
    this._adjust_size(this.get('childView'), actual_w, actual_h);
  },

  _adjust_size: function(view, width, height) {
    view.adjust('width', width);
    view.adjust('height', height);
  }


});
