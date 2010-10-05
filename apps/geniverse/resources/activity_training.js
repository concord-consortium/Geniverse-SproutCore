// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse, CC, CcChat, java */
Geniverse.marginSize = 15;

sc_require('views/article');
sc_require('views/breed_dragon');
sc_require('views/dragon_genome');
sc_require('views/dragon_bin');
sc_require('views/dragon_chat_compose');
sc_require('views/organism');
sc_require('views/published_articles');
sc_require('views/login');

Geniverse.trainingPage = SC.Page.design({
  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    
    childViews: 'topBar mainAppView'.w(),
    
    topBar: SC.ToolbarView.design({
      layout: { top: 0, left: 0, right: 0, height: 36 },
      childViews: 'geniverseLabelView welcomeLabelView logoutButton'.w(),
      anchorLocation: SC.ANCHOR_TOP,
      
      geniverseLabelView: SC.LabelView.design({
        layout: { centerY: 0, height: 24, left: 8, width: 200 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        valueBinding:   'Geniverse.activityController.title'
      }),
      
      welcomeLabelView: SC.LabelView.design({
        layout: { centerY: 0, height: 24, right: 130, width: 500},
        fontWeight: SC.BOLD_WEIGHT,
        textAlign: SC.ALIGN_RIGHT,
        valueBinding: 'Geniverse.appController.welcomeMessageDuplicate',
        isVisibleBinding: 'Geniverse.appController.userLoggedIn'
      }),

      logoutButton: SC.ButtonView.design({
        layout: { centerY: 0, height: 24, right: 12, width: 100 },
        layerId: 'logOutButton',
        title:  "Log out",
        target: 'Geniverse.appController',
        action: 'logout',
        isVisibleBinding: 'Geniverse.appController.userLoggedIn'
      })
    }),
    
    mainAppView: SC.View.design({
      
      childViews: 'femaleGenomePanel maleGenomePanel'.w(),
      
      femaleGenomePanel: SC.View.design({
        layout: {top: 50, height: 550, left: 15, width: 500 },
        childViews: 'title genomeView'.w(),
        classNames: ['genome-view-intro'],

        title: SC.LabelView.design({
          layout: {top: 20, height: 25, left: 20, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          value: "Female Dragon"
        }),

        genomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 80, left: 40, height: 500, width: 500 },
          generateDragonAtStart: YES,
          sex: 1,
          fixedAlleles: "a:A,a:A,a:B,b:B",
          hiddenGenes: ['s','p','a','b'],
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO
        })

      }),
      
      maleGenomePanel: SC.View.design({
        layout: {top: 50, height: 550, left: 600, width: 500 },
        childViews: 'maleTitle maleGenomeView'.w(),
        classNames: ['genome-view-intro'],

        maleTitle: SC.LabelView.design({
          layout: {top: 20, height: 25, left: 20, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          fontWeight: SC.BOLD_WEIGHT,
          value: "Male Dragon"
        }),

        maleGenomeView: Geniverse.DragonGenomeView.design({
          layout: {top: 80, left: 40, height: 500, width: 500 },
          generateDragonAtStart: YES,
          sex: 0,
          fixedAlleles: "a:A,b:A,a:B,b:B",
          hiddenGenes: ['s','p','a','b'],
          showGenerateNewDragon: NO,
          showIsEditableCheck: NO
        })

      })
      
  	})
	})
});
