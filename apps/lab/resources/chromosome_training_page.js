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

Lab.chromosomeTrainingPage = SC.Page.design({

  pagePath: 'Lab.chromosomeTrainingPage',
  title: 'Chromosome Training Page',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: Lab.LabPane.design({
    mainAppView: SC.View.design({

      layout: { centerX: 0, top: 100, width: 1150, height: 600 },
      childViews: 'femaleGenomePanel maleGenomePanel'.w(),

      femaleGenomePanel: SC.View.design({
        layout: {top: 50, height: 550, left: 15, width: 500 },
        childViews: 'title genomeView'.w(),

        title: SC.LabelView.design({
          layout: {top: 20, height: 25, left: 20, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          classNames: 'title'.w(),
          value: "Female Drake"
        }),

        genomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 80, left: 15, height: 500, width: 500 },
          index: 1,
          generateDragonAtStart: NO,
          displayChallengeDragon: YES,
          sex: 1,
//        fixedAlleles: "a:A,a:A,a:B,b:B",
          showGenerateNewDragon: NO,
          showFromLabels: NO,
          showIsEditableCheck: NO
        })

      }),

      maleGenomePanel: SC.View.design({
        layout: {top: 50, height: 550, left: 600, width: 500 },
        childViews: 'maleTitle maleGenomeView'.w(),

        maleTitle: SC.LabelView.design({
          layout: {top: 20, height: 25, left: 20, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          classNames: 'title'.w(),
          value: "Male Drake"
        }),

        maleGenomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 80, left: 15, height: 500, width: 500 },
          index: 2,
          generateDragonAtStart: NO,
          displayChallengeDragon: YES,
          sex: 0,
//        fixedAlleles: "a:A,a:A,a:B,b:B",
          showGenerateNewDragon: NO,
          showFromLabels: NO,
          showIsEditableCheck: NO
        })

      })

    })
  })
});
