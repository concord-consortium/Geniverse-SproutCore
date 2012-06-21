// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CC, CcChat, java static_url sc_static sc_require */
Lab.marginSize = 15;

sc_require('views/top_bar_view');
sc_require('views/challenge_pool_view');
sc_require('views/breeding_pen_view');
sc_require('views/stable_view');
sc_require('views/bottom_bar_view');
sc_require('views/dragon_breeding_genome_view');

Lab.chromosomeBreedingChallengePage = SC.Page.design({
  pagePath: 'Lab.chromosomeBreedingPage',
  title: 'Chromosome Breeding Page',
  challengeType: 'chromosomeBreedingOneAtATimeChallenge',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'],
    childViews: 'mainAppView'.w(),

    mainAppView: SC.View.design({

      layout: { centerX: 0, top: 0, width: 1080, height: 880 },

      childViews: 'genomePanel breedingPenView matchView scoreView'.w(),

      genomePanel: SC.View.design({
        layout: {top: 5, height: 585, left: 15, width: 1005 },
        childViews: 'background femaleTitle femaleGenomeView femalePhenotypeView maleTitle maleGenomeView malePhenotypeView breedButton'.w(),

        // separate parallel background so we don't make the rest of the childViews see-through
        background: SC.View.design({
          layout: {top: 0, left: 0, right: 0, bottom: 0},
          classNames: ['genome-view-intro']
        }),

        femaleTitle: SC.LabelView.design({
          layout: {top: 10, height: 25, left: 70, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Female Drake"
        }),

        femalePhenotypeView: Geniverse.OrganismView.design({
          layout: {top: 0, left: 30, width: 200, height: 200},
          contentBinding: "*parentView.femaleGenomeView.dragon",
          allowDrop: NO,
          showBackground: NO,
          glow: YES
        }),

        femaleGenomeView: Lab.DragonBreedingGenomeView.design({
          layout: {top: 170, left: 15, height: 500, width: 500 },
          sex: 1,
          index: 1
        }),

        maleTitle: SC.LabelView.design({
          layout: {top: 10, height: 25, right: 35, width: 170 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Male Drake"
        }),

        malePhenotypeView: Geniverse.OrganismView.design({
          layout: {top: 0, right: 60, width: 200, height: 200},
          contentBinding: "*parentView.maleGenomeView.dragon",
          allowDrop: NO,
          showBackground: NO,
          glow: YES
        }),

        maleGenomeView: Lab.DragonBreedingGenomeView.design({
          layout: {top: 170, right: 0, height: 500, width: 500 },
          sex: 0,
          index: 2,
          dragonOnRight: YES
        }),

        breedButton: SC.ButtonView.design({
          layout: { top: 150, centerX: -60, width: 100, height: 24 },
          target: 'Geniverse.breedDragonController',
          action: "breedAndIncrementScore",
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
        layout: { left: 329, top: 205, width: 380, height: 350 },
        breedingRecordRight: -20
      }),

      matchView: Geniverse.MatchView.design({
        layout: { centerX: 0, top: -40, height: 190, width: 270 },
        onlyOne: YES,
        labelPosition: "right",
        dragonSize: 170
      }),

      scoreView: Geniverse.ScoreView.design({
        layout: { top: 145, centerX: 60, width: 150, height: 46 },
        showScore: YES,
        showTargetScore: YES
      })

    })
  })
});
