// ==========================================================================
// Project:   Geniverse.AnimationButtonView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  // TODO: (Document Your View Here)
  @author  Dr. Baba Kofi Weusijana <kofi@edutek.net>
  @extends SC.ButtonView
*/
Geniverse.AnimationButtonView = SC.ButtonView.extend(
/** @scope Geniverse.AnimationButtonView.prototype */ {
  titleMinWidth: 0,
  title: "",
  icon: sc_static('magnifying-glass.png'),
  classNames: 'animation-button',

  action: function() {
    var selectionSet = this.get('selection');
    if (selectionSet.get('length') < 1) {
      SC.AlertPane.info("", 'You must select a dragon first!');
    } else if (selectionSet.get('length') > 1) {
      SC.AlertPane.info("", 'You can only view the chromosomes of one dragon at a time!');
    } else {
      Geniverse.meiosisAnimationController.showPane();
    }
  },

  // FIXME: These three selection bindings are silly.
  // Will turn into an array, once I work out how...
  selectionDidChange: function() {
    var selectionSet = this.get('selection');
    if (selectionSet.get('length') < 1 || selectionSet.get('length') > 1) {
      Geniverse.meiosisAnimationController.set('dragon', null);
    } else {
      var dragon = selectionSet.firstObject();
      Geniverse.meiosisAnimationController.set('dragon', dragon);
    }
  }.observes('selection'),

  selection1DidChange: function() {
    var selectionSet = this.get('selection1');
    if (selectionSet.get('length') < 1 || selectionSet.get('length') > 1) {
      Geniverse.meiosisAnimationController.set('dragon', null);
    } else {
      var dragon = selectionSet.firstObject();
      Geniverse.meiosisAnimationController.set('dragon', dragon);
    }
  }.observes('selection1'),

  selection2DidChange: function() {
    var selectionSet = this.get('selection2');
    if (selectionSet.get('length') < 1 || selectionSet.get('length') > 1) {
      Geniverse.meiosisAnimationController.set('dragon', null);
    } else {
      var dragon = selectionSet.firstObject();
      Geniverse.meiosisAnimationController.set('dragon', dragon);
    }
  }.observes('selection1')

});
