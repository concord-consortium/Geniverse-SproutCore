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

    layout: { left: 0, top: 0, width: 800, height: 1400 },

    mainAppView: SC.View.design({

      layout: { left: 0, top: 100, width: 800, height: 1300 },

      childViews: 'genomePanel breedingPenView matchView scoreView targetHintView'.w(),

      genomePanel: SC.View.design({
        layout: { left: 0, top: 0, width: 800, height: 1300 },
        childViews: 'femaleTitle femaleGenomeView femalePhenotypeView maleTitle maleGenomeView malePhenotypeView breedButton chromosomeHintView'.w(),

        femaleTitle: SC.LabelView.design({
          layout: {top: 0, height: 25, centerX: -110, width: 200 },
          textAlign:SC.ALIGN_CENTER,
          controlSize: SC.LARGE_CONTROL_SIZE,
          classNames: 'title'.w(),
          value: "Female Dragon"
        }),

        femalePhenotypeView: Geniverse.OrganismView.design({
          layout: {top: 35, centerX: -110, width: 200, height: 200},
          contentBinding: "*parentView.femaleGenomeView.dragon",
          allowDrop: NO,
          showBackground: NO,
          glow: YES
        }),

        femaleGenomeView: Lab.DragonBreedingGenomeView.design({
          layout: {top: 245, centerX: -50, height: 500, width: 500 },
          sex: 1,
          index: 1
        }),

        maleTitle: SC.LabelView.design({
          layout: {top: 0, height: 25, centerX: 110, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          classNames: 'title'.w(),
          value: "Male Dragon"
        }),

        malePhenotypeView: Geniverse.OrganismView.design({
          layout: {top: 35, centerX: 110, width: 200, height: 200},
          contentBinding: "*parentView.maleGenomeView.dragon",
          allowDrop: NO,
          showBackground: NO,
          glow: YES
        }),

        maleGenomeView: Lab.DragonBreedingGenomeView.design({
          layout: {top: 245, centerX: 80, height: 500, width: 500 },
          sex: 0,
          index: 2,
          dragonOnRight: YES
        }),

        breedButton: SC.ButtonView.design({
          layout: { top: 245+440, centerX: 0, width: 100, height: 24 },
          target: 'Geniverse.breedDragonController',
          action: "breed",
          isBreedingBinding: 'Geniverse.breedDragonController.isBreeding',
          hasParentsBinding: 'Geniverse.breedDragonController.hasParents',
          isEnabled: function() {
            return (this.get('hasParents') && !this.get('isBreeding'));
          }.property('hasParents', 'isBreeding').cacheable(),

          title: function () {
            return this.get('isBreeding') ? 'Breeding...' :  'Breed';
          }.property('isBreeding').cacheable(),

          toolTip: "Press the breed button to create a herd of baby dragons.",
          classNames: 'hint-available'.w()
        }),

        chromosomeHintView: SC.View.design({
          layout: {top: 370, left: 90, height: 100, width: 300 },
          toolTip: "Select alleles for each gene so that a baby dragon will match the target.",
          classNames: 'hint-available hint-target-rightTop hint-tooltip-leftTop'.w()
        })

      }),

      // Breeding pen with eggs
      breedingPenView: Lab.BreedingPenView.design({
        layout: { centerX: 0, top: 245+450+10+20, width: 380, height: 350 },
        breedingRecordRight: -20
      }),

      matchView: Geniverse.MatchView.design({
        layout: { centerX: 0, top: 245+450+10+350+20, height: 190, width: 270 },
        onlyOne: YES,
        labelPosition: "right",
        dragonSize: 170
      }),

      scoreView: Geniverse.ScoreView.design({
        layout: { top: 245+450+10+350+20+20, centerX: 116, width: 150, height: 46 },
        showScore: YES,
        isVisibleBinding: SC.Binding.oneWay('Geniverse.activityController.isArgumentationChallenge').not(),
        showTargetScore: YES
      }),

      targetHintView: SC.View.design({
        layout: {centerX: 0, top: 245+450+10+350+20, height: 190, width: 270 },
        toolTip: "Drag a matching baby dragon from the herd onto the target.  If you can’t match the target, change the alleles and try again!",
        classNames: 'hint-available hint-tooltip-bottomRight'.w()
      })
    })
  })
});
