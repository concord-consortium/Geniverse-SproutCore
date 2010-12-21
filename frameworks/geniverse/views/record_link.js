// ==========================================================================
// Project:   Geniverse.RecordLinkView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Geniverse.RecordLinkView = SC.LabelView.extend(
/** @scope Geniverse.RecordLinkView.prototype */ {
  
  contentBinding: 'Geniverse.eggsController.arrangedObjects',

  dragonsOberserver: function() {
    var dragons = this.get('content');
    if (!dragons || dragons.get('length') < 1){
      this.set('isVisible', NO);
    } else {
      var dragon = dragons.firstObject();
      
      if (dragon.get('status') & SC.Record.READY === SC.Record.READY) {
        this.updateLink(dragon);
      } else {
        dragon.addObserver('status', this, this.updateLink);
      }
    }
  }.observes('*content.[]'),
  
  updateLink: function(dragon) {
    if (dragon.get('status') & SC.Record.READY === SC.Record.READY) {
      dragon.removeObserver('status', this.updateLink);
      var dbUrl = dragon.get('id');       // e.g. /rails/dragons/11455
      if (!!dbUrl){
        var recordLink = dbUrl.replace('dragons', 'breedingRecordsShow');
        this.set('value', "<a href='"+recordLink+"' target='_blank'>Link to breeding record</a>");
        this.set('isVisible', YES);
      }
    }
  },
  
  isVisible: NO,

  value: "",
  
  escapeHTML: NO

});
