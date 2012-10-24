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
sc_require('views/background');

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
    backgroundView: Lab.BackgroundView.design(),
    topBar: Lab.TopBarView.design({
      classNames: ['brown']
    }),
    bottomBar: Lab.BottomBarView.design({
      classNames: ['brown']
    }),

    mainAppView: SC.View.design({

      childViews: 'genomePanel scoreLabel targetDrakes targetTitle yourTitle chromoTitle line'.w(),

      layout: { centerX: 0, top: 90, width: 850, height: 560 },

      line: SC.View.design({
        layout: {top: 80, left: 280, width: 2, bottom: 110},
        classNames: ['genome-view-intro']
      }),

      genomePanel: SC.View.design({
        layout: {top: 40, height: 530, right: 0, width: 580 },
        childViews: 'genomeView switchSexButton revealButton'.w(),

        switchSexButton: SC.ImageView.design(Geniverse.SimpleButton, {
          layout: { top: 268, left: 85, width: 100, height: 43 },
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
          layout: {top: 35, right: -120, height: 500, width: 630 },
          classNames: ['overflowVis'],
          dragonView: Geniverse.OrganismView.design({
            layout: {top: 0, left: -35, width: 200, height: 215},
            contentBinding: "*parentView.dragon",
            allowDrop: YES,
            isVisibleBinding: "*parentView.showDragon",
            useRevealButtonBinding: "*parentView.useRevealButton",
            revealButtonEnabledBinding: "*parentView.revealButtonEnabled",
            hideDragonBinding: "*parentView.hideDragon",
            showBackground: NO,
            glow: YES
          }),
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
        isVisibleBinding: SC.Binding.oneWay('Geniverse.activityController.isArgumentationChallenge').not(),
        showTargetScore: YES
      }),

      targetDrakes: Geniverse.MatchView.design({
        layout: { left: 40, top: 60, height: 280, width: 210 },
        onlyOne: YES,
        // FIXME dragonSize of 200 or 201 causes Chrome and Firefox to freeze when zooming in/out
        // It's some sort of bad interaction with the Geniverse.ShiftedOrganism mixin
        dragonSize: 202
      }),

      targetTitle: SC.LabelView.design({
        layout: {top: 40, height: 25, left: 75, width: 200 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        value: "Target Drake"
      }),
      
      yourTitle: SC.LabelView.design({
        layout: {top: 40, height: 25, left: 345, width: 200 },
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
