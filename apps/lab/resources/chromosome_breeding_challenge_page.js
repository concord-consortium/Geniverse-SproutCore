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

Lab.chromosomeBreedingChallengePage = SC.Page.design({
  pagePath: 'Lab.chromosomeBreedingPage',
  title: 'Chromosome Breeding Page',
  challengeType: 'chromosomeBreedingOneAtATimeChallenge',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: Lab.LabPane.design({
    mainAppView: SC.View.design({

      layout: { centerX: 0, top: 80, width: 1080, height: 880 },

      childViews: 'genomePanel breedingPenView matchView scoreView chromosome1HintView chromosome2HintView chromosome3HintView chromosome4HintView'.w(),

      genomePanel: SC.View.design({
        layout: {top: 35, height: 585, left: 15, width: 1005 },
        childViews: 'femaleTitle femaleGenomeView femalePhenotypeView maleTitle maleGenomeView malePhenotypeView breedButton'.w(),

        femaleTitle: SC.LabelView.design({
          layout: {top: 10, height: 25, left: 70, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          classNames: 'title'.w(),
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
          classNames: 'title'.w(),
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
          bredOnce: false,
          action: function() {
            Geniverse.breedDragonController.breed();
            if (!this.get('bredOnce')) {
              Lab.statechart.sendAction('breedingPageMatchBreedingCompleted');
              this.set('bredOnce', true);
            }
          },
          isBreedingBinding: 'Geniverse.breedDragonController.isBreeding',
          hasParentsBinding: 'Geniverse.breedDragonController.hasParents',
          isEnabled: function() {
            return (this.get('hasParents') && !this.get('isBreeding'));
          }.property('hasParents', 'isBreeding').cacheable(),

          title: function () {
            return this.get('isBreeding') ? 'Breeding...' :  'Breed';
          }.property('isBreeding').cacheable(),

          toolTip: "Click Breed to create a clutch of 20 offspring drakes. Clicking Breed costs zero moves!",
          classNames: 'hint-available hint-max-width-151'.w()
        })

      }),

      // Breeding pen with eggs
      breedingPenView: Lab.BreedingPenView.design({
        layout: { left: 329, top: 240, width: 380, height: 350 },
        breedingRecordRight: -20
      }),

      matchView: Geniverse.MatchView.design({
        layout: { centerX: 0, top: -10, height: 190, width: 270 },
        onlyOne: YES,
        labelPosition: "right",
        dragonSize: 170,
        toolTip: "Drag a matching drake from the pen onto the target.",
        classNames: 'breeding-completed-hint hint-target-leftMiddle hint-tooltip-rightMiddle'.w()
      }),

      scoreView: Geniverse.ScoreView.design({
        layout: { top: 175, centerX: 60, width: 150, height: 46 },
        showScore: YES,
        isVisibleBinding: SC.Binding.oneWay('Geniverse.activityController.isArgumentationChallenge').not(),
        showTargetScore: YES
      }),

      chromosome1HintView: SC.View.design({
        layout: {left: 29, top: 228, height: 385, width: 20 },
        toolTip: "Set the alleles to increase your chances of breeding the target drake. Each change costs a move.",
        classNames: 'hint-available-no-show hint-target-rightMiddle hint-tooltip-leftBottom'.w()
      }),

      chromosome2HintView: SC.View.design({
        layout: {left: 175, top: 228, height: 385, width: 20 },
        toolTip: "Set the alleles to increase your chances of breeding the target drake. Each change costs a move.",
        classNames: 'hint-available hint-target-rightMiddle hint-tooltip-leftBottom'.w()
      }),

      chromosome3HintView: SC.View.design({
        layout: {left: 725, top: 228, height: 385, width: 20 },
        toolTip: "Set the alleles to increase your chances of breeding the target drake. Each change costs a move.",
        classNames: 'hint-available-no-show hint-target-rightMiddle hint-tooltip-leftBottom'.w()
      }),

      chromosome4HintView: SC.View.design({
        layout: {left: 870, top: 228, height: 385, width: 20 },
        toolTip: "Set the alleles to increase your chances of breeding the target drake. Each change costs a move.",
        classNames: 'hint-available-no-show hint-target-rightMiddle hint-tooltip-leftBottom'.w()
      })
    })
  })
});
