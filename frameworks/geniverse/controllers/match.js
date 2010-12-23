// ==========================================================================
// Project:   Geniverse.matchController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  This controller containes the list of authored dragons that a student
  is attempting to match.

  @extends SC.Object
*/
Geniverse.matchController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Geniverse.challengePoolController.prototype */ {
  
  allowsSelection: NO

}) ;
