// ==========================================================================
// Project:   Lab - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse */

// This page describes the main user interface for your application.  
Lab.loginPage = SC.Page.design({
  pagePath: 'Lab.loginPage',
  title: 'Lab Login Page',
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    defaultResponder: Lab.statechart,

    title: "Welcome to the Geniverse Labs",
    childViews: 'welcome checkPanel loginPanel'.w(),

    welcome: SC.LabelView.design({
      layout: { top: 40, width: 610, height: 40, centerX: 0 },
      classNames: ['login','welcome'],
      fontWeight: SC.BOLD_WEIGHT,
      value: "Welcome to Geniverse"
    }),

    checkPanel: Lab.LoginCheckView.design({
      layout: {top: 110, width: 400, height: 100, centerX: 0},
      isVisibleBinding: 'Lab.loginController.checkShowing'
    }),

    loginPanel: Lab.LoginLoginView.design({
      layout: {top: 110, width: 400, height: 100, centerX: 0},
      isVisibleBinding: 'Lab.loginController.loginShowing'
    })
  })
});
