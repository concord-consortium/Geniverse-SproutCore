// ==========================================================================
// Project:   Lab - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse */

// This page describes the main user interface for your application.  
Lab.loginPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    defaultResponder: Lab.LOGIN,
    
    title: "Welcome to the Geniverse Labs",
    childViews: 'loginView'.w(),
    
    loginView: Lab.LoginView.design({
      layout: {centerX: 0, top: Lab.marginSize, width: 500, height: 100},
      layerId: "chatLogin",
      classNames: 'brown'.w()
    })
  })

});
