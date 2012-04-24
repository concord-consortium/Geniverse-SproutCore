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

Lab.meiosisPage = SC.Page.design({
  
  pagePath: 'Lab.meiosisPage',
  title: 'Meiosis Page',
  
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
      
      layout: { centerX: 0, top: 40, width: 1200, height: 640 },
      
      genomePanel: SC.View.design({
        layout: {top: 0, bottom: 10, left: 5, right: 5 },
        childViews: 'background mothersPoolView fathersPoolView femaleView motherMeiosis offspringTitle offspringView maleView fatherMeiosis fertilization matchView scoreView'.w(),
        // childViews: 'femaleTitle femaleView offspringTitle offspringView maleTitle maleView'.w(),

        // separate parallel background so we don't make the rest of the childViews see-through
        background: SC.View.design({
          layout: {top: 0, left: 0, right: 0, bottom: 0},
          classNames: ['genome-view-intro']
        }),
        
        // challenge pool to hold initial, system-created dragons
        mothersPoolView: Lab.ChallengePoolView.design({
          layout: { left: 12, top: 40, width:85, height: 320 },
          sex: "female"
        }),

        fathersPoolView: Lab.ChallengePoolView.design({
          layout: { right: 12, top: 40, width:85, height: 320 },
          sex: "male"
        }),
        
        femaleView: Geniverse.OrganismView.design({
          layout: {top: 20, left: 190, height: 110, width: 110 },
          classNames: "sc-theme motherView opaque".w(),
          contentBinding: 'Geniverse.meiosisAnimationController.mother',
          label: "mother",
          showLabel: true,
          sex: 1,
          isDropTarget: YES,
          trackScore: YES
        }),
        
        offspringTitle: SC.LabelView.design({
          layout: {top: 5, centerX: 0, height: 25, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Offspring Drake"
        }),

        offspringView: Geniverse.OrganismView.design({
          layout: {top: 33, centerX: 0, height: 100, width: 100 },
          contentBinding: 'Geniverse.meiosisAnimationController.offspring',
          canDrag: YES
        }),
        
        maleView: Geniverse.OrganismView.design({
          layout: {top: 30, right: 190, height: 110, width: 110 },
          classNames: "sc-theme fatherView opaque".w(),
          contentBinding: 'Geniverse.meiosisAnimationController.father',
          label: "father",
          showLabel: true,
          sex: 0,
          isDropTarget: YES,
          trackScore: YES
        }),

        // geneMap can be json object or url to file containing json object - dan
        motherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 145, left: 102, height: 360, width: 325 },
          mode: 'parent',
					swapping: false,
          meiosisOwner: 'mother',
          dragonBinding: 'Geniverse.meiosisAnimationController.mother',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson'
        }),

        fertilization: Geniverse.AnimationView.design({
          layout: {top: 145, centerX: 0, height: 360, width: 325 },
          mode: 'offspring',
          meiosisOwner: 'offspring',
          motherJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson',
          fatherJsonBinding: 'Geniverse.meiosisAnimationController.fatherGameteJson',
          trackScoreOnPlayButton: YES
        }),
        
        fatherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 145, right: 102, height: 360, width: 325 },
          mode: 'parent',
					swapping: false,
          meiosisOwner: 'father',
          dragonBinding: 'Geniverse.meiosisAnimationController.father',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.fatherGameteJson'
        }),
         // Changing to left-specified and placing to right of Challenge Pool
			// Also making 120 high to match parent pool
        matchView: Geniverse.MatchView.design({
          layout: { centerX: 0, bottom: 5, height: 120, width: 400 },
          dragonSize: 100
        }),
        
        scoreView: Geniverse.ScoreView.design({
          layout: { right: 5, bottom: 5, height: 36, width: 150 },
          showScore: YES,
          showTargetScore: YES
        })
        
      })
      
      
  	})
	})
});
