// ==========================================================================
// Project:   Geniverse.challengePoolFemalesController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.challengePoolFemalesController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Geniverse.challengePoolFemalesController.prototype */ {
  contentBinding: 'Geniverse.challengePoolController.females',
  selectionBinding: 'Geniverse.challengePoolController.selection'
});
