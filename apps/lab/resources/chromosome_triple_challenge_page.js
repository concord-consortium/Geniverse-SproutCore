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

Lab.chromosomeTripleChallengePage = SC.Page.design({

  pagePath: 'Lab.chromosomeTripleChallengePage',
  title: 'Chromosome Triple Challenge Page',
  challengeType: 'matchThreeToOneChallenge',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    childViews: 'mainAppView'.w(),

    mainAppView: SC.View.design({

      layout: { centerX: 0, top: 0, width: 1080, height: 605 },

      childViews: 'targetDrake targetTitle genomePanels revealButton scoreLabel line1 line2 line3'.w(),

      panel1AllSelectedBinding: '*genomePanels.genome1Panel.genomeView.allAllelesSelected',
      panel2AllSelectedBinding: '*genomePanels.genome2Panel.genomeView.allAllelesSelected',
      panel3AllSelectedBinding: '*genomePanels.genome3Panel.genomeView.allAllelesSelected',
      allAllelesSelected: NO,
      allAllelesSelectedChanged: function() {
        this.set('allAllelesSelected', (this.get('panel1AllSelected') &&
                this.get('panel2AllSelected') &&
                this.get('panel3AllSelected')
               ));
      }.observes('panel1AllSelected', 'panel2AllSelected', 'panel3AllSelected'),

      targetDrake: Geniverse.MatchView.design({
        layout: { left: 2, top: 50, height: 250, width: 193 },
        onlyOne: YES,
        dragonSize: 178
      }),

      scoreLabel: Geniverse.ScoreView.design({
        layout: { left: 17, top: 340, height: 49, width: 160 },
        showScore: YES,
        showTargetScore: YES
      }),

      revealButton: SC.ButtonView.design({
        layout: { top: 410, height: 24, left: 40, width: 100 },
        title: "Reveal All",
        isEnabledBinding: '*parentView.allAllelesSelected',
        action: "revealClicked",
        target: "Lab.statechart"
      }),

      targetTitle: SC.LabelView.design({
        layout: {top: 40, height: 25, left: 25, width: 190 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        value: "Target Drake"
      }),

      line1: SC.View.design({
        layout: {top: 100, left: 197, width: 1, bottom: 40},
        classNames: ['genome-view-intro']
      }),

      line2: SC.View.design({
        layout: {top: 100, left: 487, width: 1, bottom: 40},
        classNames: ['genome-view-intro']
      }),

      line3: SC.View.design({
        layout: {top: 100, left: 774, width: 1, bottom: 40},
        classNames: ['genome-view-intro']
      }),

      genomePanels: SC.View.design({
        layout: {top: 0, height: 600, left: 200, width: 950 },
        childViews: 'genome1Panel genome2Panel genome3Panel'.w(),

        genome1Panel: SC.View.design({
          layout: {top: 0, height: 660, left: 0, width: 290 },
          childViews: 'genomeView phenotypeView switchSexButton'.w(),

          phenotypeView: Geniverse.OrganismView.design({
            layout: {top: 0, left: 50, width: 190, height: 170},
            contentBinding: "*parentView.genomeView.dragon",
            allowDrop: NO,
            showBackground: NO,
            hideDragon: YES,
            glow: YES
          }),

          switchSexButton: SC.ImageView.design(Geniverse.SimpleButton, {
            layout: { top: 163, left: 95, width: 100, height: 43 },
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
            layout: {top: 185, left: 5, height: 500, width: 300 },
            index: 1,
            generateDragonAtStart: NO,
            sex: 1,
            showDragon: NO,
            displayChallengeDragon: YES,
            showGenerateNewDragon: NO,
            showIsEditableCheck: NO,
            showEmptyOptions: NO,
            startWithEmptyOptions: NO,
            trackScore: YES,
            showFromLabels: NO
          })
        }),

        genome2Panel: SC.View.design({
          layout: {top: 0, height: 600, left: 290, width: 290 },
          childViews: 'genomeView phenotypeView switchSexButton'.w(),

          phenotypeView: Geniverse.OrganismView.design({
            layout: {top: 0, left: 50, width: 190, height: 170},
            contentBinding: "*parentView.genomeView.dragon",
            allowDrop: NO,
            showBackground: NO,
            hideDragon: YES,
            glow: YES
          }),

          switchSexButton: SC.ImageView.design(Geniverse.SimpleButton, {
            layout: { top: 163, left: 95, width: 100, height: 43 },
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
            layout: {top: 185, left: 5, height: 500, width: 300 },
            index: 2,
            generateDragonAtStart: NO,
            sex: 1,
            showDragon: NO,
            displayChallengeDragon: YES,
            showGenerateNewDragon: NO,
            showIsEditableCheck: NO,
            showEmptyOptions: NO,
            startWithEmptyOptions: NO,
            trackScore: YES,
            showFromLabels: NO
          })
        }),

        genome3Panel: SC.View.design({
          layout: {top: 0, height: 600, left: 580, width: 290 },
          childViews: 'genomeView phenotypeView switchSexButton'.w(),

          phenotypeView: Geniverse.OrganismView.design({
            layout: {top: 0, left: 50, width: 190, height: 170},
            contentBinding: "*parentView.genomeView.dragon",
            allowDrop: NO,
            showBackground: NO,
            hideDragon: YES,
            glow: YES
          }),

          switchSexButton: SC.ImageView.design(Geniverse.SimpleButton, {
            layout: { top: 163, left: 95, width: 100, height: 43 },
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
            layout: {top: 185, left: 5, height: 500, width: 300 },
            index: 3,
            generateDragonAtStart: NO,
            sex: 1,
            showDragon: NO,
            displayChallengeDragon: YES,
            showGenerateNewDragon: NO,
            showIsEditableCheck: NO,
            showEmptyOptions: NO,
            startWithEmptyOptions: NO,
            trackScore: YES,
            showFromLabels: NO
          })
        })
      }),

      organismViews: function() {
        return [this.getPath('genomePanels.genome1Panel.phenotypeView'),
        this.getPath('genomePanels.genome2Panel.phenotypeView'),
        this.getPath('genomePanels.genome3Panel.phenotypeView') ];
      }.property('*genomePanels.genome1Panel.phenotypeView', '*genomePanels.genome2Panel.phenotypeView', '*genomePanels.genome3Panel.phenotypeView').cacheable()
    })
  })
});
