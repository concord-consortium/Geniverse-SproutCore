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
        layout: {top: 40, height: 520, left: 15, width: 980 },
        childViews: 'femaleTitle femaleView motherMeiosis offspringTitle offspringView maleTitle maleView fatherMeiosis fertilization'.w(),
        // childViews: 'femaleTitle femaleView offspringTitle offspringView maleTitle maleView'.w(),
        classNames: ['genome-view-intro'],

        femaleTitle: SC.LabelView.design({
          layout: {top: 10, left: 5, height: 25, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Female Drake"
        }),

        femaleView: Geniverse.OrganismView.design({
          layout: {top: 40, left: 5, height: 100, width: 100 },
          contentBinding: SC.Binding.from('Geniverse.meiosisAnimationController.mother').oneWay()
        }),
        
        offspringTitle: SC.LabelView.design({
          layout: {top: 10, left: 440, height: 25, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Offspring Drake"
        }),

        offspringView: Geniverse.OrganismView.design({
          layout: {top: 40, left: 440, height: 100, width: 100 },
          contentBinding: SC.Binding.from('Geniverse.meiosisAnimationController.offspring').oneWay()
        }),
        
        maleTitle: SC.LabelView.design({
          layout: {top: 10, left: 775, height: 25, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Male Drake"
        }),

        maleView: Geniverse.OrganismView.design({
          layout: {top: 40, left: 775, height: 100, width: 100 },
          contentBinding: SC.Binding.from('Geniverse.meiosisAnimationController.father').oneWay()
        }),
        
        motherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 150, left: 5, height: 360, width: 320 },
          mode: 'parent',
          meiosisOwner: 'mother',
          dragonBinding: 'Geniverse.meiosisAnimationController.mother',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson'
        }),

        fertilization: Geniverse.AnimationView.design({
          layout: {top: 150, left: 330, height: 360, width: 320 },
          mode: 'offspring',
          meiosisOwner: 'offspring',
          motherJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson',
          fatherJsonBinding: 'Geniverse.meiosisAnimationController.fatherGameteJson'
        }),
        
        fatherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 150, left: 655, height: 360, width: 320 },
          mode: 'parent',
          meiosisOwner: 'father',
          dragonBinding: 'Geniverse.meiosisAnimationController.father',
          gameteJsonBinding: 'Geniverse.meiosisAnimationController.fatherGameteJson'
        }),

        gwtReadyBinding: 'Geniverse.gwtController.isReady',
        generateDragons: function() {
          SC.Logger.log("GWT is ready");
          function motherGenerated(dragon) {
            SC.RunLoop.begin();
            SC.Logger.log("created mother: ", dragon);
            Geniverse.meiosisAnimationController.set('mother', dragon);
            SC.RunLoop.end();
          }
          function fatherGenerated(dragon) {
            SC.RunLoop.begin();
            SC.Logger.log("created father: ", dragon);
            Geniverse.meiosisAnimationController.set('father', dragon);
            SC.RunLoop.end();
          }
          Geniverse.gwtController.generateDragon(0, "Meiosis Father", fatherGenerated);
          Geniverse.gwtController.generateDragon(1, "Meiosis Mother", motherGenerated);
        }.observes('gwtReady')
      })
      
  	})
	})
});
