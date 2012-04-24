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
      
      layout: { centerX: 0, top: 40, width: 1050, height: 640 },
      
      genomePanel: SC.View.design({
        layout: {top: 0, bottom: 10, left: 5, right: 5 },
        childViews: 'background mothersPoolView fathersPoolView femaleView motherMeiosis offspringTitle offspringView maleView fatherMeiosis fertilization matchView scoreView'.w(),
        // childViews: 'femaleTitle femaleView offspringTitle offspringView maleTitle maleView'.w(),

        // separate parallel background so we don't make the rest of the childViews see-through
        background: SC.View.design({
          layout: {top: 0, left: 0, right: 0, bottom: 0},
          classNames: ['genome-view-intro']
        }),
        

        matchView: Geniverse.MatchView.design({
          layout: { centerX: 0, top: 5, height: 120, width: 400 },
          dragonSize: 100
        }),
        
        // challenge pool to hold initial, system-created dragons
        mothersPoolView: Lab.ChallengePoolView.design({
          layout: { left: 12, top: 11, width:300, height: 97 },
          sex: "female"
        }),

        fathersPoolView: Lab.ChallengePoolView.design({
          layout: { right: 12, top: 11, width:300, height: 97 },
          sex: "male"
        }),
        
        femaleView: Geniverse.OrganismView.design({
          layout: {top: 109, left: 115, height: 100, width: 100 },
          classNames: "sc-theme motherView opaque".w(),
          contentBinding: 'Geniverse.meiosisAnimationController.mother',
          label: "Mother",
          showLabel: true,
          sex: 1,
          isDropTarget: YES,
          trackScore: YES,
          glow: YES
        }),
        
        offspringTitle: SC.LabelView.design({
          layout: {top: 131, centerX: 16, height: 25, width: 140 },
          fontWeight: SC.BOLD_WEIGHT,
          value: "Offspring Drake"
        }),

        offspringView: Geniverse.OrganismView.design({
          layout: {top: 148, centerX: 0, height: 100, width: 100 },
          contentBinding: 'Geniverse.meiosisAnimationController.offspring',
          canDrag: YES
        }),
        
        maleView: Geniverse.OrganismView.design({
          layout: {top: 109, right: 115, height: 100, width: 100 },
          classNames: "sc-theme fatherView opaque".w(),
          contentBinding: 'Geniverse.meiosisAnimationController.father',
          label: "Father",
          showLabel: true,
          sex: 0,
          isDropTarget: YES,
          trackScore: YES,
          glow: YES
        }),

        // geneMap can be json object or url to file containing json object - dan
        motherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 210, left: 17, height: 360, width: 325 },
          mode: 'parent',
					swapping: false,
          meiosisOwner: 'mother',
          dragonBinding: 'Geniverse.meiosisAnimationController.mother',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson'
        }),

        fertilization: Geniverse.AnimationView.design({
          layout: {top: 246, centerX: 0, height: 360, width: 325 },
          mode: 'offspring',
          meiosisOwner: 'offspring',
          motherJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson',
          fatherJsonBinding: 'Geniverse.meiosisAnimationController.fatherGameteJson',
          trackScoreOnPlayButton: YES
        }),
        
        fatherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 210, right: 17, height: 360, width: 325 },
          mode: 'parent',
					swapping: false,
          meiosisOwner: 'father',
          dragonBinding: 'Geniverse.meiosisAnimationController.father',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.fatherGameteJson'
        }),
        
        scoreView: Geniverse.ScoreView.design({
          layout: { left: 17, bottom: 21, height: 41, width: 175 },
          showScore: YES,
          showTargetScore: YES,
          targetScoreView: SC.LabelView.design({
            layout: {left: 0, right: 0, top: 3, height: 14 },
            isVisibleBinding: '*parentView.showTargetScore',
            fontWeight: SC.BOLD_WEIGHT,
            textAlign: SC.ALIGN_CENTER,
            targetScoreBinding: 'Geniverse.scoringController.targetScore',
            value: function() {
              return "GOAL is " + this.get('targetScore') + " MOVE" + (this.get('targetScore') == 1 ? "" : "S");
            }.property('isVisible', 'targetScore').cacheable()
          }),

          scoreView: SC.LabelView.design({
            layout: {left: 5, right: 0, top: 17, height: 14 },
            isVisibleBinding: '*parentView.showScore',
            fontWeight: SC.BOLD_WEIGHT,
            textAlign: SC.ALIGN_CENTER,
            scoreBinding: 'Geniverse.scoringController.currentScore',
            value: function() {
              return "Your moves: " + this.get('score');
            }.property('isVisible', 'score').cacheable()
          })
        })
        
      })
      
      
  	})
	})
});
