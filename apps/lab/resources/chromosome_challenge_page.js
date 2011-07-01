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

Lab.chromosomeChallengePage = SC.Page.design({
  
  pagePath: 'Lab.chromosomeChallengePage',
  title: 'Chromosome Challenge Page',
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
      
      childViews: 'genomePanel scoreLabel targetDrakes'.w(),
      
      genomePanel: SC.View.design({
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
          sexBinding: '*parentView.genomeView.sex',
          value: function() {
            return (this.get('sex') === 0 ? "Male " : "Female ") + "Drake";
          }.property('sex')
        }),

        genomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 80, left: 15, height: 500, width: 500 },
          generateDragonAtStart: NO,
          sex: 1,
          showSwitchSex: YES,
          displayChallengeDragon: YES,
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO,
          useRevealButton: YES,
          trackScore: YES,
          revealButtonNeedsEnabled: function() {
            this.set('revealButtonEnabled', this.get('allAllelesSelected'));
          }.observes('allAllelesSelected'),
          showEmptyOptions: NO,
          showFromLabels: NO,
          startWithEmptyOptions: NO
        })
      }),

      scoreLabel: Geniverse.ScoreView.design({
        layout: { left: 530, top: 210, height: 24, width: 170 },
        showScore: YES,
        showTargetScore: NO
      }),

      targetDrakes: Geniverse.MatchView.design({
        layout: { left: 530, top: 240, height: 170, width: 170 },
        onlyOne: YES,
        dragonSize: 150
      })
    })
  })
});
