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
    childViews: 'background'.w(),
    
    background: SC.ImageView.design({
      layout: { top: 0, centerX: 0, width: 960},
      value: static_url('mainscreen-bg.png')
    })
  })
});
