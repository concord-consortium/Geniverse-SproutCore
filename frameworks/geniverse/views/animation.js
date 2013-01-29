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
  swapping: 'none',

  /**
   * A unique id for each dragon entity in which the chromosomes are contained.
   * Possible values are 'father', 'mother' and 'offspring'.
   * The default value is 'offspring'.
   */
  meiosisOwner: 'offspring',

  completedAnimationCalled: NO,

  trackScoreOnPlayButton: NO,

  dragon: null,
  dragonDidChange: function() {
    var dragon = this.get('dragon');
    if (dragon !== null && typeof dragon != 'undefined') {
      this.set('jsonData', Geniverse.meiosisAnimationController.allelesToJSON(dragon.get('alleles')) );
      this.set('completedAnimationCalled', NO);
    } else {
      this.set('jsonData', null);
    }
  }.observes('dragon'),

  resetMother: function () {
    if (this.get('meiosisOwner') === 'mother') {
      this.dragonDidChange();
      SC.RunLoop.begin();
      this.set('gameteJson',null);
      SC.RunLoop.end();
    }
  }.observes('Geniverse.meiosisAnimationController.retryMother'),

  resetFather: function () {
    if (this.get('meiosisOwner') === 'father') {
      this.dragonDidChange();
      SC.RunLoop.begin();
      this.set('gameteJson',null);
      SC.RunLoop.end();
    }
  }.observes('Geniverse.meiosisAnimationController.retryFather'),

  // Needed because code that clears the meiosis container is called by state change,
  // but view is not visible at that time leaving chromosomes in the contianer after
  // a round trip visit to the caselog.
  clearOnVisibliity: function () {
    if ((this.get('isVisibleInWindow') && (this.get('dragon') === null)) && (this.get('jsondataurl') === null)) {
      this.drawAnimationOnceAppended();
    }
  }.observes('isVisibleInWindow'),

  motherJson: null,

  fatherJson: null,

  jsonDidChange: function() {
    if (this.get('mode') == 'offspring') {
      var mother = this.get('motherJson');
      var father = this.get('fatherJson');
     if (mother !== null && father !== null) {
        this._combineMotherFatherJson(mother, father);
//        this.set('completedAnimationCalled', NO);
      } else {
        if (mother !== null){
          this.set('jsonData',mother);
        } else {
          if (father !== null) {
            this.set('jsonData',father);
          } else {
            this.set('jsonData',null);
          }
        }
//        this.set('jsonData',null);
      }
      this.set('completedAnimationCalled', NO);
    }
 }.observes('motherJson', 'fatherJson'),

  _combineMotherFatherJson: function (mother, father) {
    var combined = { chromosomes: [] };
    combined.chromosomes = mother.chromosomes.concat(father.chromosomes);
    this.set('jsonData', combined);
  },

  animationLoaded: function() {
    SC.Logger.log('loaded animation');
  },

  animationComplete: function() {

    if (this.get('completedAnimationCalled')){
      return;
    }
    this.set('completedAnimationCalled', YES);

    if (this.get('mode') == 'offspring') {
      var callback = function(dragon) {
        SC.Logger.info("Created offspring dragon", dragon);
        Geniverse.meiosisAnimationController.set('offspring', dragon);
        dragon.bred = true;
        dragon.mother = Geniverse.meiosisAnimationController.get('mother');
        dragon.father = Geniverse.meiosisAnimationController.get('father');
        Lab.statechart.sendAction('didBreedMeiosis');
      };
      SC.Logger.info("Animation completed.", this.get('jsonData'));
      // get the jsonData and create a new organism from that
      var alleles = Geniverse.meiosisAnimationController.JSONToAlleles(Geniverse.meiosisAnimationController.get('motherGameteJson'), Geniverse.meiosisAnimationController.get('fatherGameteJson'));
      var sex = Geniverse.meiosisAnimationController.getOffspringSex();
      Geniverse.gwtController.generateDragonWithAlleles(alleles, sex, "Meiosis Child", callback);
    }
  },

  playButtonPressed: function() {
    if (this.get('trackScoreOnPlayButton')){
      SC.RunLoop.begin();
        Geniverse.scoringController.incrementScore(1);
      SC.RunLoop.end();
    }
  },

  endButtonPressed: function(alreadyPlaying) {
    if (!alreadyPlaying && this.get('trackScoreOnPlayButton')){
      SC.RunLoop.begin();
        Geniverse.scoringController.incrementScore(1);
      SC.RunLoop.end();
    }
  },

  reachedRecombination: function(){
     Lab.statechart.sendAction('showInitialRecobinationMsg');
  },

  allelesSelected: function(){
    Lab.statechart.sendAction('showSelectTargetnMsg');
  },

  ySwapAttempted: function(){
    Lab.statechart.sendAction('showYSwapAttemptedMsg');
  },

  swapCompleted: function(){
    Lab.statechart.sendAction('showTryMoreRecombinationMsg');
  },

  gameteJson: null,
  gameteSelected: function(data) {
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
      swap: this.get('swapping'),
      owner: this.get('meiosisOwner'),
      mother: (this.get('motherJson') !== null),
      father: (this.get('fatherJson') !== null),
      segMoveSpeed: 5,
      width: 320, // FIXME
      height: 320, // FIXME
      context: this,
      loaded: this.animationLoaded,
      animationComplete: this.animationComplete,
      gameteSelected: this.gameteSelected,
      playButtonPressed: this.playButtonPressed,
      endButtonPressed: this.endButtonPressed,
      reachedRecombination: this.reachedRecombination,
      allelesSelected: this.allelesSelected,
      swapCompleted: this.swapCompleted,
      ySwapAttempted: this.ySwapAttempted
    };

    if (geniverseAnimation.length > 0){
      SC.Logger.log('calling animation init:');
      SC.Logger.dir(jsonData);
      var html = this.get('initialHtml');

      if (jsonData){
        geniverseAnimation.html(html).geniverse(jsonData, options);
      } else {
        geniverseAnimation.html(html);
      }
    }
  },

  initialHtml: function() {
    var out = "";
    out += '<div class="cell ui-state-default ui-corner-all"></div>';
    out += '<div class="controls">';

    out += '<button class="stop" title="Stop"><img src="' + sc_static('images/meiosis_stop_small.png') + '" /></button>';
    out += '<button class="play" title="Play"><img src="' + sc_static('images/meiosis_play_small.png') + '" /></button>';
    out += '<button class="end" title="End"><img src="' + sc_static('images/meiosis_end_small.png') + '" /></button>';
    if ((this.get('mode') === 'parent') && this.get('swapping')) {
      out += '<button class="swap" title="Swap Genes"><img src="' + sc_static('images/meiosis_exchange_16x16_monochrome.png') + '" /></button>';
    }
    if (this.get('mode') === 'parent') {
      out += '<button class="retry" title="Retry"><img src="' + sc_static('images/meiosis_retry_monochrome.png') + '" /></button>';
    }
    out += '<div class="scrub"></div>';
//    out += '<div class="frame"><input type="text" value="0"></div>';

    out += '</div>';
    return out;

  }.property('mode').cacheable(),

  render: function(context, firstTime) {
      context.push('<div id="' + this.get('meiosisOwner') + '" class="meiosis ui-state-default ui-corner-all">');
      context.push(this.get('initialHtml'));
      context.push('</div>');
  }

});
