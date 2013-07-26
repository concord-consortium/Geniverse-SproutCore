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

Lab.meiosisPageSkip = SC.Page.design({

  pagePath: 'Lab.meiosisPageSkip',
  title: 'Meiosis Page',

//  challengeType: 'matchOneAtATimeChallenge',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: Lab.LabPane.design({

   layout: { left: 0, top: 0, width: 800, height: 1400 },

    mainAppView: SC.View.design({

      childViews: 'genomePanel'.w(),

      layout: { left: 0, top: 100, width: 800, height: 1300 },

      genomePanel: SC.View.design({
        layout: {top: 0, bottom: 0, left: 0, right: 0 },
        childViews: 'mothersPoolView fathersPoolView femaleView motherMeiosis offspringTitle offspringView maleView fatherMeiosis fertilization matchView scoreView nextButton glowHint playHint gametesHint retryHint fertilizationPlayHint targetHint'.w(),
        // childViews: 'femaleTitle femaleView offspringTitle offspringView maleTitle maleView'.w(),

        // challenge pool to hold initial, system-created dragons
        mothersPoolView: Lab.ChallengePoolView.design({
          layout: { centerX:-155, top: 10, width:300, height: 97 },
          sex: "female"
        }),

        fathersPoolView: Lab.ChallengePoolView.design({
          layout: { centerX:155, top: 10, width:300, height: 97 },
          sex: "male"
        }),

        femaleView: Geniverse.OrganismView.design({
          layout: {top: 107, centerX:-55, height: 100, width: 100 },
          classNames: "sc-theme motherView opaque".w(),
          contentBinding: 'Geniverse.meiosisAnimationController.mother',
          label: "Mother",
          showLabel: true,
          sex: 1,
          isDropTarget: YES,
          trackScore: YES,
          glow: YES,
          acceptsOffspringDrop: NO
        }),

        maleView: Geniverse.OrganismView.design({
          layout: {top: 107, centerX:55, height: 100, width: 100 },
          classNames: "sc-theme fatherView opaque".w(),
          contentBinding: 'Geniverse.meiosisAnimationController.father',
          label: "Father",
          showLabel: true,
          sex: 0,
          isDropTarget: YES,
          trackScore: YES,
          glow: YES,
          acceptsOffspringDrop: NO
        }),

        // geneMap can be json object or url to file containing json object - dan
        motherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 217, centerX:-167, height: 360, width: 325 },
          mode: 'parent',
          swapping: false,
          meiosisOwner: 'mother',
          dragonBinding: 'Geniverse.meiosisAnimationController.mother',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson'
        }),

        fatherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 217, centerX:167, height: 360, width: 325 },
          mode: 'parent',
          swapping: false,
          meiosisOwner: 'father',
          dragonBinding: 'Geniverse.meiosisAnimationController.father',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.fatherGameteJson'
        }),

        fertilization: Geniverse.AnimationView.design({
          layout: {top: 217+360+10, centerX: 0, height: 360, width: 325 },
          mode: 'offspring',
          meiosisOwner: 'offspring',
          motherJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson',
          fatherJsonBinding: 'Geniverse.meiosisAnimationController.fatherGameteJson',
          trackScoreOnPlayButton: YES
        }),

        offspringTitle: SC.LabelView.design({
          layout: {top: 217+360+10+360+10, centerX: 0, height: 25, width: 140 },
          fontWeight: SC.BOLD_WEIGHT,
          value: "Offspring Dragon"
        }),

        offspringView: SC.View.design({
          layout: {top: 217+360+10+360+10+25+10, centerX: 0, height: 100, width: 100 },
          childViews: 'org'.w(),
          org: Geniverse.OrganismView.design({
            layout: {left: 0, right: 0, top: 0, bottom: 0},
            contentBinding: 'Geniverse.meiosisAnimationController.offspring',
            canDrag: YES
          })
        }),

        matchView: Geniverse.MatchView.design({
          layout: { top: 217+360+10+360+10+25+10+100+10, centerX: 0, height: 120, width: 400 },
          dragonSize: 100
        }),

        scoreView: Geniverse.ScoreView.design({
          layout: { top: 148, left: 100, height: 46, width: 165 },
          showScore: YES,
          isVisibleBinding: SC.Binding.oneWay('Geniverse.activityController.isArgumentationChallenge').not(),
          showTargetScore: YES
        }),

		nextButton: SC.ImageView.design(Geniverse.SimpleButton, {
          layout: {top: 217+360+10+360+10+25+10+100+10, centerX: 200, width: 118, height: 27},
          isEnabled: YES,
          hasHover: YES,
          isVisibleBinding: SC.Binding.oneWay('Geniverse.activityController.isArgumentationChallenge'),
          classNames: 'bringItButton'.w(),
          alt: 'Bring it on!',
          title: 'Bring it on!',
          toolTip: 'Click when ready for the next challenge.',
          target: 'Lab.statechart',
          action: 'bringItOnClicked'
        }),


        // special views for extact-positioning of hints
        glowHint: SC.View.design({
          layout: { top: 125, left: 420, height: 80, width: 80 },
          toolTip: "Drag parents to these yellow spots.",
          classNames: "hint-available hint-target-rightMiddle hint-tooltip-leftMiddle".w()
        }),

        playHint: SC.View.design({
          layout: { top: 565, left: 460, height: 10, width: 10 },
          toolTip: "Press run to create four eggs or sperm through the process of meiosis.",
          classNames: "hint-available hint-tooltip-topLeft".w()
        }),

        gametesHint: SC.View.design({
          layout: { top: 215, left: 615, height: 10, width: 10 },
          toolTip: "Check the chromosomes in each sperm or egg.  Select one sperm and one egg to use to create a baby dragon.",
          classNames: "meiosis-completion-hint hint-tooltip-bottomMiddle".w()
        }),

        retryHint: SC.View.design({
          layout: { top: 565, left: 520, height: 10, width: 10 },
          toolTip: "Meiosis is random.  Each time you run it, there will be a different combination of alleles on the chromosomes!",
          classNames: "meiosis-completion-hint hint-tooltip-topLeft".w()
        }),

        fertilizationPlayHint: SC.View.design({
          layout: { top: 940, left: 290, height: 10, width: 10 },
          toolTip: "Click run to fertilize the egg and make a new baby dragon!",
          classNames: "fertilization-ready-hint hint-tooltip-topRight".w()
        }),

        targetHint: SC.View.design({
          layout: { top: 1160, left: 500, height: 10, width: 10 },
          toolTip: "Drag the offspring to match the target dragons. If it doesn't match, choose a different sperm and egg.  Make sure you look at the alleles first!",
          classNames: "fertilization-ready-hint hint-tooltip-leftBottom".w()
        })
      })
    })
  })
});
