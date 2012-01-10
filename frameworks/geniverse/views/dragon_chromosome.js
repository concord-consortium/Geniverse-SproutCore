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
sc_require('controllers/scoring');
Geniverse.DragonChromosomeView = SC.View.extend(
/** @scope Geniverse.DragonChromosomeView.prototype */ {

  alleles: [],
  hiddenGenesBinding: '*parentView.hiddenGenes',
  staticGenesBinding: '*parentView.staticGenes',
  isEditableBinding: '*parentView.isEditable',
  showEmptyOptionInPulldowns: NO,
  startWithEmptyOption: NO,
  classNames: ['opaque'],
  
  chromosome: '1',
  side: 'A',
  showLines: NO,
  trackScore: NO,
  
  oldAlleles: [],
  
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
 
  resetPulldowns: function() {
   this.get('pullDowns').resetPulldowns();
  },

  allAllelesSelected: YES,
  pulldownsDidChange: function(ignore) {
    if (this.get('trackScore') && !ignore && !this.get('pullDowns').get('autoChangingPulldowns')) {
      Geniverse.scoringController.incrementScore(1);
    }
    var pds = this.getPath('pullDowns.childViews');
    if (!! pds) {
      for (var i = 0; i < pds.length; i++) {
        var pd = pds[i];
        if (pd.get('fieldValue') == ' ') {
          this.set('allAllelesSelected', NO);
          this.propertyDidChange('allAllelesSelected');
          return;
        }
      }
    }
    this.set('allAllelesSelected', YES);
    this.propertyDidChange('allAllelesSelected');
  },

  
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
    
    autoChangingPulldowns: NO,
    
    init: function() {
      sc_super();
      this.invokeLast(function() {
        this._setupPulldowns();
      });
    },
    
    allelesDidChange: function() {
      this.set('ignoreChanges', YES);
      this.set('autoChangingPulldowns', YES);
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
          if (pd instanceof SC.SelectFieldView) {
            pd.set('title', Geniverse.chromosomeController.titleForAllele(alleles[i]));
            pd.set('value',alleles[i]);
          }
          else {
            pd.set('value', Geniverse.chromosomeController.titleForAllele(alleles[i]));
          }
        }
      }
      
      this.set('autoChangingPulldowns', NO);
      
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
      this.resetPulldowns();
    }.observes('isEditable'),
    
    hiddenGenesDidChange: function() {
      this.resetPulldowns();
    }.observes('hiddenGenes'),
    
    staticGenesDidChange: function() {
      this.resetPulldowns();
    }.observes('staticGenes'),

    resetPulldowns: function() {
      // remove and destroy all the children
      var children = this.get('childViews');
      var view = children.objectAt(children.get('length')-1);
      while (!!view) {
        this.removeChild(view);
        view.destroy();
        view = children.objectAt(children.get('length')-1);
      }
      var map = this.get('alleleToPulldown');
      map[this] = null;
      this.allelesDidChange();
    },

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

      var startingVal = val;

      //showEmptyOptionInPulldowns
      var emptyOption = SC.Object.create({ value: ' ', title: ' ', index: index});
      if (this.get('parentView').get('showEmptyOptionInPulldowns')){
        pulldownOptions.unshift(emptyOption);
        if (this.getPath('parentView.startWithEmptyOption')) {
          startingVal = ' ';
        }
      }

      var dropDownMenuView = SC.SelectFieldView.create({
          layout: { top: top, left: 0, height: 25, width: 105 },
          
         objects: pulldownOptions,
       
          value: startingVal,
          nameKey: 'title',
          valueKey: 'value',
          
          updater: function(ignore){
            if (!!this.get('value')) {
              var firstObj = this.get('objects')[0];
              var index = firstObj.get('index');
              var alleles = this.get('parentView').get('parentView').get('alleles');
              if (this.get('value').length < 5) {
                alleles[index] = this.get('value');
                this.get('parentView').get('parentView').set('alleles', alleles);
                this.get('parentView').get('parentView').propertyDidChange('alleles');
                this.get('parentView').get('parentView').pulldownsDidChange(ignore === true);
              }
            }
          }.observes('value')
      });
      

      if (!map[this]) {
        map[this] = [];
      }
      map[this][val.toLowerCase()] = dropDownMenuView;
      this.appendChild(dropDownMenuView);

      // force the menu to make sure it sets its parent view properties
      dropDownMenuView.updater(true);
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
