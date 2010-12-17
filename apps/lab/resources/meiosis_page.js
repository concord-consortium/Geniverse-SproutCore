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
        // childViews: 'femaleTitle femaleView motherMeiosis maleTitle maleView'.w(),
        classNames: ['genome-view-intro'],
        mother: null,
        father: null,
        offspring: null,
        
        init: function() {
          sc_super();
          $(document).bind('gamete-clicked', function(event, data) {
            SC.Logger.log('gamete was clicked');
            SC.Logger.dir(event);
            SC.Logger.dir(data);
          });
        },

        femaleTitle: SC.LabelView.design({
          layout: {top: 10, left: 5, height: 25, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Female Drake"
        }),

        femaleView: Geniverse.OrganismView.design({
          layout: {top: 40, left: 5, height: 100, width: 100 },
          contentBinding: '*parentView.mother'
        }),
        
        offspringTitle: SC.LabelView.design({
          layout: {top: 10, left: 440, height: 25, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Offspring Drake"
        }),

        offspringView: Geniverse.OrganismView.design({
          layout: {top: 40, left: 440, height: 100, width: 100 },
          contentBinding: '*parentView.offspring'
        }),
        
        maleTitle: SC.LabelView.design({
          layout: {top: 10, left: 775, height: 25, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Male Drake"
        }),

        maleView: Geniverse.OrganismView.design({
          layout: {top: 40, left: 775, height: 100, width: 100 },
          contentBinding: '*parentView.father'
        }),
        
        motherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 150, left: 5, height: 360, width: 320 },
          mode: 'parent',
          meiosisOwner: 'mother',
          dragonBinding: '*parentView.mother',
          gameteJsonBinding: '*parentView.fertilization.motherJson'
        }),

        fertilization: Geniverse.AnimationView.design({
          layout: {top: 150, left: 330, height: 360, width: 320 },
          mode: 'offspring',
          meiosisOwner: 'offspring',
          offspringBinding: '*parentView.offspring',
          animationComplete: function() {
            var self = this;
            function callback(dragon) {
              SC.Logger.info("Created offspring dragon", dragon);
              self.set('offspring', dragon);
            }
            SC.Logger.info("Animation completed.", this.get('jsonData'));
            // get the jsonData and create a new organism from that
            var alleles = Geniverse.meiosisAnimationController.JSONToAlleles(this.get('motherJson'), this.get('fatherJson'));
            var sex = 0;
            Geniverse.gwtController.generateDragonWithAlleles(alleles, sex, "Meiosis Child", callback);
          }
        }),
        
        fatherMeiosis: Geniverse.AnimationView.design({
          layout: {top: 150, left: 655, height: 360, width: 320 },
          mode: 'parent',
          meiosisOwner: 'father',
          dragonBinding: '*parentView.father',
          gameteJsonBinding: '*parentView.fertilization.fatherJson'
        }),

        gwtReadyBinding: 'Geniverse.gwtController.isReady',
        generateDragons: function() {
          var self = this;
          function motherGenerated(dragon) {
            self.set('mother', dragon);
          }
          function fatherGenerated(dragon) {
            self.set('father', dragon);
          }
          Geniverse.gwtController.generateDragon(0, "Meiosis Father", fatherGenerated);
          Geniverse.gwtController.generateDragon(0, "Meiosis Mother", motherGenerated);
        }.observes('gwtReady')
      })
      
  	})
	})
});
