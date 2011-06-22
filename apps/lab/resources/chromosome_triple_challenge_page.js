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

Lab.chromosomeTripleChallengePage = SC.Page.design({
  
  pagePath: 'Lab.chromosomeTripleChallengePage',
  title: 'Chromosome Triple Challenge Page',
  challengeType: 'matchThreeToOneChallenge',
  
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
      
      childViews: 'revealButton genome1Panel genome2Panel genome3Panel targetDrakes'.w(),
      
      genome1Panel: SC.View.design({
        layout: {top: 250, height: 660, left: 15, width: 300 },
        childViews: 'background title genomeView phenotypeView'.w(),

        // separate parallel background so we don't make the rest of the childViews see-through
        background: SC.View.design({
          layout: {top: 0, left: 0, right: 0, bottom: 0},
          classNames: ['genome-view-intro']
        }),

        phenotypeView: Geniverse.OrganismView.design({
          layout: {top: -30, left: 50, width: 200, height: 200},
          contentBinding: "*parentView.genomeView.dragon",
          allowDrop: NO,
          showBackground: NO,
          hideDragon: YES
        }),

        title: SC.LabelView.design({
          layout: {top: 150, height: 25, left: 20, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          sexBinding: '*parentView.genomeView.sex',
          value: function() {
            return (this.get('sex') === 0 ? "Male " : "Female ") + "Drake";
          }.property('sex')
        }),

        genomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 185, left: 15, height: 500, width: 300 },
          generateDragonAtStart: NO,
          sex: 1,
          showSwitchSex: YES,
          showDragon: NO,
          displayChallengeDragon: YES,
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO,
          showEmptyOptions: YES,
          startWithEmptyOptions: YES
        })
      }),

      genome2Panel: SC.View.design({
        layout: {top: 250, height: 660, left: 330, width: 300 },
        childViews: 'background title genomeView phenotypeView'.w(),

        // separate parallel background so we don't make the rest of the childViews see-through
        background: SC.View.design({
          layout: {top: 0, left: 0, right: 0, bottom: 0},
          classNames: ['genome-view-intro']
        }),

        phenotypeView: Geniverse.OrganismView.design({
          layout: {top: -30, left: 50, width: 200, height: 200},
          contentBinding: "*parentView.genomeView.dragon",
          allowDrop: NO,
          showBackground: NO,
          hideDragon: YES
        }),

        title: SC.LabelView.design({
          layout: {top: 150, height: 25, left: 20, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          sexBinding: '*parentView.genomeView.sex',
          value: function() {
            return (this.get('sex') === 0 ? "Male " : "Female ") + "Drake";
          }.property('sex')
        }),

        genomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 185, left: 15, height: 500, width: 300 },
          generateDragonAtStart: NO,
          sex: 1,
          showSwitchSex: YES,
          showDragon: NO,
          displayChallengeDragon: YES,
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO,
          showEmptyOptions: YES,
          startWithEmptyOptions: YES
        })
      }),

      genome3Panel: SC.View.design({
        layout: {top: 250, height: 660, left: 645, width: 300 },
        childViews: 'background title genomeView phenotypeView'.w(),

        // separate parallel background so we don't make the rest of the childViews see-through
        background: SC.View.design({
          layout: {top: 0, left: 0, right: 0, bottom: 0},
          classNames: ['genome-view-intro']
        }),

        phenotypeView: Geniverse.OrganismView.design({
          layout: {top: -30, left: 50, width: 200, height: 200},
          contentBinding: "*parentView.genomeView.dragon",
          allowDrop: NO,
          showBackground: NO,
          hideDragon: YES
        }),

        title: SC.LabelView.design({
          layout: {top: 150, height: 25, left: 20, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          sexBinding: '*parentView.genomeView.sex',
          value: function() {
            return (this.get('sex') === 0 ? "Male " : "Female ") + "Drake";
          }.property('sex')
        }),

        genomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 185, left: 15, height: 500, width: 300 },
          generateDragonAtStart: NO,
          sex: 1,
          showSwitchSex: YES,
          showDragon: NO,
          displayChallengeDragon: YES,
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO,
          showEmptyOptions: YES,
          startWithEmptyOptions: YES
        })
      }),

      revealButton: SC.ButtonView.design({
        layout: { top: 218, height: 24, left: 425, width: 100 },
        title: "Reveal All",
        isEnabled: YES,
        action: "revealClicked",
        target: "Lab.statechart"
      }),
  
      targetDrakes: Geniverse.MatchView.design({
        layout: { left: 398, top: 40, height: 170, width: 170 },
        onlyOne: YES,
        dragonSize: 150
      }),

      organismViews: function() {
        return [this.getPath('genome1Panel.phenotypeView'),
        this.getPath('genome2Panel.phenotypeView'),
        this.getPath('genome3Panel.phenotypeView') ];
      }.property('*genome1Panel.phenotypeView', '*genome2Panel.phenotypeView', '*genome3Panel.phenotypeView').cacheable()
    })
  })
});
