// ==========================================================================
// Project:   Geniverse.StatsView
// Copyright: ©2010 Concord Consortium, Inc.
// ==========================================================================
/*globals Geniverse, generateDragonWithSex sc_super*/

/** @class

  Geniverse.StatsView
  Show statistics about dragons which have been bread.

  @extends SC.View
*/

Geniverse.StatsView = SC.View.extend(
  /** @scope Geniverse.StatsView.prototype */ {
    
    // contentBinding: // requires a binding in view, such as 'Geniverse.eggsController.arrangedObjects',
    
    childViews: 'traitLabel traitPulldown statsView'.w(),
    
    classNames: ['black-text '],
    
    backgroundColor: 'white',
    
    traitLabel: SC.LabelView.design({
      layout: {top: 20, left: 20, height: 25, width: 40 },
      value: "Trait"
    }),
    
    traitPulldown: SC.SelectFieldView.design({
      layout: { top: 20, left: 60, height: 25, width: 80 },
        
      objects: [
        { title: "Horns" },
        { title: "Wings" },
        { title: "Forelimbs" },
        { title: "Hindlimbs" },
        { title: "Armor" },
        { title: "Tail" },
        { title: "Color" }
      ],
     
      nameKey: 'title',
      valueKey: 'title'
    }),
    
    statsView: SC.View.design({
      
      layout: { top: 60, left: 20, right: 0, bottom: 0 },
      
      dragonsBinding: '*parentView.content',
      
      dragonsObserver: function() {
        if (this.get('isVisible')){
          var trait = this.getPath('parentView.traitPulldown.value');
          if (!trait){
            return;
          }
          var dragonGroups = {};
          
          var dragons = this.get('dragons');
          dragons.forEach(function(dragon){
            var characteristic = dragon.characteristicValue(trait);
            var sex = dragon.sexAsString();
            if (!dragonGroups[characteristic]){
              dragonGroups[characteristic] = {};
              dragonGroups[characteristic].Male = 0;
              dragonGroups[characteristic].Female = 0;
            }
            dragonGroups[characteristic][sex] = dragonGroups[characteristic][sex] + 1;
          },this);
          this.set('dragonGroups',dragonGroups);    //{'Horns': {'male': 10, 'female': 5}, 'No horns': {'male': 0, 'female': 5}}
        }
      }.observes('*dragons.[]', '*parentView.traitPulldown.value'),
      
      dragonGroups: {},
      
      displayProperties: ['dragonGroups'],
      
      
      render: function(context, firstTime) {
        if (!this.get('dragons') || this.get('dragons').get('length') < 1){
          return;
        }
        var dragonGroups = this.get('dragonGroups');
        var dragonsSize = this.get('dragons').get('length');
        
        context = context.begin('table').attr('style','border: 0');
        
          context = context.begin('tr');
            context = context.begin('th').push("").attr('style','border: 0').end();
            context = context.begin('th').push("Total").end();
            context = context.begin('th').push("F").end();
            context = context.begin('th').push("M").end();
          context = context.end();
         
         for (var trait in dragonGroups){
           context = context.begin('tr');
             context = context.begin('th').push(trait).end();
             var total = dragonGroups[trait].Male + dragonGroups[trait].Female;
             var percent = Math.floor((total / dragonsSize) * 100).toFixed();
             context = context.begin('td').push(total+" ("+percent+"%)").attr('style','text-align: left').end();
             context = context.begin('td').push(dragonGroups[trait].Female).end();
             context = context.begin('td').push(dragonGroups[trait].Male).end();
           context = context.end();
         }
        
        context = context.end();
        
        
        sc_super();
      }
    })
});
