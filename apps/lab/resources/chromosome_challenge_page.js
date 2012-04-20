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

      childViews: 'background genomePanel scoreLabel targetDrakes targetTitle yourTitle chromoTitle line'.w(),

      layout: { centerX: 0, top: 40, width: 850, height: 560 },

      // separate parallel background so we don't make the rest of the childViews see-through
      background: SC.View.design({
        layout: {top: 0, left: 0, right: 0, bottom: 0},
        classNames: ['genome-view-intro']
      }),

      line: SC.View.design({
        layout: {top: 80, left: 280, width: 2, bottom: 110},
        classNames: ['genome-view-intro']
      }),

      genomePanel: SC.View.design({
        layout: {top: 40, height: 530, right: 50, width: 530 },
        childViews: 'switchSexButton genomeView revealButton'.w(),

        switchSexButton: SC.ImageView.design(Geniverse.SimpleButton, {
          layout: { top: 295, left: 60, width: 100, height: 43 },
          isEnabled: YES,
          hasHover: YES,
          classNames: "switchsex switch-female".w(),
          alt: 'Switch Sex',
          title: 'Switch Sex',
          sexBinding: '*parentView.genomeView.sex',
          toolTip: 'Click to switch the sex of the drake',
          target: 'parentView.genomeView',
          action: 'switchSex',
          _setClassNames: function(){
            classNames = this.get('classNames');
            classNames.removeObject("switch-female");
            classNames.removeObject("switch-male");

            classNames.push( this.getPath('parentView.genomeView.sex') === 0 ? "switch-male" : "switch-female");
            this.set('classNames', classNames);
            this.displayDidChange();
          }.observes('sex')

        }),

        genomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 35, left: 15, height: 500, width: 550 },
          dragonOnRight: YES,
          generateDragonAtStart: NO,
          sex: 1,
          displayChallengeDragon: YES,
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO,
          hideDragon: YES,
          trackScore: YES,
          revealButtonNeedsEnabled: function() {
            this.set('revealButtonEnabled', this.get('allAllelesSelected'));
          }.observes('allAllelesSelected'),
          showEmptyOptions: NO,
          showFromLabels: NO,
          startWithEmptyOptions: NO
        }),

        revealButton: SC.ButtonView.design({
          layout: { height: 24, bottom: 30, width: 120, right: 100 },
          title: "Enter",
          action: "revealClicked",
          target: "Lab.statechart"
        })
      }),

      scoreLabel: Geniverse.ScoreView.design({
        layout: { left: 53, top: 370, height: 49, width: 184 },
        showScore: YES,
        showTargetScore: YES
      }),

      targetDrakes: Geniverse.MatchView.design({
        layout: { left: 40, top: 60, height: 280, width: 210 },
        onlyOne: YES,
        dragonSize: 200
      }),

      targetTitle: SC.LabelView.design({
        layout: {top: 40, height: 25, left: 75, width: 200 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        value: "Target Drake"
      }),
      
      yourTitle: SC.LabelView.design({
        layout: {top: 40, height: 25, left: 330, width: 200 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        value: "Your Drake"
      }),
      
      chromoTitle: SC.LabelView.design({
        layout: {top: 40, height: 25, left: 545, width: 200 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        value: "Chromosome Control"
      })
      
    })
  })
});
