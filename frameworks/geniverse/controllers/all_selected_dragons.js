// ==========================================================================
// Project:   Geniverse.allSelectedDragonsController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  All dragon array controllers can bind their selection to this.
  That way there will only be one selection set across all dragons controllers, and
  dragons in multiple controllers will be selected together.

  For example, we bind the selected parent dragon to this, and if a parent is
  selected, the identical dragon in any other set (Challenge, Stable) will also
  become selected.

  @extends SC.Object
*/
Geniverse.allSelectedDragonsController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Geniverse.challengePoolController.prototype */ {

  // TODO: Add your own code here.

}) ;
