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

Geniverse.chromosomeToolController = SC.Controller.create(
/** @scope Geniverse.chromosomeToolController.prototype */ {
  dragon: null,
  _pane: Geniverse.PopupChromosomeView,
  paneInstance: null,

  showPane: function() {
    SC.RunLoop.begin();
    this.closePane();
    this.paneInstance = this._pane.create();
    Geniverse.chromosomeToolController.notifyPropertyChange('dragon');
    this.paneInstance.append();
    SC.RunLoop.end();
  },

  closePane: function() {
    if (!!this.paneInstance) {
      this.paneInstance.remove();
      this.paneInstance.destroy();
    }
  }

}) ;
