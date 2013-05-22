// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CC, CcChat, java static_url sc_static sc_require */
Lab.marginSize = 15;

sc_require('views/lab_pane');
sc_require('views/challenge_pool_view');

Lab.singleMeiosisPage = SC.Page.design({

  pagePath: 'Lab.singleMeiosisPage',
  title: 'Simple Meiosis Page',

  // challengeType: 'matchOneAtATimeChallenge',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: Lab.LabPane.design({

    layout: { left: 0, top: 0, width: 800, height: 1400 },

    mainAppView: SC.View.design({

	  layout: { left: 0, top: 0, width: 800, height: 1300 },

      childViews: 'genomePanel'.w(),

      genomePanel: SC.View.design({
        layout: {centerX: 0, top: 100, width: 800, height: 1000 },

        childViews: 'challengePoolView parentTitle drakeParentView meiosisView nextButton glowHint playHint gametesHint retryHint'.w(),

      // using horizontal Challenge Pool at top with 120-px drakes inside
      // this will necessitate moving everything down ~130px
      // In actuality, moving them down about 6px more to avoid cutting off label
        challengePoolView: Lab.ChallengePoolView.design({
          layout: { centerX: 0, top: 10, width:410, height: 120 },
          dragonSize: 100
        }),

        parentTitle: SC.LabelView.design({
          layout: {top: 133, centerX: 0, height: 25, width: 120 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          classNames: 'title'.w(),
          value: "Parent Dragon"
        }),

        drakeParentView: Geniverse.OrganismView.design({
          layout: {top: 157, centerX: 0, height: 100, width: 100 },
          contentBinding: 'Geniverse.meiosisAnimationController.mother',
          isDropTarget: YES,
          glow: YES
          }),

        meiosisView: Geniverse.AnimationView.design({
          layout: {top: 271, centerX: 0, height: 360, width: 325 },
          mode: 'parent',
          swapping: false,
          meiosisOwner: 'mother',
          dragonBinding: 'Geniverse.meiosisAnimationController.mother',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson'
        }),

        nextButton: SC.ImageView.design(Geniverse.SimpleButton, {
          layout: {centerX: 270, top: 58, width: 118, height: 27},
          isEnabled: YES,
          hasHover: YES,
          classNames: 'bringItButton'.w(),
          alt: 'Bring it on!',
          title: 'Bring it on!',
          toolTip: 'Click when ready for the challenge.',
          target: 'Lab.statechart',
          action: 'bringItOnClicked'
        }),

        // special views for extact-positioning of hints
        glowHint: SC.View.design({
          layout: { top: 157, centerX: 0, height: 100, width: 100 },
          toolTip: "Drag a dragon from the parent pool above to this yellow spot.",
          classNames: "hint-available".w()
        }),

        playHint: SC.View.design({
          layout: { top: 625, left: 290, height: 10, width: 10 },
          toolTip: "Press run to create four eggs or sperm through the process of meiosis.",
          classNames: "hint-available hint-tooltip-topLeft".w()
        }),

        gametesHint: SC.View.design({
          layout: { top: 325, left: 570, height: 10, width: 10 },
          toolTip: "Each egg or sperm contains 3 chromosomes. Click each chromosome to see the alleles.",
          classNames: "meiosis-completion-hint hint-tooltip-leftMiddle".w()
        }),

        retryHint: SC.View.design({
          layout: { top: 625, left: 350, height: 10, width: 10 },
          toolTip: "Meiosis is random.  Each time you run it, there will be a different combination of alleles on the chromosomes!",
          classNames: "meiosis-completion-hint hint-tooltip-topLeft".w()
        })
      })
    })
  })
});
