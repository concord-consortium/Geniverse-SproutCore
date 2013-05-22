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

   layout: { left: 0, top: 0, width: 800, height: 1400 },

    mainAppView: SC.View.design({

      childViews: 'drakeGenomePanel infoHintView'.w(),

      drakeGenomePanel: SC.View.design({
        layout: {top: 110, height: 550, left: 0, width: 500 },
        childViews: 'title genomeView switchSexButton nextButton chromoHintView'.w(),

        title: SC.LabelView.design({
          layout: {top: 20, height: 25, left: 125, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          classNames: 'title'.w(),
          sexBinding: '*parentView.genomeView.sex',
          value: function() {
            return (this.get('sex') === 0 ? "Male " : "Female ") + "Dragon";
          }.property('sex')
        }),

        switchSexButton: SC.ImageView.design(Geniverse.SimpleButton, {
          layout: { top: 18, left: 20, width: 100, height: 43 },
          isEnabled: YES,
          hasHover: YES,
          classNames: "switchsex switch-female hint-available hint-target-topMiddle hint-tooltip-bottomLeft".w(),
          alt: 'Switch Sex',
          title: 'Switch Sex',
          toolTip: 'Click to change between a male and female dragon. Notice the dragon’s neck!',
          sexBinding: '*parentView.genomeView.sex',
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

        nextButton: SC.ImageView.design(Geniverse.SimpleButton, {
          layout: {bottom: 20, right: 20, width: 118, height: 27},
          isEnabled: YES,
          hasHover: YES,
          classNames: 'bringItButton hint-available hint-target-topLeft hint-tooltip-bottomLeft'.w(),
          alt: 'Bring it on!',
          title: 'Bring it on!',
          toolTip: 'Click here when you are ready for the next Lab.',
          target: 'Lab.statechart',
          action: 'bringItOnClicked'
        }),

        genomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 80, left: 15, height: 500, width: 500 },
          generateDragonAtStart: NO,
          displayChallengeDragon: YES,
          sex: 1,
//        fixedAlleles: "a:A,a:A,a:B,b:B",
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO,
          showFromLabels: NO,
          showSwitchSex: YES
        }),

        // for extra-specific positioning of a tooltip, we have to use another view
        chromoHintView: SC.View.design({
          layout: {top: 310, left: 300, height: 50, width: 10 },
          toolTip: "Select a different allele for each gene.  Watch to see if the dragon changes.",
          classNames: "hint-available hint-target-rightMiddle hint-tooltip-leftMiddle hint-clickthrough",
        })

      }),

      infoHintView: SC.View.design({
        layout: {top: 50, left: 485, height: 10, width: 10 },
        toolTip: "Click this button to open the instructions for the lab.",
        classNames: "hint-available hint-tooltip-topLeft",
      })

    })
  })
});
