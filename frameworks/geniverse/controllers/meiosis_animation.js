// ==========================================================================
// Project:   Geniverse.meiosisAnimationController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */
sc_require('views/animation');
sc_require('views/popup_animation');

/** @class

  Shows a pop-up meiosis animation instance for a selected dragon
 @author  Dr. Baba Kofi Weusijana <kofi@edutek.net>
 @extends SC.ObjectController
 */

Geniverse.meiosisAnimationController = SC.ObjectController.create(
  /** @scope Geniverse.meiosisAnimationController.prototype */ {
  NUM_CHROMOSOMES: 6,
  dragon: null,
  pane: null,
  isEnabledButton: YES,

  allelesToJSON: function (alleles) {
    if (alleles) {
      var arr = alleles.split(',');
      var totalNumAlleles = arr.length;
      if (totalNumAlleles > 0) {
        var allelesPerChromosome = Math.round(totalNumAlleles / this.NUM_CHROMOSOMES);
        SC.Logger.log("allelesPerChromosome", allelesPerChromosome);
        var chromosomesArr = []; // This will eventually have this.NUM_CHROMOSOMES of elements
        var allelesArr = []; // For the current set of alleleJSONelements
        for (var index = 0; index < totalNumAlleles; index++) {
          var allele = arr[index].split(':');
          var sex = allele[0];
          if (sex == 'a') {
            sex = 'male';
          } else {
            sex = 'female';
          }
          var gene = allele[1];
          var alleleJSONelement = {
            "sex": sex,
            "gene": gene
          }
          allelesArr.push(alleleJSONelement);
          if ((allelesArr.length == allelesPerChromosome) || ((index + 1) == totalNumAlleles)) {
            // Use this allelesArr object and then make a new instance
            chromosomesArr.push({"alleles":allelesArr});
            allelesArr = [];
          }
        }
      }
      var json = {
        "chromosomes": chromosomesArr
      }
      return json;
    }
    return null;
  },

  showPane: function() {
    this.set('pane', Geniverse.PopupAnimationView.create());
    var _pane = this.get('pane');
    var _dragon = this.get('dragon');
    var jsonData = this.allelesToJSON(_dragon.get('alleles'));
    _pane.contentView.meiosisView.set('jsondataurl', jsonData);
    if (!_pane.get('isVisibleInWindow')) {
      _pane.append();
      this.set('isEnabledButton', NO);
    }
  },

  close: function () {
    var receiver = this.pane.remove();
    //SC.Logger.log("this.pane.remove() returned receiver:", receiver);
    this.set('isEnabledButton', YES);
  }
});
