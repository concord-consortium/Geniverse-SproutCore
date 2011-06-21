// ==========================================================================
// Project:   Lab.helpController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */
sc_require('views/help');

/** @class

  Loads, shows, and manages content for a pop-up help view

  @extends SC.ObjectController
  @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
*/
Lab.navigationController = SC.ObjectController.create(
/** @scope Lab.helpController.prototype */ {
  
  showPreviousButton: NO,
  
  showNextButton: NO,
  
  blockNextButton: NO,        // red arrow indicating progress is blocked
  
}) ;
