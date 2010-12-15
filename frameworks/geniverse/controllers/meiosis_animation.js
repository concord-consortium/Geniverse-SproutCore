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
    if(alleles){
      //console.log("alleles:",alleles);
      var arr = alleles.split(',');
      //console.log("arr:",arr);
      var totalNumAlleles = arr.length;
      if(totalNumAlleles>0){
        var allelesPerChromosome = Math.round(totalNumAlleles/this.NUM_CHROMOSOMES);
        console.log("allelesPerChromosome",allelesPerChromosome);
        var chromosomesArr = []; // This will eventually have this.NUM_CHROMOSOMES of elements
        //console.log("made new chromosomesArr",chromosomesArr);
        var allelesArr = []; // For the current set of alleleJSONelements
        //console.log("made new allelesArr",allelesArr);
        //console.log("json:",json);
        for(var index = 0; index < totalNumAlleles; index++){
          var allele = arr[index].split(':');
          //console.log("allele:",allele);
          var sex = allele[0];
          if(sex == 'a') {
            sex = 'male';
          }else{
            sex = 'female';
          }
          //console.log("sex:",sex);
          var gene = allele[1];
          //console.log("gene",gene);
          var alleleJSONelement = {
            "sex": sex,
            "gene": gene
          }
          //console.log("alleleJSONelement",alleleJSONelement);
          allelesArr.push(alleleJSONelement);
          //console.log("allelesArr",allelesArr);
          if((allelesArr.length == allelesPerChromosome) || ((index+1) == totalNumAlleles)){
            // Use this allelesArr object and then make a new instance
            chromosomesArr.push({"alleles":allelesArr});
            //console.log("chromosomesArr",chromosomesArr);
            allelesArr = [];
            //console.log("made new allelesArr",allelesArr);
          }
        }
      }
      var json = {
        "chromosomes": chromosomesArr
      }
      //console.log("returning json:\n",json);
      return json;
    }
    return null;
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
