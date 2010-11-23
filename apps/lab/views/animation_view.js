// ==========================================================================
// Project:   Lab - AnimationView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/**
 * A SproutCore view of Raphael-based jQuery plugin animation for Geniverse from Bocoup.
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Lab */

Lab.AnimationView = SC.View.extend(
/** @scope Lab.AnimationView.prototype */ {
  /**
   * Default URL of JSON data which can be set at design time.
   */
  jsondataurl: static_url('chromosomes.json'),

  /**
   * Default identifying classname for an animation which can be set at design time.
   * Don't forget to add it to classNames.
   */
  className: 'genanimation',

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
    SC.Logger.log('loading animation:',this);
    var jsonDataUrl = this.get('jsondataurl');
    var className = this.get('className');
    SC.Logger.log('looking for className:',className);
    var geniverseAnimation = $("."+className);
    SC.Logger.log('found jQuery selector geniverseAnimation:',geniverseAnimation);
    if(geniverseAnimation.length > 0){
      geniverseAnimation.geniverse(jsonDataUrl, {
        segMoveSpeed: 1,
        loaded : function(){
          SC.Logger.log('loaded animantion:',geniverseAnimation)
        },
        animationComplete : function(){
          SC.Logger.log('completed animation:',geniverseAnimation)
        }
      });
    }
  }

});
