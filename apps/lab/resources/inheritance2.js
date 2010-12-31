// ==========================================================================
// Project:   Geniverse - inheritance2 page
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/**
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Geniverse, CC, CcChat, java static_url sc_static */
sc_require('mixins/simple_button');
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

      childViews: 'background inheritance meiosis training experiment individual group'.w(),

      background: SC.ImageView.design({
        layout: { top: 0, left: 0, right: 0 },
        value: static_url('caselog-bg-inheritance2')
      }),

      inheritance: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'inheritance',
        target: 'Lab.inheritance2',
        action: 'goInheritance1',
        title: 'Inheritance I',
        layout: { top: 59, left: 0, width: 44, height: 145 }
      }),

      meiosis: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'meiosis',
        target: 'Lab.inheritance2',
        action: 'goMeiosis',
        title: 'Meiosis',
        layout: { top: 348, left: 918, width: 42, height: 145 }
      }),

      training: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'training',
        target: 'Lab.inheritance2',
        action: 'goTraining1',
        title: 'Drake Traits',
        layout: { top: 304, left: 91, width: 341, height: 70 }
      }),

      experiment: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'experiment',
        target: 'Lab.inheritance2',
        action: 'goExperiment1',
        title: 'In the Clutches of Drakes',
        layout: { top: 399, left: 91, width: 341, height: 70 }
      }),

      individual: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'individual',
        target: 'Lab.inheritance2',
        action: 'goIndividual1',
        title: 'Drake Forecast',
        layout: { top: 100, left: 522, width: 341, height: 70 }
      }),

      group: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'group',
        target: 'Lab.inheritance2',
        action: 'goGroup1',
        title: 'A Perfect Look-alike',
        layout: { top: 195, left: 522, width: 341, height: 70 }
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
    SC.routes.set('location', 'lab/training1');
  },
  goExperiment1: function() {
    SC.routes.set('location', 'lab/experiment1');
  },
  goIndividual1: function() {
    SC.routes.set('location', 'lab/individual1');
  },
  goGroup1: function() {
    SC.routes.set('location', 'lab/group1');
  }
});
