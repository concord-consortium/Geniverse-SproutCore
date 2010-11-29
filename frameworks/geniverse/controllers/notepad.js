// ==========================================================================
// Project:   Geniverse.notepadController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  Shows and manages content for a pop-up notepad

  @extends SC.ObjectController
  @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
*/
sc_require('views/notepad');

Geniverse.notepadController = SC.ObjectController.create(
/** @scope Geniverse.notepadController.prototype */ {
  content: "",
  pane: Geniverse.NotepadView,
  
  showPane: function() {
    if (!this.get('pane').get('isVisibleInWindow')){
      this.get('pane').append();
    }
  }

}) ;
