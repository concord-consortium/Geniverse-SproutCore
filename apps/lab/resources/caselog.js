// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse, CC, CcChat, java static_url sc_static */
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
    childViews: 'backgroundView topBar mainAppView'.w(),
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

      childViews: 'introFrame'.w(),

      introFrame: SC.WebView.design({
        value: static_url('caselog'),
        shouldAutoResize: YES
      })

  	})
	})
});
