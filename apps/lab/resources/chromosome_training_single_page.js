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

Lab.chromosomeTrainingSinglePage = SC.Page.design({

  pagePath: 'Lab.chromosomeTrainingSinglePage',
  title: 'Chromosome Training Page',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: Lab.LabPane.design({
    mainAppView: SC.View.design({

      childViews: 'drakeGenomePanel'.w(),

      drakeGenomePanel: SC.View.design({
        layout: {top: 110, height: 550, centerX: 0, width: 550 },
        childViews: 'chromoTitle drakeTitle genomeView switchSexButton nextButton chromoHintView'.w(),

        chromoTitle: SC.LabelView.design({
          layout: {top: 20, height: 25, left: 75, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          classNames: 'title'.w(),
          value: "Chromosome Control"
        }),

        drakeTitle: SC.LabelView.design({
          layout: {top: 20, height: 25, left: 380, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          classNames: 'title'.w(),
          sexBinding: '*parentView.genomeView.sex',
          value: function() {
            return (this.get('sex') === 0 ? "Male " : "Female ") + "Drake";
          }.property('sex')
        }),

        switchSexButton: SC.ImageView.design(Geniverse.SimpleButton,
                                             Geniverse.ChangeSexButton, {
          layout: { top: 350, left: 320, width: 200, height: 38 },
          classNames: "switchsex switch-female hint-available hint-target-leftMiddle hint-tooltip-rightMiddle".w(),
          toolTip: 'Click to change between a male and female drake. Notice the drake’s neck!'
        }),

        nextButton: SC.ImageView.design(Geniverse.SimpleButton, {
          layout: {bottom: 20, right: 20, width: 118, height: 27},
          isEnabled: YES,
          hasHover: YES,
          classNames: 'bringItButton hint-available hint-target-topMiddle hint-tooltip-bottomMiddle'.w(),
          alt: 'Bring it on!',
          title: 'Bring it on!',
          toolTip: 'Click when ready for the challenge.',
          target: 'Lab.statechart',
          action: 'gotoNextActivity'
        }),

        genomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 80, left: 15, height: 500, width: 500 },
          generateDragonAtStart: NO,
          displayChallengeDragon: YES,
          dragonImageLeft: 313,
          sex: 1,
//        fixedAlleles: "a:A,a:A,a:B,b:B",
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO,
          showFromLabels: NO,
          showSwitchSex: YES,
          toolTip: "Select a different allele for each gene.  Watch to see if the drake changes.",
          classNames: "hint-available hint-target-topMiddle hint-tooltip-bottomLeft hint-max-width-280"
        }),

        chromoHintView: SC.View.design({
          layout: {top: 100, left: 16, height: 390, width: 19 },
          toolTip: "Every drake has 3 pairs of chromosomes. (Humans have 23 pairs of chromosomes).",
          classNames: "hint-available hint-target-bottomMiddle hint-tooltip-topRight"
        })

      })

    })
  })
});
