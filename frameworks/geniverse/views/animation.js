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
  jsondataurl: static_url('chromosomes.json'),

  /**
   * Default id for the animation's element in the DOM which can be set at design time.
   */
  layerId: 'genanimation',

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
  owner: 'offspring',

  classNames: 'genanimation',

  childViews: 'cell'.w(),
  cell: SC.View.design({
    classNames: 'cell'
  }),

  /**
   * In theory all DOM setup could be done in didCreateLayer()
   * as you already have a DOM element instantiated.
   * However there are cases where the element has to be first appended to the
   * Document because there is either a bug on the browser or (as in this case)
   * you are using plugins (like Raphael) which objects are not instantiated
   * until you actually append the element to the DOM. This will allow you to
   * setup the Raphael-based jQuery plugin animation.
   */
  didAppendToDocument :function(){
    console.log('loading animation:',this);
    var jsonDataUrl = this.get('jsondataurl');
    console.log('jsonDataUrl:',jsonDataUrl);
    var id = this.get('layerId');
    console.log('looking for id:',id);
    var geniverseAnimation = $("#"+id);
    console.log('found jQuery selector geniverseAnimation:',geniverseAnimation);
    if(geniverseAnimation.length > 0){
      geniverseAnimation.geniverse(jsonDataUrl, {
        loaded : function(){
          console.log('loaded animation:',geniverseAnimation)
        },
        animationComplete : function(){
          console.log('completed animation:',geniverseAnimation)
        }
      });
    }
  }

});
