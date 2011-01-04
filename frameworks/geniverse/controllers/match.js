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

sc_require('views/match');
sc_require('views/popup_match');

Geniverse.matchController = SC.ArrayController.create(
  SC.CollectionViewDelegate,
/** @scope Geniverse.challengePoolController.prototype */ {
  
  allowsSelection: NO,
  
  pane: Geniverse.PopupMatchView,
  
  showPane: function() {
    var width = (Geniverse.matchController.get('length') * 130);
    width  = width < 130 ? 130 : width;
    this.get('pane').get('layout').width = 260;
    this.get('pane').layoutDidChange();
    if (!this.get('pane').get('isVisibleInWindow')){
      this.get('pane').append();
    }
  }

}) ;
