// ==========================================================================
// Project:   Geniverse.ChromosomeToolView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Geniverse.ChromosomeToolView = SC.ButtonView.extend(
/** @scope Geniverse.ChromosomeToolView.prototype */ {
  titleMinWidth: 0,
  title: "",
  icon: sc_static('magnifying-glass.png'),
  classNames: 'chromosome-tool',
  toolTip: "Use this to view parent, offspring, and stabled drake chromosomes.",

  selectionBinding: 'Geniverse.allSelectedDragonsController.selection',

  action: function() {
    var selectionSet = this.get('selection');
    if (selectionSet.get('length') > 1) {
      SC.AlertPane.info("", 'You can only view the chromosomes of one dragon at a time!');
    } else {
      Geniverse.chromosomeToolController.showPane();
    }
  },

  selectionDidChange: function() {
    var selectionSet = this.get('selection');
    if (selectionSet.get('length') < 1 || selectionSet.get('length') > 1) {
      Geniverse.chromosomeToolController.set('dragon', null);
    } else {
      var dragon = selectionSet.firstObject();
      Geniverse.chromosomeToolController.set('dragon', dragon);
    }
  }.observes('selection')

});
