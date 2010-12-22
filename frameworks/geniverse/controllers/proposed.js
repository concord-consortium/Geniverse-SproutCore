// ==========================================================================
// Project:   Geniverse.proposedController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  This controller contains the list of dragons that a user has chosen ("proposed") that
  they think matches the list in the matchController

  @extends SC.Object
*/
Geniverse.proposedController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Geniverse.challengePoolController.prototype */ {
  selectionBinding: 'Geniverse.allSelectedDragonsController.selection'
  // TODO: Add your own code here.

}) ;
