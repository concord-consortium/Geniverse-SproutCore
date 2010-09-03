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
  
  isVisible: function() {
    return this.get('alleles').length > 0;
  }.property('alleles'),
  
  chromoImage: SC.ImageView.design({
    layout: {top: 0, left: 0, width: 22 },
    chromosomeBinding: '*parentView.chromosome',
    sideBinding: '*parentView.side',
    
    chromosomeDidChange: function() {
      this._setChromoImage();
    }.observes('chromosome','side'),
    
    _setChromoImage: function() {
      // FIXME: sc_static doesn't work with anything but a pure string...
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
    
    // allelesBinding: '*parentView.alleles',     // this frequently doesn't update until the next runloop...
    alleles: function() {                         // this works fine, but seems wrong...
        return this.get('parentView').get('alleles');
    }.property('*parentView.alleles'),
    
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
        if (!!pd && pd.get('fieldValue') != alleles[i]) {
          pd.set('value', alleles[i]);
        }
      }
      
      // go through pulldowns and hide those which don't have alleles
      for (var j in pulldowns[this]) {
        if (!!pulldowns[this][j].tagName && pulldowns[this][j].tagName === 'select') {
          if (alleles.indexOf(j) === -1 && alleles.indexOf(j.toUpperCase()) === -1){
            pulldowns[this][j].set('isVisible', NO);
          } else {
            pulldowns[this][j].set('isVisible', YES);
          }
        }
      }
    }.observes('*parentView.alleles.[]'),

    _setupPulldowns: function() {
      var alls = this.get('alleles');
      var hidden = this.get('hiddenGenes');
      for (var i = 0; i < alls.length; i++) {
        if (hidden.indexOf(alls[i].toLowerCase()) == -1) {
          this._createPulldown(alls[i], i*30);
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

          value: val,
          nameKey: 'title',
          valueKey: 'title',
          
          updater: function(){
            var value = this.get('value');
            var alleles = this.get('parentView').get('parentView').get('alleles');
            for (var i = 0; i < alleles.length; i++){
              if (alleles[i].toLowerCase() === value.toLowerCase()){
                alleles[i] = value;
              }
            }
            this.get('parentView').get('parentView').set('alleles', alleles);
            
            // FIXME: without this, binding on view instance in DragonGenomeView doesn't fire. Why?
            this.get('parentView').get('parentView').propertyDidChange('alleles');  
          }.observes('value')
      });

      if (!map[this]) {
        map[this] = [];
      }
      map[this][val.toLowerCase()] = dropDownMenuView;
      this.appendChild(dropDownMenuView);
    }
  })

});
