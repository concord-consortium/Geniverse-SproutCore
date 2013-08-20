// ==========================================================================
// Project:   Geniverse - NotepadView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

sc_require('mixins/simple_button');

Geniverse.GenomeSolutionView = SC.PanelPane.design({
  layout: { width: 360, height: 490, centerX: 310, centerY: 50 },
  isModal:YES,

  defaultResponder: 'Lab.statechart',

  contentView: SC.View.extend({
    childViews: 'title chromosomeA1View chromosomeA2View chromosomeAXView chromosomeB1View chromosomeB2View chromosomeBXView submitButton returnButton'.w(),

    init: function() {
      sc_super();
      this.invokeLast(function() {
        this._setupPulldowns();
      });
    },

    title: SC.LabelView.design({
      layout: { centerY: -90, height: 24, left: 0, top:15, width: 260 },
      //valueBinding: this.get('titlePath'),
      value: 'I think the alleles are',
      controlSize: "info-title",
      fontWeight: SC.BOLD_WEIGHT,
      textAlign: SC.ALIGN_CENTER
    }),

    chromosomeA1View: SC.ImageView.design({
      layout: {top: 50, left: 35, width: 22 },
      value: sc_static("A1-chromosome.png"),
      classNames: ['opaque']
    }),

    chromosomeB1View: SC.ImageView.design({
      layout: {top: 50, left: 75, width: 22 },
      value: sc_static("B1-chromosome.png"),
      classNames: ['opaque']
    }),

    chromosomeA2View: SC.ImageView.design({
      layout: {top: 190, left: 35, width: 22 },
      value: sc_static("A2-chromosome.png"),
      classNames: ['opaque']
    }),

    chromosomeB2View: SC.ImageView.design({
      layout: {top: 190, left: 75, width: 22 },
      value: sc_static("B2-chromosome.png"),
      classNames: ['opaque']
    }),

    chromosomeAXView: SC.ImageView.design({
      layout: {top: 330, left: 35, width: 22 },
      value: sc_static("AX-chromosome.png"),
      classNames: ['opaque']
    }),

    chromosomeBXView: SC.ImageView.design({
      layout: {top: 330, left: 75, width: 22 },
      value: function() {
        if (Geniverse.invisibleGenomeController.getPath('content.sex') === 0){
          return sc_static("BY-chromosome.png");
        } else {
          return sc_static("BX-chromosome.png");
        }
      }.property('Geniverse.invisibleGenomeController.content'),
      classNames: ['opaque']
    }),

    submitButton: SC.ButtonView.design({
      layout: { centerX: 80, bottom: 20, height: 24, width: 130 },
      title:  "Submit",
      target: "Lab.statechart",
      action: 'submitInvisibleGenotype'
    }),

    returnButton: SC.ButtonView.design({
      layout: { centerX: -80, bottom: 20, height: 24, width: 130 },
      title:  "Return to the Lab",
      target: "Geniverse.invisibleGenomeController",
      action: 'hideGenomePane'
    }),

    _setupPulldowns: function() {
      var alleles = Geniverse.invisibleGenomeController.get('allAlleles');
      var top = 60;
      for(var i = 1; i < 4; i++){
        if (i === 3){
          i = 'X';
        }
        if (!!alleles[i] && !!alleles[i].A){
          this._setupPulldownsForChromosome(alleles[i].A, alleles[i].B, top);
          top += 140;
        }
      }
    },

    _setupPulldownsForChromosome: function(alleles, allelesB, top) {
      if (allelesB == null) allelesB = [];
      var hidden = Geniverse.invisibleGenomeController.get('hiddenGenes');
      var staticGenes = Geniverse.invisibleGenomeController.get('staticGenes');
      for (var i = 0; i < alleles.length; i++) {
        if (!~hidden.indexOf(alleles[i].toLowerCase()) && !~staticGenes.indexOf(alleles[i].toLowerCase())) {
          this._createPulldown(alleles[i], allelesB[i], top + i*30, i);
        }
      }
    },

    _createPulldown: function(val, valB, top, index) {
      var map = this.get('alleleToPulldown');
      var sisterAlleles;
      var allAlleles = Geniverse.chromosomeController.get('allAlleles');
      for (var i in allAlleles){
        for (var j in allAlleles[i]){
          if (allAlleles[i][j] === val){
            sisterAlleles = allAlleles[i];
          }
        }
      }

      var pulldownOptions = [];
      var allAlleleOptions = [];
      for (var i in sisterAlleles){
        if (SC.typeOf(sisterAlleles[i]) === SC.T_STRING){
          var allele = sisterAlleles[i];
          allAlleleOptions.push(allele);
        }
      }

      var allAlleleOptions2 = allAlleleOptions.slice(0);

      var correctOption = null;
      for (var i=0, ii=allAlleleOptions.length; i<ii; i++) {
        for (var j=i; j<ii; j++) {
          var allele1Name = Geniverse.chromosomeController.titleForAllele(allAlleleOptions[i])
          var allele2Name = valB ? Geniverse.chromosomeController.titleForAllele(allAlleleOptions2[j]) : ""
          var optionStr = allele1Name + " / " + allele2Name;
          if ((allAlleleOptions[i] == val && (!valB || allAlleleOptions2[j] == valB)) ||
              (allAlleleOptions2[j] == val && (!valB || allAlleleOptions[i] == valB))) {
            correctOption = optionStr;
          }
          var option = SC.Object.create({ value: optionStr, title: optionStr, index: index});
          pulldownOptions.push(option);
          if (!valB) break;
        }
      }

      var startingVal = val;

      //showEmptyOptionInPulldowns
      var emptyOption = SC.Object.create({ value: ' ', title: ' Select a Genotype', index: index});
      pulldownOptions.unshift(emptyOption);
      startingVal = ' ';

      var dropDownMenuView = SC.SelectFieldView.create({
          layout: { top: top, left: 105, height: 25, width: 170 },

         objects: pulldownOptions,

          value: startingVal,
          nameKey: 'title',
          valueKey: 'value',

          correctOption: correctOption,

          updater: function(){
            var isCorrect = this.get('value') === this.get('correctOption');
            Geniverse.invisibleGenomeController.setFieldCorrect(val, isCorrect);
            Lab.statechart.sendAction("addCurrentSelection", val, this.get('value'));
          }.observes('value')
      });

      this.appendChild(dropDownMenuView);

      Geniverse.invisibleGenomeController.addField(val);

      // force the menu to make sure it sets its parent view properties
      // dropDownMenuView.updater(true);
    }
  })
});