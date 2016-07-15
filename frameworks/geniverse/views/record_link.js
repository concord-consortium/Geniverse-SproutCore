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
  tabView: null,

  dragonsObserver: function() {
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
  }.observes('*content.[]', '*tabView.nowShowing', '*tabView.nowShowing.traitPulldown.value'),

  superObserver: function() {
    var _this = this;
    window.triggerRecordLinkUpdate = function() {
      _this.dragonsObserver();
    }
  }.observes('*content.[]', '*tabView.nowShowing', '*tabView.nowShowing.traitPulldown.value'),

  updateLink: function(dragon) {
    if (dragon.get('status') & SC.Record.READY === SC.Record.READY) {
      dragon.removeObserver('status', this.updateLink);
      var dbUrl = dragon.get('id');       // e.g. /rails/dragons/11455
      if (!!dbUrl){
        var recordLink = Geniverse.railsBackendHostOnly  + dbUrl.replace('dragons', 'breedingRecordsShow');
        recordLink += this.getStatisticsPart();
        this.set('value', "<a href='"+recordLink+"' target='_blank'>Link to breeding record</a>");
        this.set('isVisible', YES);
      }
    }
  },

  getStatisticsPart: function() {
    var link = "";
    if (!!this.get('tabView') && this.getPath('tabView.nowShowing') instanceof Geniverse.StatsView) {
      trait = this.getPath('tabView.nowShowing.traitPulldown.value');
      link += "?stats[trait]="+encodeURIComponent(trait);

      var dragonGroups = Geniverse.statisticsController.get('dragonGroups');
      var cumulativeCounts = Geniverse.statisticsController.get('cumulativeCounts');
        // we move this into an array so we can sort it
      var allCharacteristics = [];
      var characteristic;
      for (characteristic in cumulativeCounts[trait]){
        allCharacteristics.push(characteristic);
      }
      allCharacteristics.sort();
      for (var i = 0; i < allCharacteristics.length; i++){
        characteristic = allCharacteristics[i];
        if (!dragonGroups[trait][characteristic]) {
          dragonGroups[trait][characteristic] = {};
          dragonGroups[trait][characteristic].Male = 0;
          dragonGroups[trait][characteristic].Female = 0;
        }
        link += "&stats[all][" + encodeURIComponent(characteristic) + "][male]=" + cumulativeCounts[trait][characteristic].Male;
        link += "&stats[all][" + encodeURIComponent(characteristic) + "][female]=" + cumulativeCounts[trait][characteristic].Female;
        link += "&stats[current][" + encodeURIComponent(characteristic) + "][male]=" + dragonGroups[trait][characteristic].Male;
        link += "&stats[current][" + encodeURIComponent(characteristic) + "][female]=" + dragonGroups[trait][characteristic].Female;
      }
    }
    return link;
  },

  isVisible: NO,

  value: "",

  escapeHTML: NO

});
