// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CC, CcChat, java static_url sc_static sc_require */
Lab.marginSize = 15;

sc_require('views/article');
sc_require('views/breed_dragon');
sc_require('views/dragon_genome');
sc_require('views/dragon_bin');
sc_require('views/dragon_chat_compose');
sc_require('views/organism');
sc_require('views/published_articles');
sc_require('views/login');
sc_require('resources/top_bar_view');

Lab.meiosisPage = SC.Page.design({
  
  pagePath: 'Lab.meiosisPage',
  title: 'Meiosis Page',
  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'], 
    childViews: 'backgroundView mainAppView topBar'.w(),
    backgroundView: SC.ImageView.design({
      value: static_url('lab_background.png'),
      classNames: ['transparent','scalingimage']
    }),
    topBar: Lab.TopBarView.design({
      classNames: ['brown']
    }),

    mainAppView: SC.View.design({
      
      childViews: 'genomePanel'.w(),
      
      genomePanel: SC.View.design({
        layout: {top: 40, bottom: 10, left: 10, right: 10 },
        childViews: 'background challengePoolView femaleTitle femaleView motherMeiosis offspringTitle offspringView maleTitle maleView fatherMeiosis fertilization matchView'.w(),
        // childViews: 'femaleTitle femaleView offspringTitle offspringView maleTitle maleView'.w(),

        // separate parallel background so we don't make the rest of the childViews see-through
        background: SC.View.design({
          layout: {top: 0, left: 0, right: 0, bottom: 0},
          classNames: ['genome-view-intro']
        }),
		  // using horizontal Challenge Pool at top with 120-px drakes inside
		  // this will necessitate moving everything down ~130px
		  // In actuality, moving them down about 6px more to avoid cutting off label
        challengePoolView: Lab.ChallengePoolView.design({
          layout: { left: 5, top: 10, width:510, height: 120 },
          dragonSize: 100
        }),

        femaleTitle: SC.LabelView.design({
          layout: {top: 133, left: 130, height: 25, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Female Drake"
        }),

		femaleView: Geniverse.OrganismView.design({
		  layout: {top: 157, left: 138, height: 100, width: 100 },
		  contentBinding: 'Geniverse.meiosisAnimationController.mother',
		  isDropTarget: YES,
		  sex: 1
        }),
        
        offspringTitle: SC.LabelView.design({
          layout: {top: 139, centerX: 40, height: 25, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Offspring Drake"
        }),

        offspringView: Geniverse.OrganismView.design({
          layout: {top: 163, centerX: 15, height: 100, width: 100 },
          contentBinding: 'Geniverse.meiosisAnimationController.offspring',
          canDrag: YES
        }),
        
        maleTitle: SC.LabelView.design({
          layout: {top: 139, right: 10, height: 25, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Male Drake"
        }),

        maleView: Geniverse.OrganismView.design({
          layout: {top: 163, right: 108, height: 100, width: 100 },
          contentBinding: 'Geniverse.meiosisAnimationController.father',
          isDropTarget: YES,
          sex: 0
        }),

        // geneMap can be json object or url to file containing json object - dan
        motherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 271, left: 60, height: 360, width: 310 },
          mode: 'parent',
          meiosisOwner: 'mother',
		  geneMap: static_url('visibleMap.json'),	
          dragonBinding: 'Geniverse.meiosisAnimationController.mother',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson'
        }),

        fertilization: Geniverse.AnimationView.design({
          layout: {top: 271, centerX: 27, height: 360, width: 310 },
          mode: 'offspring',
          meiosisOwner: 'offspring',
		  geneMap: static_url('visibleMap.json'),
          motherJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson',
          fatherJsonBinding: 'Geniverse.meiosisAnimationController.fatherGameteJson'
        }),
        
        fatherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 271, right: 5, height: 360, width: 310 },
          mode: 'parent',
          meiosisOwner: 'father',
 		  geneMap: static_url('visibleMap.json'),
          dragonBinding: 'Geniverse.meiosisAnimationController.father',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.fatherGameteJson'
        }),
         // Changing to left-specified and placing to right of Challenge Pool
			// Also making 120 high to match parent pool
        matchView: Geniverse.MatchView.design({
          layout: { left: 530, top: 10, height: 120, width: 400 },
          dragonSize: 100
        })
      })
      
  	})
	})
});
