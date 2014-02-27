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
    mainAppView: SC.View.design({

      childViews: 'genomePanel'.w(),

      genomePanel: SC.View.design({
        layout: {centerX: -30, top: 100, width: 680, height: 630 },
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
          value: "Parent Drake"
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
          action: 'gotoNextActivity'
        }),

        // special views for extact-positioning of hints
        glowHint: SC.View.design({
          layout: { top: 157, centerX: 0, height: 100, width: 100 },
          toolTip: "Drag a drake from the parent pool above to this yellow spot.",
          classNames: "hint-available".w()
        }),

        playHint: SC.View.design({
          layout: { top: 593, left: 177, height: 10, width: 10 },
          toolTip: "Click Play to create four eggs or sperm through the process of meiosis.",
          classNames: "meiosis-ready-hint hint-target-leftMiddle hint-tooltip-rightBottom".w()
        }),

        gametesHint: SC.View.design({
          layout: { top: 325, left: 505, height: 10, width: 10 },
          toolTip: "Each egg or sperm contains three chromosomes. Hover over chromosome to see the alleles.",
          classNames: "meiosis-completion-hint hint-tooltip-leftMiddle".w()
        }),

        retryHint: SC.View.design({
          layout: { top: 593, left: 177, height: 10, width: 10 },
          toolTip: "Meiosis assorts the chromosomes randomly. Click Retry to try your luck again!",
          classNames: "meiosis-completion-hint hint-target-leftMiddle hint-tooltip-rightBottom".w()
        })
      })
    })
  })
});
