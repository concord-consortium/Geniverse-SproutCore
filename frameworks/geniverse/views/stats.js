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
        
      objectsBinding: 'Geniverse.statisticsController.traitList',
     
      nameKey: 'title',
      valueKey: 'title'
    }),
    
    statsView: SC.View.design({
      
      layout: { top: 60, left: 10, right: 0, bottom: 0 },
      
      dragonsBinding: '*parentView.content',
	    breedingCompleteBinding: 'Geniverse.statisticsController.breedingComplete',
			dragonGroupsBinding: 'Geniverse.statisticsController.dragonGroups',
			cumulativeCountsBinding: 'Geniverse.statisticsController.cumulativeCounts',
			cumulativeSizeBinding: 'Geniverse.statisticsController.cumulativeSize',
			motherBinding: 'Geniverse.breedDragonController.mother',
			fatherBinding: 'Geniverse.breedDragonController.father',
			menuBinding: '*parentView.traitPulldown.value', // can't use display properties to observe menu directly
			refresh: NO,
			
			resetCumulativeStats: function (){
				Geniverse.statisticsController.reset();				
			}.observes('menu','mother','father'),
      	
	 	  displayProperties: ['breedingComplete','menu','mother','father','refresh'],
	      
			render: function(context, firstTime) {
				if (!this.get('dragons') || this.get('dragons').get('length') < 1){
					context = context.begin('div').end();
					return;
				}
				var trait = this.getPath('parentView.traitPulldown.value');
				if (!trait){
					return;
				}
				var dragonGroups = this.get('dragonGroups');
				var dragonsSize = this.get('dragons').get('length');
				var cumulativeCounts = this.get('cumulativeCounts');
				var cumulativeSize = this.get('cumulativeSize');
				var pad = '3px';  
				context = context.begin('table').attr('class','statsPadding'); 
				context = context.begin('tr');
				context = context.begin('th').push("").attr('style','border: 0').end();
				context = context.begin('th').push("current clutch").attr('colspan','3').attr('style','border: 0; color:purple').end();
				context = context.begin('th').push("").attr('style','border: 0').end();
				context = context.begin('th').push("all clutches").attr('colspan','3').attr('style','border: 0; color:purple').end();
				context = context.end();
				context = context.begin('tr');
				context = context.begin('th').push("").attr('style','border: 0').end();
				context = context.begin('th').push("Total").end();
				context = context.begin('th').push("F").end();
				context = context.begin('th').push("M").end();
				context = context.begin('th').push("").attr('style','border: 0').end();
				context = context.begin('th').push("Total").end();
				context = context.begin('th').push("F").end();
				context = context.begin('th').push("M").end();
				context = context.end();
         
				// we move this into an array so we can sort it
				var allCharacteristics = [];
				for (var characteristic in dragonGroups[trait]){
					allCharacteristics.push(characteristic);
				}
				allCharacteristics.sort();
				         
				for (var i = 0; i < allCharacteristics.length; i++){
					var characteristic = allCharacteristics[i];
					context = context.begin('tr');
					context = context.begin('th').push(characteristic).end();
					var total = dragonGroups[trait][characteristic].Male + dragonGroups[trait][characteristic].Female;
					var percent = Math.floor((total / dragonsSize) * 100).toFixed();
					var cumulativeTotal = cumulativeCounts[trait][characteristic].Male + cumulativeCounts[trait][characteristic].Female;
					var cumulativePercent = Math.floor((cumulativeTotal / cumulativeSize) * 100).toFixed();
					context = context.begin('td').push(total+" ("+percent+"%)").attr('style','text-align: left').end();
					context = context.begin('td').push(dragonGroups[trait][characteristic].Female).end();
					context = context.begin('td').push(dragonGroups[trait][characteristic].Male).end();
					context = context.begin('td').push("").attr('style','border: 0; padding: '+pad).end();
					context = context.begin('td').push(cumulativeTotal+" ("+cumulativePercent+"%)").attr('style','text-align: left').end();
					context = context.begin('td').push(cumulativeCounts[trait][characteristic].Female).end();
					context = context.begin('td').push(cumulativeCounts[trait][characteristic].Male).end();
					context = context.end();
				}

				context = context.end();
				sc_super();
			}
		})
	});
