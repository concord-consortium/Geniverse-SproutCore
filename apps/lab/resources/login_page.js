// ==========================================================================
// Project:   Lab - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab Geniverse */

// This page describes the main user interface for your application.  
Lab.loginPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    defaultResponder: Lab.LOGIN,
    
    classNames: ['brown'],
    
    title: "Welcome to the Geniverse Labs",
    childViews: 'backgroundView loginView'.w(),
    
    backgroundView: SC.ImageView.design({
      value: static_url('bg2.png'),
      classNames: ['transparent','scalingimage']
    }),
    
    loginView: Lab.LoginView.design({
      layout: {centerX: 0, top: Lab.marginSize, width: 700, height: 100},
      layerId: "chatLogin"
    })
  })

});
