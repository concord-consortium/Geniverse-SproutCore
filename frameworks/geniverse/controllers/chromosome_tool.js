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
sc_require('views/popup_chromosome');

Geniverse.chromosomeToolController = SC.ObjectController.create(
/** @scope Geniverse.chromosomeToolController.prototype */ {
  dragon: null,
  pane: Geniverse.PopupChromosomeView,
  
  showPane: function() {
    if (!this.get('pane').get('isVisibleInWindow')){
      this.get('pane').append();
    }
  }

}) ;
