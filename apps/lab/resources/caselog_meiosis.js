// ==========================================================================
// Project:   Geniverse - meiosis page
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/**
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Geniverse, CC, CcChat, java static_url sc_static Lab*/
sc_require('views/top_bar_view');

Lab.marginSize = 15;

Lab.meiosis = SC.Page.design({
  
  pagePath: 'Lab.meiosis',
  title: 'Case Log: Meiosis',
  
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
      titlePath: 'Lab.meiosis.title'
    }),

    mainAppView: SC.View.design({
      layout: { top: 37, left: 0, right: 0 },
      layerId: 'meiosiscontent',

      childViews: 'background inheritance inheritance2left training apprentice1 apprentice2 apprentice3 journeyman1 journeyman2'.w(),

      background: SC.ImageView.design({
        layout: { top: 0, left: 0, right: 0 },
        value: static_url('caselog-bg-meiosis')
      }),

      inheritance: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'inheritance',
        target: 'Lab.meiosis',
        action: 'goInheritance1',
        title: 'Inheritance I',
        layout: { top: 59, left: 0, width: 44, height: 145 }
      }),

      inheritance2left: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'inheritance2left',
        target: 'Lab.meiosis',
        action: 'goInheritance2',
        title: 'Inheritance II',
        layout: { top: 205, left: 3, width: 43, height: 146 }
      }),

      training: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'm1-training',
        target: 'Lab.meiosis',
        action: 'goTraining1',
        title: 'Drake Traits',
        layout: { top: 304, left: 91, width: 341, height: 70 }
      }),

      apprentice1: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'm1-experiment',
        target: 'Lab.meiosis',
        action: 'goApprentice1',
        title: 'In the Clutches of Drakes',
        layout: { top: 399, left: 91, width: 341, height: 70 }
      }),

      apprentice2: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'm1-individual',
        target: 'Lab.meiosis',
        action: 'goApprentice2',
        title: 'Drake Forecast',
        layout: { top: 100, left: 522, width: 341, height: 70 }
      }),

      apprentice3: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'm1-group',
        target: 'Lab.meiosis',
        action: 'goApprentice3',
        title: 'A Perfect Look-alike',
        layout: { top: 195, left: 522, width: 341, height: 70 }
      }),
      
      journeyman1: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'm1-journeyman1',
        target: 'Lab.meiosis',
        action: 'goJourneyman1',
        title: 'A Perfect Look-alike',
        layout: { top: 304, left: 522, width: 341, height: 70 }
      }),
      
      journeyman2: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'm1-journeyman2',
        target: 'Lab.meiosis',
        action: 'goJourneyman2',
        title: 'A Perfect Look-alike',
        layout: { top: 399, left: 522, width: 341, height: 70 }
      })

  	})
	}),
  goInheritance1: function() {
    SC.routes.set('location', 'lab/caselog');
  },
  goInheritance2: function() {
    SC.routes.set('location', 'lab/inheritance2');
  },
  goTraining1: function() {
    SC.Logger.log("M, t1 -> meiosis/apprentice/case01");
    SC.routes.set('location', 'meiosis/apprentice/case01');
  },
  goApprentice1: function() {
    SC.Logger.log("M, a1 -> meiosis/apprentice/case02");
    SC.routes.set('location', 'meiosis/apprentice/case02');
  },
  goApprentice2: function() {
    SC.Logger.log("M, a2 -> meiosis/apprentice/case03");
    SC.routes.set('location', 'meiosis/apprentice/case03');
  },
  goApprentice3: function() {
    SC.routes.set('location', 'meiosis/journeyman/case01');
  },
  goJourneyman1: function() {
    SC.routes.set('location', 'meiosis/journeyman/case02');
  },
  goJourneyman2: function() {
    SC.routes.set('location', 'meiosis/journeyman/case03');
  }
});
