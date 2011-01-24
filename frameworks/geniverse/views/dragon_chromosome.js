// ==========================================================================
// Project:   Geniverse.DragonChromosomeView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('controllers/chromosome');
Geniverse.DragonChromosomeView = SC.View.extend(
/** @scope Geniverse.DragonChromosomeView.prototype */ {

  alleles: [],
  hiddenGenesBinding: '*parentView.hiddenGenes',
  staticGenesBinding: '*parentView.staticGenes',
  isEditableBinding: '*parentView.isEditable',
  showEmptyOptionInPulldowns: NO,
  classNames: ['opaque'],
  
  chromosome: '1',
  side: 'A',
  showLines: NO,
  
  // sc_static is search/replaced via the build tools not by the runtime,
  // therefore we have to pre-calculate all of the possible images and urls here
  chromoImageUrls: {
    1: {
      A: sc_static("A1-chromosome.png"),
      B: sc_static("B1-chromosome.png")
    },
    2: {
      A: sc_static("A2-chromosome.png"),
      B: sc_static("B2-chromosome.png")
    },
    X: {
      A: sc_static("AX-chromosome.png"),
      B: sc_static("BX-chromosome.png")
    },
    Y: {
      B: sc_static("BY-chromosome.png")
    }
  },


  lineImageUrls: {
    1: sc_static("1-lines.png"),
    2: sc_static("2-lines.png"),
    X: sc_static("X-lines.png"),
    Y: sc_static("Y-lines.png")
  },
  
  showPulldowns: function() {
    return this.get('alleles').length > 0;
  }.property('alleles'),
  
  childViews: 'chromoImage linesImage pullDowns'.w(),
  
  chromoImage: SC.ImageView.design({
    layout: {top: 0, left: 0, width: 22 },
    chromosomeBinding: '*parentView.chromosome',
    sideBinding: '*parentView.side',
    chromoImageUrlsBinding: '*parentView.chromoImageUrls',
    classNames: ['opaque'],
    
    chromosomeDidChange: function() {
      this._setChromoImage();
    }.observes('chromosome','side'),
    
    _setChromoImage: function() {
      var urls = this.get('chromoImageUrls');
      if (!!urls) {
        var chromoUrls = urls[this.get('chromosome')];
        if (chromoUrls !== undefined && chromoUrls !== null) {
          var url = chromoUrls[this.get('side')];
          this.set('value', url);
        }
      }
    }
  }),
  
  linesImage: SC.ImageView.design({
    layout: {top: 0, left: 22, width: 22 },
    isVisibleBinding: '*parentView.showLines',
    chromosomeBinding: '*parentView.chromosome',
    lineImageUrlsBinding: '*parentView.lineImageUrls',
    chromosomeDidChange: function() {
      var lineImages = this.get('lineImageUrls');
      if (!!lineImages) {
        this.set('value', lineImages[this.get('chromosome')]);
      }
    }.observes('chromosome')
  }),
  
  pullDowns: SC.View.design({
    layout: {top:0, left: 30 },
    isVisibleBinding: '*parentView.showPulldowns',
    // allelesBinding: '*parentView.alleles',     // this frequently doesn't update until the next runloop...
    alleles: function() {                         // this works fine, but seems wrong...
      if (!!this.get('parentView')) {
        return this.get('parentView').get('alleles');
      }
      return [];
    }.property('*parentView.alleles'),
    
    alleleToPulldown: [],
    hiddenGenesBinding: '*parentView.hiddenGenes',
    staticGenesBinding: '*parentView.staticGenes',
    isEditableBinding: '*parentView.isEditable',
    
    ignoreChanges: NO,
    
    init: function() {
      sc_super();
      this.invokeLast(function() {
        this._setupPulldowns();
      });
    },
    
    allelesDidChange: function() {
      this.set('ignoreChanges', YES);
      var alleles = this.get('alleles');
      var pulldowns = this.get('alleleToPulldown');
      
      if (!pulldowns[this]){
        this._setupPulldowns();
        if (!pulldowns[this]){
          return;
        }
      }
      
      for (var i = 0; i < alleles.length; i++) {
        var pd = pulldowns[this][alleles[i].toLowerCase()];
        if (!pd) {      // not findable just by getting lower case
          var sisterAlleles;
          var allAlleles = Geniverse.chromosomeController.get('allAlleles');
          for (var j in allAlleles){
            for (var k in allAlleles[j]){
              if (allAlleles[j][k] === alleles[i]){
                sisterAlleles = allAlleles[j];
                break;
              }
            }
          }
          for (var l in sisterAlleles){
            if (SC.typeOf(sisterAlleles[l]) === SC.T_STRING){
              pd = pulldowns[this][sisterAlleles[l].toLowerCase()];
              if (!!pd){
                break;
              }
            }
          }
        }
        if (!!pd && pd.get('fieldValue') != alleles[i]) {
          if (pd.get('title')) {
            pd.set('title', Geniverse.chromosomeController.titleForAllele(alleles[i]));
            pd.set('value',alleles[i]);
          }
          else {
            pd.set('value', Geniverse.chromosomeController.titleForAllele(alleles[i]));
          }
        }
      }
      
      // go through pulldowns and hide those which don't have alleles
      // for (var j in pulldowns[this]) {
      //   if (!!pulldowns[this][j].tagName && pulldowns[this][j].tagName === 'select') {
      //     if (alleles.indexOf(j) === -1 && alleles.indexOf(j.toUpperCase()) === -1){
      //       pulldowns[this][j].set('isVisible', NO);
      //     } else {
      //       pulldowns[this][j].set('isVisible', YES);
      //     }
      //   }
      // }
    }.observes('*parentView.alleles.[]'),
    
    isEditableDidChange: function() {
      this.removeAllChildren();
      this._setupPulldowns();
      this.allelesDidChange();
    }.observes('isEditable'),
    
    hiddenGenesDidChange: function() {
      this.removeAllChildren();
      this._setupPulldowns();
      this.allelesDidChange();
    }.observes('hiddenGenes'),
    
    staticGenesDidChange: function() {
      this.removeAllChildren();
      this._setupPulldowns();
      this.allelesDidChange();
    }.observes('staticGenes'),

    _setupPulldowns: function() {
      var alls = this.get('alleles');
      var hidden = this.get('hiddenGenes');
      var staticGenes = this.get('staticGenes');
      var editable = this.get('isEditable');
      for (var i = 0; i < alls.length; i++) {
        if (hidden.indexOf(alls[i].toLowerCase()) == -1) {
          if (editable && staticGenes.indexOf(alls[i].toLowerCase()) == -1){
            this._createPulldown(alls[i], i*30, i);
          } else {
            this._createStaticAllele(alls[i], i*30);
          }
        }
      }
    },

    _createPulldown: function(val, top, index) {
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
      for (var i in sisterAlleles){
        if (SC.typeOf(sisterAlleles[i]) === SC.T_STRING){
          var allele = sisterAlleles[i];
          var option = SC.Object.create({ value: allele, title: Geniverse.chromosomeController.titleForAllele(allele), index: index});
          pulldownOptions.unshift(option);
        }
      }

      var dropDownMenuView = SC.SelectFieldView.create({
          layout: { top: top, left: 0, height: 25, width: 105 },
          
         objects: pulldownOptions,
       
          value: val,
          nameKey: 'title',
          valueKey: 'value',
          
          updater: function(){
            var index = this.get('objects')[0].get('index');
            var alleles = this.get('parentView').get('parentView').get('alleles');
            alleles[index] = this.get('value');
            this.get('parentView').get('parentView').set('alleles', alleles);
            this.get('parentView').get('parentView').propertyDidChange('alleles');
          }.observes('value')
      });
      
      //showEmptyOptionInPulldowns
      if (this.get('parentView').get('showEmptyOptionInPulldowns')){
        dropDownMenuView.objects.unshift(SC.Object.create({ value: ' ', title: ' ', index: index}));
      }

      if (!map[this]) {
        map[this] = [];
      }
      map[this][val.toLowerCase()] = dropDownMenuView;
      this.appendChild(dropDownMenuView);
    },
    
    _createStaticAllele: function(val, top){
      var map = this.get('alleleToPulldown');

      var alleleView = SC.LabelView.create({
          layout: { top: top, left: 0, height: 20, width: 90 },
          classNames: ['static-allele'],
          textAlign: SC.ALIGN_CENTER,
          value: val // will change
      });

      if (!map[this]) {
        map[this] = [];
      }
      map[this][val.toLowerCase()] = alleleView;
      this.appendChild(alleleView);
    }
  })

});
