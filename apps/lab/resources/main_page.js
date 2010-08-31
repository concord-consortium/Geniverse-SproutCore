// ==========================================================================
// Project:   Lab - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab */

// This page describes the main user interface for your application.  
Lab.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    title: "Welcome to SproutCore!",
    childViews: 'labelView'.w(),
    
    labelView: SC.LabelView.design({
      layout: { centerX: 0, centerY: 0, width: 200, height: 18 },
      textAlign: SC.ALIGN_CENTER,
      tagName: "h1", 
      valueBinding: 'Lab.mainPage.mainPane.title'
    }),
    
    focusMainFrom: function(pane) {
      SC.$('title').text(this.get('title'));
    }
  })

});
