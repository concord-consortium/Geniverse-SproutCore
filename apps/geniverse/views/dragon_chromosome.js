// ==========================================================================
// Project:   Geniverse.DragonChromosomeView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Geniverse.DragonChromosomeView = SC.View.extend(
/** @scope Geniverse.DragonChromosomeView.prototype */ {

  alleles: [],
  hiddenGenes: [],
  
  chromosome: '1',
  side: 'A',
  
  childViews: 'chromoImage linesImage pullDowns'.w(),
  
  chromoImage: SC.ImageView.design({
    layout: {top: 0, left: 0, width: 22 },
    chromosomeBinding: '*parentView.chromosome',
    sideBinding: '*parentView.side',
    
    chromosomeDidChange: function() {
      this._setChromoImage();
    }.observes('chromosome','side'),
    
    // sideDidChange: function() {
    //   this._setChromoImage();
    // }.observes('side'),
    
    _setChromoImage: function() {
      SC.Logger.info("Setting chromo image: " + 'http://www.concord.org/~aunger/gen/' + this.get('side') + this.get('chromosome') + "-chromosome.png");
      // this.set('value', sc_static(this.get('side') + this.get('chromosome') + "-chromosome"));
      this.set('value', 'http://www.concord.org/~aunger/gen/' + this.get('side') + this.get('chromosome') + "-chromosome.png");
    }
  }),
  
  linesImage: SC.ImageView.design({
    layout: {top: 0, left: 22, width: 22 },
    chromosomeBinding: '*parentView.chromosome',
    chromosomeDidChange: function() {
      // this.set('value', sc_static('./' + this.get('chromosome') + "-chromosome"));
      this.set('value', 'http://www.concord.org/~aunger/gen/' + this.get('chromosome') + "-lines.png");
    }.observes('chromosome')
  }),
  
  pullDowns: SC.View.design({
    layout: {top:0, left: 45 },
    allelesBinding: '*parentView.alleles',
    alleleToPulldown: [],
    hiddenGenesBinding: '*parentView.hiddenGenes',
    
    ignoreChanges: NO,
    
    init: function() {
      sc_super();
      this.invokeLast(function() {
        this._setupPulldowns();
      });
    },
    
    allelesDidChange: function() {
      this.set('ignoreChanges', YES);
      var alls = this.get('alleles');
      var pulldowns = this.get('alleleToPulldown');
      for (var i = 0; i < alls.length; i++) {
        var pd = pulldowns[alls[i].toLowerCase()];
        if (pd.get('fieldValue') != alls[i]) {
          pd.set('fieldValue', alls[i]);
        }
      }
    }.observes('alleles.[]'),
    
    updateDragon: function() {
      if (this.get('ignoreChanges') == NO) {
        // FIXME update the alleles array
      }
    },

    _setupPulldowns: function() {
      var alls = this.get('alleles');
      var hidden = this.get('hiddenGenes');
      for (var i = 0; i < alls.length; i++) {
        if (hidden.indexOf(alls[i].toLowerCase()) == -1) {
          this._createPulldown(alls[i], i*30);
        } else {
          SC.Logger.info("Not making pulldown for allele: " + alls[i] + " because indexOf returned: " + hidden.indexOf(alls[i].toLowerCase()));
        }
      }
    },

    _createPulldown: function(val, top) {
      var map = this.get('alleleToPulldown');
      var dropDownMenuView = SC.SelectFieldView.create({
          layout: { top: top, left: 0, height: 25, width: 50 },

          // not sure whether these need to be SC.Objects or not. It seems to have no effect.
          objects: [ SC.Object.create({ title: val.toUpperCase() }),
            SC.Object.create({ title: val.toLowerCase() })],

          fieldValue: val,
          nameKey: 'title',
          valueKey: 'title'
      });

      dropDownMenuView.addObserver('fieldValue', this.updateDragon);
      map[val.toLowerCase()] = dropDownMenuView;
      this.appendChild(dropDownMenuView);
    }
  })

});
