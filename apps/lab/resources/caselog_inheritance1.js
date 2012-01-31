// ==========================================================================
// Project:   Geniverse - caselog page
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/**
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Geniverse, CC, CcChat, java static_url sc_static Lab */
sc_require('views/top_bar_view');

Lab.marginSize = 15;

Lab.caselog = SC.Page.design({
  
  pagePath: 'Lab.caselog',
  title: 'Case Log: Inheritance I',
  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'], 
    childViews: 'backgroundView mainAppView topBar'.w(),
    backgroundView: SC.ImageView.design({
      value: static_url('bg2'),
      classNames: ['transparent','scalingimage']
    }),
    topBar: Lab.TopBarView.design({
      titlePath: 'Lab.caselog.title'
    }),

    mainAppView: SC.View.design({
      layout: { top: 37, left: 0, right: 0 },
      layerId: 'caselogcontent',

      childViews: 'background inheritance2right meiosis training apprentice1 apprentice2 apprentice3 journeyman1 journeyman2'.w(),

      background: SC.ImageView.design({
        layout: { top: 0, left: 0, right: 0 },
        value: static_url('caselog-bg-inheritance')
      }),

      inheritance2right: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'inheritance2right',
        target: 'Lab.caselog',
        action: 'goInheritance2',
        title: 'Inheritance II',
        layout: { top: 193, right: 3, width: 43, height: 146 }
      }),

      meiosis: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'meiosis',
        target: 'Lab.caselog',
        action: 'goMeiosis',
        title: 'Meiosis',
        layout: { top: 348, right: 0, width: 42, height: 145 }
      }),

      training: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i1-training',
        target: 'Lab.caselog',
        action: 'goTraining1',
        title: 'Drake Traits',
        layout: { top: 304, left: 91, width: 341, height: 70 }
      }),

      apprentice1: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i1-experiment',
        target: 'Lab.caselog',
        action: 'goApprentice1',
        title: 'In the Clutches of Drakes',
        layout: { top: 399, left: 91, width: 341, height: 70 }
      }),

      apprentice2: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i1-individual',
        target: 'Lab.caselog',
        action: 'goApprentice2',
        title: 'Drake Forecast',
        layout: { top: 100, left: 522, width: 341, height: 70 }
      }),

      apprentice3: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i1-group',
        target: 'Lab.caselog',
        action: 'goApprentice3',
        title: 'A Perfect Look-alike',
        layout: { top: 195, left: 522, width: 341, height: 70 }
      }),
      
      journeyman1: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i1-journeyman1',
        target: 'Lab.caselog',
        action: 'goJourneyman1',
        title: 'A Perfect Look-alike',
        layout: { top: 304, left: 522, width: 341, height: 70 }
      }),
      
      journeyman2: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i1-journeyman2',
        target: 'Lab.caselog',
        action: 'goJourneyman2',
        title: 'A Perfect Look-alike',
        layout: { top: 399, left: 522, width: 341, height: 70 }
      })

  	})
	}),
  goInheritance2: function() {
    SC.routes.set('location', 'lab/inheritance2');
  },
  goMeiosis: function() {
    SC.routes.set('location', 'lab/meiosis');
  },
  goTraining1: function() {
    SC.Logger.log("I1, t1 -> heredity/training/case01");
    SC.routes.set('location', 'heredity/training/case01');
  },
  goApprentice1: function() {
    SC.Logger.log("I1, a1 -> heredity/training/case02");
    SC.routes.set('location', 'heredity/training/case02');
  },
  goApprentice2: function() {
    SC.Logger.log("I21 a2 -> heredity/training/case03");
    SC.routes.set('location', 'heredity/training/case03');
  },
  goApprentice3: function() {
    SC.routes.set('location', 'heredity/training/case04');
  },
  goJourneyman1: function() {
    SC.routes.set('location', 'heredity/apprentice/case01');
  },
  goJourneyman2: function() {
    SC.routes.set('location', 'heredity/apprentice/case02');
  }
});