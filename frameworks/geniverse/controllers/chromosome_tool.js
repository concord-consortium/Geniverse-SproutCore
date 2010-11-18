// ==========================================================================
// Project:   Geniverse.chromosomeToolController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
sc_require('views/dragon_genome');

Geniverse.chromosomeToolController = SC.ObjectController.create(
/** @scope Geniverse.chromosomeToolController.prototype */ {
  dragon: null,
  pane: null,
  
  chromosomeView: null,
  
  init: function() {
    this.set('chromosomeView', Geniverse.DragonGenomeView.create({
      layout: { left: 10, top: 10, width: 430, height: 400 },
      isEditable: NO,
      showGenerateNewDragon: NO
    }));
  },
  
  showPane: function() {
    var pane = SC.PanelPane.create({
      layout: { width: 440, height: 410, centerX: 0, centerY: 0 },
      contentView: SC.View.extend({
        childViews: 'chromosomeView hideButton'.w(),
      
        hideButton: SC.ButtonView.extend({
          layout: {bottom: 5, right: 5, width: 80, height: 24},
          title: "Close",
          action: "remove",
          target: "Geniverse.chromosomeToolController.pane"
        }),
      
        chromosomeView: Geniverse.chromosomeToolController.chromosomeView
      })
    });
    
    pane.append();
    this.set('pane', pane);
  },
  
  dragonDidChange: function() {
    this.setPath('chromosomeView.ignoreUpdate', NO);
    this.setPath('chromosomeView.dragon', this.get('dragon'));
    this.setPath('chromosomeView.ignoreUpdate', YES);
  }.observes('dragon')

}) ;
