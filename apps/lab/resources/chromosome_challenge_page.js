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

Lab.chromosomeChallengePage = SC.Page.design({

  pagePath: 'Lab.chromosomeChallengePage',
  title: 'Chromosome Challenge Page',
  challengeType: 'matchOneAtATimeChallenge',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: Lab.LabPane.design({
    mainAppView: SC.View.design({

      childViews: 'line genomePanel scoreLabel targetDrakes targetTitle yourTitle chromoTitle drakeHintView'.w(),

      layout: { centerX: 0, top: 90, width: 850, height: 560 },

      line: SC.View.design({
        layout: {top: 80, left: 280, width: 2, bottom: 110},
        classNames: ['genome-view-intro']
      }),

      genomePanel: SC.View.design({
        layout: {top: 40, height: 530, right: 0, width: 580 },
        childViews: 'genomeView switchSexButton revealButton'.w(),

        switchSexButton: SC.ImageView.design(Geniverse.SimpleButton,
                                             Geniverse.ChangeSexButton, {
          layout: { top: 268, left: 53,
                    width: Geniverse.ChangeSexButton.WIDTH,
                    height: Geniverse.ChangeSexButton.HEIGHT }
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
          target: "Lab.statechart",
          classNames: "hint-available hint-target-rightMiddle hint-tooltip-leftMiddle",
          toolTip: "Click this to reveal your drake.  Does it match the target?"
        })
      }),

      scoreLabel: Geniverse.ScoreView.design({
        layout: { left: 53, top: 370, height: 49, width: 184 },
        showScore: YES,
        isVisibleBinding: SC.Binding.oneWay('Geniverse.activityController.isArgumentationChallenge').not(),
        showTargetScore: YES,
        toolTip: "To win the most stars, make the fewest number of allele and male/female changes.",
        classNames: "hint-available hint-target-rightMiddle hint-tooltip-leftTop"
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
        classNames: 'title'.w(),
        value: "Target Drake"
      }),

      yourTitle: SC.LabelView.design({
        layout: {top: 40, height: 25, left: 345, width: 200 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        classNames: 'title'.w(),
        value: "Your Drake"
      }),

      chromoTitle: SC.LabelView.design({
        layout: {top: 40, height: 25, left: 545, width: 200 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        classNames: 'title'.w(),
        value: "Chromosome Control"
      }),

      drakeHintView: SC.View.design({
        layout: { top: 55, left: 288, width: 245, height: 231 },
        toolTip: 'Your drake is hidden. Change the alleles until you think it matches the target.',
        classNames: "hint-available hint-target-topMiddle hint-tooltip-bottomMiddle"
      })

    })
  })
});
