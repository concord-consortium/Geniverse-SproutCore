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
  _paneInstance: null,

  showPane: function() {
    SC.RunLoop.begin();
    this.closePane();
    this._paneInstance = this._pane.create();
    Geniverse.chromosomeToolController.notifyPropertyChange('dragon');
    this._paneInstance.append();
    SC.RunLoop.end();
  },

  closePane: function() {
    if (!!this._paneInstance) {
      this._paneInstance.remove();
      this._paneInstance.destroy();
    }
  }

}) ;
