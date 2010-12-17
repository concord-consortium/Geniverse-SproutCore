// ==========================================================================
// Project:   Geniverse - AnimationView
// Copyright: 2010 Concord Consortium
// ==========================================================================
/**
 * A SproutCore view of Raphael-based jQuery plugin animation for Geniverse from Bocoup.
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Geniverse */

Geniverse.AnimationView = SC.View.extend(
/** @scope Geniverse.AnimationView.prototype */ {
  /**
   * Default layout which can be set at design time.
   */
  layout: { centerX: 0, centerY: 0, height: 400, width: 400 },

  /**
   * Default URL of JSON data which can be set at design time.
   */
  jsondataurl: null,
  
  jsondataurlDidChange: function() {
    this.drawAnimationOnceAppended();
  }.observes('jsondataurl'),
  
  /**
   * optional object which represents the json data
   */
  jsonData: null,
  
  jsonDataDidChange: function() {
    this.drawAnimationOnceAppended();
  }.observes('jsonData'),

  /**
   * Default id for the animation's element in the DOM which can be set at design time.
   */
  // layerId: 'genanimation',

  /**
   * The mode of the animation. Possible values are 'parent' or 'offspring'.
   * The default value is 'offspring'.
   */
  mode: 'offspring',

  /**
   * A unique id for each dragon entity in which the chromosomes are contained.
   * Possible values are 'father', 'mother' and 'offspring'.
   * The default value is 'offspring'.
   */
  meiosisOwner: 'offspring',
  
  dragon: null,
  dragonDidChange: function() {
    SC.Logger.log("setting json data for dragon");
    this.set('jsonData', Geniverse.meiosisAnimationController.allelesToJSON(this.getPath('dragon.alleles')) );
  }.observes('dragon'),
  
  motherJson: null,
  
  fatherJson: null,
  
  jsonDidChange: function() {
    var mother = this.get('motherJson');
    var father = this.get('fatherJson');
    if (mother !== null && father !== null) {
      this.combineMotherFatherJson(mother, father);
    }
  }.observes('motherJson', 'fatherJson'),
  
  combineMotherFatherJson: function (mother, father) {
    var combined = { chromosomes: [] };
    combined.chromosomes = mother.chromosomes.concat(father.chromosomes);
    this.set('jsonData', combined);
  },
  
  animationLoaded: function() {
    SC.Logger.log('loaded animation');
  },
  
  animationComplete: function() {
    SC.Logger.log('completed animation');
  },
  
  gameteJson: null,
  gameteSelected: function(data) {
    SC.Logger.info("gamete selected");
    SC.Logger.dir(data);
    SC.RunLoop.begin();
    this.set('gameteJson', data);
    SC.RunLoop.end();
  },

  hasAppended: NO,
  /**
   * In theory all DOM setup could be done in didCreateLayer()
   * as you already have a DOM element instantiated.
   * However there are cases where the element has to be first appended to the
   * Document because there is either a bug on the browser or (as in this case)
   * you are using plugins (like Raphael) which objects are not instantiated
   * until you actually append the element to the DOM. This will allow you to
   * setup the Raphael-based jQuery plugin animation.
   */
  didAppendToDocument: function() {
    this.set('hasAppended', YES);
    if (this.get('jsonData') !== null || this.get('jsondataurl') !== null) {
      this.drawAnimation();
    } // otherwise depend on observers on those properties
  },
  
  drawAnimationOnceAppended: function() {
    var self = this;
    function doDrawAnimation() {
      self.removeObserver('hasAppended', doDrawAnimation);
      self.drawAnimation();
    }
    
    if (this.get('hasAppended')) {
      this.drawAnimation();
    } else {
      this.addObserver('hasAppended', doDrawAnimation);
    }
  },
  
  drawAnimation: function(){
    SC.Logger.log('loading animation:',this);
    var jsonData = this.get('jsonData');
    if (jsonData === null) {
      jsonData = this.get('jsondataurl');
    }
    SC.Logger.log('jsonData:',jsonData);
    var id = "#"+ this.get('layerId') + " #" + this.get('meiosisOwner');
    SC.Logger.log('looking for id:',id);
    var geniverseAnimation = $(id);
    SC.Logger.log('found jQuery selector geniverseAnimation:',geniverseAnimation);
    var options = {
      mode: this.get('mode'),
      owner: this.get('meiosisOwner'),
      segMoveSpeed: 5,
      width: 320, // FIXME
      height: 320, // FIXME
      context: this,
      loaded: this.animationLoaded,
      animationComplete: this.animationComplete,
      gameteSelected: this.gameteSelected
    };
    
    if (geniverseAnimation.length > 0){
      SC.Logger.log('calling animation init:');
      SC.Logger.dir(jsonData);
      SC.Logger.dir(options);
      geniverseAnimation.geniverse(jsonData, options);
    }
  },
  
  render: function(context, firstTime) {
      context.push('<div id="' + this.get('meiosisOwner') + '" class="meiosis ui-state-default ui-corner-all">');
			context.push('<div class="cell ui-state-default ui-corner-all"></div>');
			
			var controlContext = context.begin('div');
			controlContext.attr('class', 'controls');
			
			controlContext.push('<button class="stop" title="Stop"><img src="' + sc_static('images/meiosis_stop_small.png') + '" /></button>');
			controlContext.push('<button class="play" title="Play"><img src="' + sc_static('images/meiosis_play_small.png') + '" /></button>');
			if (this.get('mode') == 'parent') {
			  controlContext.push('<button class="swap" title="Swap Genes"><img src="' + sc_static('images/meiosis_exchange_16x16_monochrome.png') + '" /></button>');
		  }
			controlContext.push('<div class="scrub"></div>');
			controlContext.push('<div class="frame"><input type="text" value="0"></div>');
			
			controlContext.end();
			
			context.push('</div>');
  }

});
