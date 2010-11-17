// ==========================================================================
// Project:   Geniverse - caselog page
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/**
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Geniverse, CC, CcChat, java static_url sc_static */
sc_require('mixins/simple_button');
sc_require('resources/master_view');

Lab.marginSize = 15;

Lab.caselog = SC.Page.design({
  
  pagePath: 'Lab.caselog',
  title: 'Case Log',
  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'], 
    childViews: 'backgroundView topBar mainAppView aRealMasterView'.w(),
    backgroundView: SC.ImageView.design({
      value: static_url('bg2'),
      classNames: ['transparent','scalingimage']
    }),
    topBar: SC.ToolbarView.design({
      layout: { top: 0, left: 0, right: 0, height: 36 },
      childViews: 'geniverseLabelView welcomeLabelView logoutButton'.w(),
      anchorLocation: SC.ANCHOR_TOP,
      
      geniverseLabelView: SC.LabelView.design({
        layout: { centerY: 0, height: 24, left: 8, width: 200 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        //valueBinding:   'Geniverse.activityController.title'
        value: "Case Log"
      }),
      
      welcomeLabelView: SC.LabelView.design({
        layout: { centerY: 0, height: 24, right: 130, width: 500},
        fontWeight: SC.BOLD_WEIGHT,
        textAlign: SC.ALIGN_RIGHT,
        valueBinding: 'Geniverse.loginController.welcomeMessage',
        isVisibleBinding: 'Geniverse.appController.userLoggedIn'
      }),

      logoutButton: SC.ButtonView.design({
        layout: { centerY: 0, height: 24, right: 12, width: 100 },
        layerId: 'logOutButton',
        title:  "Log out",
        target: 'Geniverse.appController',
        action: 'logout',
        isVisibleBinding: 'Geniverse.appController.userLoggedIn'
      })
    }),
    
    mainAppView: SC.View.design({
      layout: { top: 37, left: 0, right: 0 },
      layerId: 'caselogcontent',

      childViews: 'background training experiment individual group'.w(),

      background: SC.ImageView.design({
        layout: { top: 0, left: 0, right: 0 },
        value: static_url('caselog-bg')
      }),

      training: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'training',
        target: 'Lab.caselog',
        action: 'goTraining1',
        title: 'Drake Traits',
        layoutStyle: {
          background: 'transparent',
          border: 'none',
          height: '70px',
          left: '91px',
          position: 'absolute',
          top: '304px',
          width: '341px'
        }
      }),

      experiment: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'experiment',
        target: 'Lab.caselog',
        action: 'goExperiment1',
        title: 'In the Clutches of Drakes',
        layoutStyle: {
          background: 'transparent',
          border: 'none',
          height: '70px',
          left: '91px',
          position: 'absolute',
          top: '399px',
          width: '341px'
        }
      }),

      individual: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'individual',
        target: 'Lab.caselog',
        action: 'goIndividual1',
        title: 'Drake Forecast',
        layoutStyle: {
          background: 'transparent',
          border: 'none',
          height: '70px',
          left: '522px',
          position: 'absolute',
          top: '100px',
          width: '341px'
        }
      }),

      group: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'group',
        target: 'Lab.caselog',
        action: 'goGroup1',
        title: 'A Perfect Look-alike',
        layoutStyle: {
          background: 'transparent',
          border: 'none',
          height: '70px',
          left: '522px',
          position: 'absolute',
          top: '195px',
          width: '341px'
        }
      })

  	})
	}),
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
