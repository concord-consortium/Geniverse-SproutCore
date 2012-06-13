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
    childViews: 'backgroundView mainAppView'.w(),
    backgroundView: SC.ImageView.design({
      value: static_url('lab_background.png'),
      classNames: ['transparent','scalingimage']
    }),

    mainAppView: SC.View.design({

      childViews: 'genomePanel breedingPenView scoreView matchView'.w(),

      genomePanel: SC.View.design({
        layout: {top: 40, height: 450, left: 15, width: 1005 },
        childViews: 'background femaleTitle femaleGenomeView femalePhenotypeView maleTitle maleGenomeView malePhenotypeView breedButton'.w(),

        // separate parallel background so we don't make the rest of the childViews see-through
        background: SC.View.design({
          layout: {top: 0, left: 0, right: 0, bottom: 0},
          classNames: ['genome-view-intro']
        }),

        femaleTitle: SC.LabelView.design({
          layout: {top: 10, height: 25, left: 325, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Female Drake"
        }),

        femaleGenomeView: Lab.DragonBreedingGenomeView.design({
          layout: {top: 40, left: 15, height: 500, width: 500 },
          index: 1,
          sex: 1
        }),

        femalePhenotypeView: Geniverse.OrganismView.design({
          layout: {top: 0, left: 300, width: 200, height: 200},
          contentBinding: "*parentView.femaleGenomeView.dragon",
          allowDrop: NO,
          showBackground: NO
        }),

        maleTitle: SC.LabelView.design({
          layout: {top: 10, height: 25, left: 530, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Male Drake"
        }),

        maleGenomeView: Lab.DragonBreedingGenomeView.design({
          layout: {top: 40, left: 515, height: 500, width: 500 },
          index: 2,
          sex: 0,
          dragonOnRight: YES
        }),

        malePhenotypeView: Geniverse.OrganismView.design({
          layout: {top: 0, left: 515, width: 200, height: 200},
          contentBinding: "*parentView.maleGenomeView.dragon",
          allowDrop: NO,
          showBackground: NO
        }),

        breedButton: SC.ButtonView.design({
          layout: { top: 170, left: 450, width: 100, height: 24 },
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
        layout: { left: 329, top: 245, width: 380, height: 350 }
      }),

      scoreView: Geniverse.ScoreView.design({
        layout: { left: 165, top: 495, height: 40, width: 150 },
        showTargetScore: YES
      }),

      matchView: Geniverse.MatchView.design({
        layout: { left: 713, top: 495, height: 150, width: 150 },
        onlyOne: YES,
        dragonSize: 150
      })

    })
  })
});
