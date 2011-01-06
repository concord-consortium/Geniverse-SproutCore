// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CC, CcChat, java static_url sc_static sc_require */
Lab.marginSize = 15;

sc_require('views/article');
sc_require('views/breed_dragon');
sc_require('views/dragon_genome');
sc_require('views/dragon_bin');
sc_require('views/dragon_chat_compose');
sc_require('views/organism');
sc_require('views/published_articles');
sc_require('views/login');
sc_require('resources/top_bar_view');

Lab.chromosomeBreedingPage = SC.Page.design({
  
  pagePath: 'Lab.chromosomeBreedingPage',
  title: 'Chromosome Breeding Page',
  
  init: function() {
    sc_super();
    Geniverse.breedDragonController.set('numberOfOffspring', 18);
  },
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'], 
    childViews: 'backgroundView mainAppView topBar'.w(),
    backgroundView: SC.ImageView.design({
      value: static_url('lab_background.png'),
      classNames: ['transparent','scalingimage']
    }),
    topBar: Lab.TopBarView.design({
      classNames: ['brown']
    }),

    mainAppView: SC.View.design({
      
      childViews: 'genomePanel breedingPenView matchView'.w(),
      
      genomePanel: SC.View.design({
        layout: {top: 40, height: 450, left: 15, width: 1005 },
        childViews: 'femaleTitle femaleGenomeView maleTitle maleGenomeView breedButton'.w(),
        classNames: ['genome-view-intro'],

        femaleTitle: SC.LabelView.design({
          layout: {top: 10, height: 25, left: 325, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Female Drake"
        }),

        femaleGenomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 40, left: 15, height: 500, width: 500 },
          generateDragonAtStart: NO,
          displayChallengeDragon: YES,
          sex: 1,
//        fixedAlleles: "a:A,a:A,a:B,b:B",
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO,
          updateBreedDragon: function() {
            Geniverse.breedDragonController.set('mother', this.get('dragon'));
          }.observes('dragon')
        }),
        
        maleTitle: SC.LabelView.design({
          layout: {top: 10, height: 25, left: 530, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Male Drake"
        }),

        maleGenomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 40, left: 515, height: 500, width: 500 },
          generateDragonAtStart: NO,
          displayChallengeDragon: YES,
          sex: 0,
//        fixedAlleles: "a:A,a:A,a:B,b:B",
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO,
          dragonOnRight: YES,
          updateBreedDragon: function() {
            Geniverse.breedDragonController.set('father', this.get('dragon'));
          }.observes('dragon')
        }),
        
        breedButton: SC.ButtonView.design({
          layout: { top: 230, left: 450, width: 100, height: 24 },
      		target: 'Geniverse.breedDragonController',
      		action: "breed",
      		isBreedingBinding: 'Geniverse.breedDragonController.isBreeding',
      		hasParentsBinding: 'Geniverse.breedDragonController.hasParents',
      		isEnabled: function() {
      		  return (this.get('hasParents') && !this.get('isBreeding'));
      		}.property('hasParents', 'isBreeding').cacheable(),

      		title: function () {
      		  return this.get('isBreeding') ? 'Breeding...' :  'Breed';
      		}.property('isBreeding').cacheable()
      	})

      }),
      
      // Breeding pen with eggs
      breedingPenView: Lab.BreedingPenView.design({
        layout: { left: 325, top: 320, width: 400, height: 230 }
      }),
      
      matchView: Geniverse.MatchView.design({
        layout: { left: 325, top: 530, height: 110, width: 400 }
      })
      
  	})
	})
});
