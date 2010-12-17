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
    if(alleles !== null && typeof(alleles) != 'undefined'){
      var parsed = Geniverse.chromosomeController.processAlleleString(alleles);
      var chromosomesArr = [];
      for (var c = 0; c < parsed.length; c++) {
        var chromo = parsed[c];
        
        for (var s = 0; s < chromo.length; s++) {
          var side = chromo[s];
          var allelesArr = [];
          for (var a = 0; a < side.length; a++) {
            var allele = {
              "sex": (s === 0 ? "female" : "male"),
              "gene": side[a]
            };
            allelesArr.push(allele);
          }
          chromosomesArr.push({ alleles: allelesArr});
        }
      }
      
      var json = { chromosomes: chromosomesArr };
      return json;
    }
    return null;
  },
  
  JSONToAlleles: function(motherJson, fatherJson) {
    var outString = "";
    
    var motherString = this._JSONToAlleles(motherJson, "a:");
    var fatherString = this._JSONToAlleles(fatherJson, "b:");
    
    return motherString + "," + fatherString;
  },
  
  _JSONToAlleles: function(json, prefix) {
    var outString = "";
    
    for (var i = 0; i < json.chromosomes.length; i++) {
      var chromo = json.chromosomes[i];
      for (var j = 0; j < chromo.alleles.length; j++) {
        outString += prefix + chromo.alleles[j].gene;
      }
    }
    return outString;
  },

  showPane: function() {
    this.set('pane', Geniverse.PopupAnimationView.create());
    var _pane = this.get('pane');
    //console.log("meiosisAnimationController.pane:",_pane);
    var _dragon = this.get('dragon');
    //console.log("meiosisAnimationController.dragon:",_dragon);
    var jsonData = this.allelesToJSON(_dragon.get('alleles'));
    //console.log("jsonData:",jsonData);
    _pane.contentView.meiosisView.set('jsondataurl', jsonData);
    //console.log("_pane.contentView.meiosisView.jsondataurl:",_pane.contentView.meiosisView.get('jsondataurl'));
    if (!_pane.get('isVisibleInWindow')){
      _pane.append();
      this.set('isEnabledButton', NO);
    }
  },

  close: function (){
    var receiver = this.pane.remove();
    //console.log("this.pane.remove() returned receiver:", receiver);
    this.set('isEnabledButton', YES);
  }
}) ;
