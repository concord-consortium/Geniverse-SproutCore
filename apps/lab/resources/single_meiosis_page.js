// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CC, CcChat, java static_url sc_static sc_require */
Lab.marginSize = 15;

sc_require('views/top_bar_view');
sc_require('views/challenge_pool_view');
sc_require('views/bottom_bar_view');

Lab.singleMeiosisPage = SC.Page.design({
  
  pagePath: 'Lab.singleMeiosisPage',
  title: 'Siimple Meiosis Page',
  
  // challengeType: 'matchOneAtATimeChallenge',
  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'], 
    childViews: 'backgroundView mainAppView topBar bottomBar'.w(),
    backgroundView: SC.ImageView.design({
      value: static_url('lab_background.png'),
      classNames: ['transparent','scalingimage']
    }),
    topBar: Lab.TopBarView.design({
      classNames: ['brown']
    }),
    bottomBar: Lab.BottomBarView.design({
      classNames: ['brown']
    }),

    mainAppView: SC.View.design({
      
      childViews: 'genomePanel'.w(),
      
      genomePanel: SC.View.design({
        layout: {top: 40, bottom: 10, left: 10, right: 10 },
        childViews: 'background challengePoolView parentTitle drakeParentView meiosisView nextButton'.w(),

        // separate parallel background so we don't make the rest of the childViews see-through
        background: SC.View.design({
          layout: {top: 0, left: 0, right: 0, bottom: 0},
          classNames: ['genome-view-intro']
        }),
		  // using horizontal Challenge Pool at top with 120-px drakes inside
		  // this will necessitate moving everything down ~130px
		  // In actuality, moving them down about 6px more to avoid cutting off label
        challengePoolView: Lab.ChallengePoolView.design({
          layout: { left: 5, top: 10, width:410, height: 120 },
          dragonSize: 100
        }),

        parentTitle: SC.LabelView.design({
          layout: {top: 133, left: 152, height: 25, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Parent Drake"
        }),

				drakeParentView: Geniverse.OrganismView.design({
					layout: {top: 157, left: 160, height: 100, width: 100 },
					contentBinding: 'Geniverse.meiosisAnimationController.mother',
					isDropTarget: YES,
					}),

        // geneMap can be json object or url to file containing json object - dan
				meiosisView: Geniverse.AnimationView.design({
					layout: {top: 271, left: 55, height: 360, width: 310 },
					mode: 'parent',
					meiosisOwner: 'mother',
					geneMap: static_url('visibleMap.json'),	
					dragonBinding: 'Geniverse.meiosisAnimationController.mother',
					gameteJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson'
        }),

        nextButton: SC.ButtonView.design({
          layout: {left: 435, top: 58, width: 100, height: 24},
          classNames: ['bring-it-button'],
          fontWeight: SC.BOLD_WEIGHT,
          title: "Bring it on!",
          toolTip: 'Click when ready for the challenge.',
          target: 'Lab.statechart',
          action: 'gotoNextActivity'
        }),

      })      
  	})
	})
});
