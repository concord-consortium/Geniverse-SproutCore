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

    layout: { left: 0, top: 0, width: 800, height: 1322 },

    mainAppView: SC.View.design({

      childViews: 'genomePanel scoreLabel targetDrakes targetTitle yourTitle chromoTitle line'.w(),

      layout: { left: 0, top: 100, width: 800, height: 1222 },

      line: SC.View.design({
        layout: {top: 25+280+49+40, centerX: 0, width: 2, bottom: 110},
        classNames: ['genome-view-intro']
      }),

      genomePanel: SC.View.design({
            layout: { left: 0, top: 0, height: 1322, width: 800 },
            childViews: 'genomeView switchSexButton revealButton'.w(),

            switchSexButton: SC.ImageView.design(Geniverse.SimpleButton, {
                layout: { top: 25+280+49+25+275+60, centerX: 110, width: 100, height: 43 },
                isEnabled: YES,
                hasHover: YES,
                classNames: "switchsex switch-female".w(),
                alt: 'Switch Sex',
                title: 'Switch Sex',
                sexBinding: '*parentView.genomeView.sex',
                toolTip: 'Click to switch the sex of the dragon',
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
                layout: {top: 25+280+49+25+50, centerX: -260, height: 500, width: 510 },
                classNames: ['overflowVis'],
                dragonView: Geniverse.OrganismView.design({
                    layout: {top: 20, left: 510+30, width: 200, height: 215},
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
                layout: { height: 24, top: 25+280+49+25+425+60, width: 120, centerX: -120 },
                title: "Enter",
                action: "revealClicked",
                target: "Lab.statechart"
            })
      }),

      scoreLabel: Geniverse.ScoreView.design({
            layout: { centerX: 0, top: 25+10+280+10, height: 49, width: 184 },
            showScore: YES,
            isVisibleBinding: SC.Binding.oneWay('Geniverse.activityController.isArgumentationChallenge').not(),
            showTargetScore: YES
      }),

      targetDrakes: Geniverse.MatchView.design({
            layout: { centerX: 0, top: 35, height: 280, width: 210 },
            onlyOne: YES,
            // FIXME dragonSize of 200 or 201 causes Chrome and Firefox to freeze when zooming in/out
            // It's some sort of bad interaction with the Geniverse.ShiftedOrganism mixin
            dragonSize: 202,
      }),

      targetTitle: SC.LabelView.design({
        layout: {top: 0, height: 25, centerX: 0, width: 200 },
        textAlign:SC.ALIGN_CENTER,
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        classNames: 'title'.w(),
        value: "Target Dragon"
      }),

      yourTitle: SC.LabelView.design({
        layout: {top: 25+10+280+10+49+10+10, height: 25, centerX: 130, width: 200 },
        textAlign:SC.ALIGN_CENTER,
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        classNames: 'title'.w(),
        value: "Your Dragon"
      }),

      chromoTitle: SC.LabelView.design({
        layout: {top: 25+10+280+10+49+10+10, height: 25, centerX: -130, width: 200 },
        textAlign:SC.ALIGN_CENTER,
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        classNames: 'title'.w(),
        value: "Chromosome Control"
      })

    })
  })
});
