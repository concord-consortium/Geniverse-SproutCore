// ==========================================================================
// Project:   Geniverse.challengePoolController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.challengePoolController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Geniverse.challengePoolController.prototype */ {
  selectionBinding: 'Geniverse.allSelectedDragonsController.selection'
  // TODO: Add your own code here.

}) ;
