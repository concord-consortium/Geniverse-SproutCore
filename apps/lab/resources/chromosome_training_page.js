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

Lab.chromosomeTrainingPage = SC.Page.design({
  
  pagePath: 'Lab.chromosomeTrainingPage',
  title: 'Chromosome Training Page',
  
  challengeType: 'matchOneAtATimeChallenge',
  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'], 
    childViews: 'backgroundView mainAppView topBar bottomBar'.w(),
    backgroundView: SC.ImageView.design({
      value: static_url('lab_background.png'),
      classNames: ['transparent','scalingimage']
    }),
    topBar: Lab.TopBarView.design({
      classNames: ['brown']
    }),
    bottomBar: Lab.BottomBarView.design({
      classNames: ['brown']
    }),

    mainAppView: SC.View.design({
      
      childViews: 'femaleGenomePanel maleGenomePanel'.w(),
      
      femaleGenomePanel: SC.View.design({
        layout: {top: 50, height: 550, left: 15, width: 500 },
        childViews: 'background title genomeView'.w(),

        // separate parallel background so we don't make the rest of the childViews see-through
        background: SC.View.design({
          layout: {top: 0, left: 0, right: 0, bottom: 0},
          classNames: ['genome-view-intro']
        }),

        title: SC.LabelView.design({
          layout: {top: 20, height: 25, left: 20, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          value: "Female Drake"
        }),

        genomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 80, left: 15, height: 500, width: 500 },
          generateDragonAtStart: NO,
          displayChallengeDragon: YES,
          sex: 1,
//        fixedAlleles: "a:A,a:A,a:B,b:B",
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO,
          useRevealButton: YES
        })

      }),
      
      maleGenomePanel: SC.View.design({
        layout: {top: 50, height: 550, left: 600, width: 500 },
        childViews: 'background maleTitle maleGenomeView'.w(),

        // separate parallel background so we don't make the rest of the childViews see-through
        background: SC.View.design({
          layout: {top: 0, left: 0, right: 0, bottom: 0},
          classNames: ['genome-view-intro']
        }),

        maleTitle: SC.LabelView.design({
          layout: {top: 20, height: 25, left: 20, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          value: "Male Drake"
        }),

        maleGenomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 80, left: 15, height: 500, width: 500 },
          generateDragonAtStart: NO,
          displayChallengeDragon: YES,
          sex: 0,
//        fixedAlleles: "a:A,a:A,a:B,b:B",
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO
        })

      })
      
  	})
	})
});
