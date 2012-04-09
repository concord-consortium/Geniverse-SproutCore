// ==========================================================================
// Project:   Geniverse.challengePoolMalesController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.challengePoolMalesController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Geniverse.challengePoolMalesController.prototype */ {
  contentBinding: 'Geniverse.challengePoolController.males',
  selectionBinding: 'Geniverse.challengePoolController.selection'
});
