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
        childViews: 'challengePoolView femaleTitle femaleView motherMeiosis offspringTitle offspringView maleTitle maleView fatherMeiosis fertilization matchButtonView'.w(),
        // childViews: 'femaleTitle femaleView offspringTitle offspringView maleTitle maleView'.w(),
        classNames: ['genome-view-intro'],
        
        challengePoolView: Lab.ChallengePoolView.design({
          layout: { left: 5, top: 10, width:50, height: 300 }
        }),

        femaleTitle: SC.LabelView.design({
          layout: {top: 3, left: 130, height: 19, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Female Drake"
        }),

        femaleView: Geniverse.OrganismView.design({
          layout: {top: 27, left: 138, height: 100, width: 100 },
          contentBinding: 'Geniverse.meiosisAnimationController.mother',
          isDropTarget: YES,
          sex: 1
        }),
        
        offspringTitle: SC.LabelView.design({
          layout: {top: 3, centerX: 40, height: 19, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Offspring Drake"
        }),

        offspringView: Geniverse.OrganismView.design({
          layout: {top: 27, centerX: 15, height: 100, width: 100 },
          contentBinding: 'Geniverse.meiosisAnimationController.offspring'
        }),
        
        maleTitle: SC.LabelView.design({
          layout: {top: 3, right: 10, height: 19, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Male Drake"
        }),

        maleView: Geniverse.OrganismView.design({
          layout: {top: 27, right: 108, height: 100, width: 100 },
          contentBinding: 'Geniverse.meiosisAnimationController.father',
          isDropTarget: YES,
          sex: 0
        }),
        
        motherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 140, left: 60, height: 360, width: 310 },
          mode: 'parent',
          meiosisOwner: 'mother',
          dragonBinding: 'Geniverse.meiosisAnimationController.mother',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson'
        }),

        fertilization: Geniverse.AnimationView.design({
          layout: {top: 140, centerX: 27, height: 360, width: 310 },
          mode: 'offspring',
          meiosisOwner: 'offspring',
          motherJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson',
          fatherJsonBinding: 'Geniverse.meiosisAnimationController.fatherGameteJson'
        }),
        
        fatherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 140, right: 5, height: 360, width: 310 },
          mode: 'parent',
          meiosisOwner: 'father',
          dragonBinding: 'Geniverse.meiosisAnimationController.father',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.fatherGameteJson'
        }),
        
        matchButtonView: SC.ButtonView.extend(
        /** @scope Geniverse.ChromosomeToolView.prototype */ {
          titleMinWidth: 0,
          title: "Dragons to match",

          layout: { centerX: 27, top: 520, height: 24, width: 130 },

          action: function() {
            Geniverse.matchController.showPane();
          },

          isVisible: function() {
            return Geniverse.matchController.get('length') > 0;
          }.property('Geniverse.matchController.arrangedObjects.[]'),

          updateIsVisible: function(){
            this.propertyDidChange('isVisible');
          }.observes('Geniverse.matchController.arrangedObjects.[]')
        })
      })
      
  	})
	})
});
