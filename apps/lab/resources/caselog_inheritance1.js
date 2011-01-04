// ==========================================================================
// Project:   Geniverse - caselog page
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/**
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Geniverse, CC, CcChat, java static_url sc_static */
sc_require('mixins/simple_button');
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
    childViews: 'backgroundView topBar mainAppView'.w(),
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

      childViews: 'background inheritance2right meiosis training experiment individual group'.w(),

      background: SC.ImageView.design({
        layout: { top: 0, left: 0, right: 0 },
        value: static_url('caselog-bg-inheritance')
      }),

      inheritance2right: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'inheritance2right',
        target: 'Lab.caselog',
        action: 'goInheritance2',
        title: 'Inheritance II',
        layout: { top: 193, right: 3, width: 43, height: 146 }
      }),

      meiosis: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'meiosis',
        target: 'Lab.caselog',
        action: 'goMeiosis',
        title: 'Meiosis',
        layout: { top: 348, right: 0, width: 42, height: 145 }
      }),

      training: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'training',
        target: 'Lab.caselog',
        action: 'goTraining1',
        title: 'Drake Traits',
        layout: { top: 304, left: 91, width: 341, height: 70 }
      }),

      experiment: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'experiment',
        target: 'Lab.caselog',
        action: 'goExperiment1',
        title: 'In the Clutches of Drakes',
        layout: { top: 399, left: 91, width: 341, height: 70 }
      }),

      individual: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'individual',
        target: 'Lab.caselog',
        action: 'goIndividual1',
        title: 'Drake Forecast',
        layout: { top: 100, left: 522, width: 341, height: 70 }
      }),

      group: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'group',
        target: 'Lab.caselog',
        action: 'goGroup1',
        title: 'A Perfect Look-alike',
        layout: { top: 195, left: 522, width: 341, height: 70 }
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
