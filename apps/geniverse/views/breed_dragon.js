// ==========================================================================
// Project:   Geniverse.BreedDragonView
// Copyright: ©2010 My Company, Inc.
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

	childViews: 'fatherView motherView childView fatherLabel motherLabel childLabel breedButtonView'.w(),
	
  showChildView: YES,
	
	initParentsImmediately: YES,
	initParentsImmediatelyBinding: 'Geniverse.breedDragonController.initParentsImmediately',
	
	fatherView: Geniverse.OrganismView.design({
		layout: {top: 18, right: 0, width: 180, height: 150},
	  classNames: "fatherView",
	  organismBinding: "*parentView.father",
	  parent: "father",
	  sex: 0,
		isDropTarget: YES
	}),
	
	fatherLabel: SC.LabelView.design({
		layout: {top: 0, right: 70, width: 40, height: 18},
		classNames: "fatherLabel",
		value: "Father",
		sex: 1
	}),
	
	motherView: Geniverse.OrganismView.design({
		layout: {top: 18, left: 0, width: 180, height: 150},
	  classNames: "motherView",
	  organismBinding: "*parentView.mother",
	  parent: "mother",
	  sex: 1,
		isDropTarget: YES
	}),
	
	motherLabel: SC.LabelView.design({
		layout: {top: 0, left: 70, width: 40, height: 18},
		classNames: "motherLabel",
		value: "Mother"
	}),
	
	childView: Geniverse.OrganismView.design({
		layout: {bottom: 20, centerX: 0, width: 180, height: 150},
	  classNames: "childView",
	  organismBinding: "*parentView.child",
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
     return !!this.get('parentView').get('child') && this.get('parentView').get('showChildView');
    }.property("*parentView.child")
	}),
	
	breedButtonView: SC.ButtonView.design({
		layout: { centerX: 0, bottom: 0, width: 100, height: 24 },
		target: 'Geniverse.breedDragonController',
		action: "breed",
		isBreedingBinding: 'Geniverse.breedDragonController.isBreeding',
		title: function () {
		  return this.get('isBreeding') ? 'Breeding...' :  'Breed';
		}.property('isBreeding').cacheable()
	}),
	
	_isDragon: function(obj) {
	  if (obj === null || typeof(obj) == 'undefined' || obj === Geniverse.NO_DRAGON) {
	    return NO;
    }
    return YES;
	},
	
	_fatherDidChange: function() {
	  if (this._isDragon(this.get('mother')) == YES && this._isDragon(this.get('father')) == YES) {
	    this.setPath('breedButtonView.isEnabled', YES);
	  } else {
	    this.setPath('breedButtonView.isEnabled', NO);
	  }
	}.observes('father'),
	
	_motherDidChange: function() {
	  if (this._isDragon(this.get('mother')) == YES && this._isDragon(this.get('father')) == YES) {
	    this.setPath('breedButtonView.isEnabled', YES);
	  } else {
	    this.setPath('breedButtonView.isEnabled', NO);
	  }
	}.observes('mother'),
	

	
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
