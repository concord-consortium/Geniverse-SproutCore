// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CC, CcChat, java static_url sc_static sc_require */
Lab.marginSize = 15;

sc_require('views/lab_pane');
sc_require('views/challenge_pool_view');
sc_require('views/breeding_pen_view');
sc_require('views/stable_view');
sc_require('views/dragon_breeding_genome_view');

Lab.chromosomeBreedingPage = SC.Page.design({

  pagePath: 'Lab.chromosomeBreedingPage',
  title: 'Chromosome Breeding Page',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: Lab.LabPane.design({

    layout: { left: 0, top: 0, width: 800, height: 1400 },

    mainAppView: SC.View.design({


      layout: { left: 0, top: 100, width: 800, height: 1300 },

      childViews: 'genomePanel breedingPenView matchView scoreView'.w(),

      genomePanel: SC.View.design({
        layout: { left: 0, top: 0, width: 800, height: 1300 },
        childViews: 'femaleTitle femaleGenomeView femalePhenotypeView maleTitle maleGenomeView malePhenotypeView breedButton'.w(),

        femaleTitle: SC.LabelView.design({
          layout: {top: 0, height: 25, centerX: -105, width: 200 },
          textAlign: SC.ALIGN_CENTER,
          controlSize: SC.LARGE_CONTROL_SIZE,
          classNames: 'title'.w(),
          value: "Female Dragon"
        }),

        femalePhenotypeView: Geniverse.OrganismView.design({
          layout: {top: 35, centerX: -105, width: 200, height: 200},
          contentBinding: "*parentView.femaleGenomeView.dragon",
          allowDrop: NO,
          showBackground: NO,
          glow: YES
        }),

        femaleGenomeView: Lab.DragonBreedingGenomeView.design({
          layout: {top: 245, centerX: -75, height: 500, width: 500 },
          sex: 1,
          index: 1
        }),

        maleTitle: SC.LabelView.design({
          layout: {top: 0, height: 25, centerX: 105, width: 200 },
          textAlign: SC.ALIGN_CENTER,
          controlSize: SC.LARGE_CONTROL_SIZE,
          classNames: 'title'.w(),
          value: "Male Dragon"
        }),

        malePhenotypeView: Geniverse.OrganismView.design({
          layout: {top: 35, centerX: 105, width: 200, height: 200},
          contentBinding: "*parentView.maleGenomeView.dragon",
          allowDrop: NO,
          showBackground: NO,
          glow: YES
        }),

        maleGenomeView: Lab.DragonBreedingGenomeView.design({
          layout: {top: 245, centerX: 105, height: 500, width: 500 },
          sex: 0,
          index: 2,
          dragonOnRight: YES
        }),

        breedButton: SC.ButtonView.design({
          layout: { top: 695, centerX: -60, width: 100, height: 24 },
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
        layout: { centerX: 0, top: 695+34, width: 380, height: 350 },
        breedingRecordRight: -20
      }),

      matchView: Geniverse.MatchView.design({
        layout: { centerX: 0, top: 695+34+350+10, height: 125, width: 410 },
        dragonSize: 105
      }),

      scoreView: Geniverse.ScoreView.design({
        layout: { top: 695-24, centerX: 10+150/2, width: 150, height: 46 },
        showScore: YES,
        isVisibleBinding: SC.Binding.oneWay('Geniverse.activityController.isArgumentationChallenge').not(),
        showTargetScore: YES
      })

    })
  })
});
