// ==========================================================================
// Project:   Geniverse.dragonBinController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.dragonBinController = SC.ArrayController.create(
/** @scope Geniverse.dragonBinController.prototype */ {  
  content: [],
  
  isEmpty: function () {
    return this.get('length') === 0;
  }.property('[]').cacheable(),
  
  clearDragons: function () {
    this.set('content', []);
  }
}) ;
