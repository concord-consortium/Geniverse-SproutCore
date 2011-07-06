// ==========================================================================
// Project:   Geniverse - inheritance2 page
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/**
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Geniverse, CC, CcChat, java static_url sc_static Lab */
sc_require('views/top_bar_view');

Lab.marginSize = 15;

Lab.inheritance2 = SC.Page.design({
  
  pagePath: 'Lab.inheritance2',
  title: 'Case Log: Inheritance II',
  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'], 
    childViews: 'backgroundView topBar mainAppView'.w(),
    backgroundView: SC.ImageView.design({
      value: static_url('bg2'),
      classNames: ['transparent','scalingimage']
    }),
    topBar: Lab.TopBarView.design({
      titlePath: 'Lab.inheritance2.title'
    }),

    mainAppView: SC.View.design({
      layout: { top: 37, left: 0, right: 0 },
      layerId: 'inheritance2content',

      childViews: 'background inheritance meiosis training1 training2 training3 apprentice1 apprentice2 apprentice3 journeyman1 journeyman2'.w(),

      background: SC.ImageView.design({
        layout: { top: 0, left: 0, right: 0 },
        value: static_url('caselog-bg-inheritance2')
      }),

      inheritance: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'inheritance',
        target: 'Lab.inheritance2',
        action: 'goInheritance1',
        title: 'Inheritance I',
        layout: { top: 59, left: 0, width: 44, height: 145 }
      }),

      meiosis: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'meiosis',
        target: 'Lab.inheritance2',
        action: 'goMeiosis',
        title: 'Meiosis',
        layout: { top: 348, left: 918, width: 42, height: 145 }
      }),

      training1: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i2-training1',
        target: 'Lab.inheritance2',
        action: 'goTraining1',
        title: 'Drake Traits',
        layout: { top: 100, left: 91, width: 341, height: 70 }
      }),
      
      training2: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i2-training2',
        target: 'Lab.inheritance2',
        action: 'goTraining2',
        title: 'Drake Traits',
        layout: { top: 195, left: 91, width: 341, height: 70 }
      }),
      
      training3: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i2-training3',
        target: 'Lab.inheritance2',
        action: 'goTraining3',
        title: 'Drake Traits',
        layout: { top: 304, left: 91, width: 341, height: 70 }
      }),

      apprentice1: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i2-experiment',
        target: 'Lab.inheritance2',
        action: 'goApprentice1',
        title: 'In the Clutches of Drakes',
        layout: { top: 399, left: 91, width: 341, height: 70 }
      }),

      apprentice2: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i2-individual',
        target: 'Lab.inheritance2',
        action: 'goApprentice2',
        title: 'Drake Forecast',
        layout: { top: 100, left: 522, width: 341, height: 70 }
      }),

      apprentice3: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i2-group',
        target: 'Lab.inheritance2',
        action: 'goApprentice3',
        title: 'A Perfect Look-alike',
        layout: { top: 195, left: 522, width: 341, height: 70 }
      }),
      
      journeyman1: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i2-journeyman1',
        target: 'Lab.inheritance2',
        action: 'goJourneyman1',
        title: 'A Perfect Look-alike',
        layout: { top: 304, left: 522, width: 341, height: 70 }
      }),
      
      journeyman2: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'i2-journeyman2',
        target: 'Lab.inheritance2',
        action: 'goJourneyman2',
        title: 'A Perfect Look-alike',
        layout: { top: 399, left: 522, width: 341, height: 70 }
      })

  	})
	}),
  goInheritance1: function() {
    SC.routes.set('location', 'lab/caselog');
  },
  goMeiosis: function() {
    SC.routes.set('location', 'lab/meiosis');
  },
  goTraining1: function() {
    SC.Logger.log("I2, t1 -> heredity/apprentice/case03");
    SC.routes.set('location', 'heredity/apprentice/case03');
  },
  goTraining2: function() {
    SC.Logger.log("I2, t2 -> heredity/apprentice/case04");
    SC.routes.set('location', 'heredity/apprentice/case04');
  },
  goTraining3: function() {
    SC.Logger.log("I2, t3 -> heredity/journeyman/case01");
    SC.routes.set('location', 'heredity/journeyman/case01');
  },
  goApprentice1: function() {
    SC.routes.set('location', 'heredity/journeyman/case02');
  },
  goApprentice2: function() {
    SC.routes.set('location', 'heredity/journeyman/case03');
  },
  goApprentice3: function() {
    SC.routes.set('location', 'heredity/journeyman/case04');
  },
  goJourneyman1: function() {
    SC.routes.set('location', 'heredity-meiosis/master/case01');
  },
  goJourneyman2: function() {
    SC.routes.set('location', 'heredity-meiosis/master/case02');
  }
});
