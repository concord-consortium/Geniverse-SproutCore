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

Lab.chromosomeTrainingSinglePage = SC.Page.design({

  pagePath: 'Lab.chromosomeTrainingSinglePage',
  title: 'Chromosome Training Page',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'],
    childViews: 'mainAppView'.w(),

    mainAppView: SC.View.design({

      childViews: 'drakeGenomePanel'.w(),

      drakeGenomePanel: SC.View.design({
        layout: {top: 0, height: 550, centerX: 0, width: 500 },
        childViews: 'background title genomeView switchSexButton nextButton'.w(),

        // separate parallel background so we don't make the rest of the childViews see-through
        background: SC.View.design({
          layout: {top: 0, left: 0, right: 0, bottom: 0},
          classNames: ['genome-view-intro']
        }),

        title: SC.LabelView.design({
          layout: {top: 20, height: 25, left: 125, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          sexBinding: '*parentView.genomeView.sex',
          value: function() {
            return (this.get('sex') === 0 ? "Male " : "Female ") + "Drake";
          }.property('sex')
        }),

        switchSexButton: SC.ImageView.design(Geniverse.SimpleButton, {
          layout: { top: 18, left: 20, width: 100, height: 43 },
          isEnabled: YES,
          hasHover: YES,
          classNames: "switchsex switch-female".w(),
          alt: 'Switch Sex',
          title: 'Switch Sex',
          toolTip: 'Click to switch the sex of the drake',
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
          classNames: 'bringItButton'.w(),
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
          sex: 1,
//        fixedAlleles: "a:A,a:A,a:B,b:B",
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO,
          showFromLabels: NO,
          showSwitchSex: YES
        })

      })

    })
	})
});
