// ==========================================================================
// Project:   Lab - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab */

// This page describes the main user interface for your application.  
Lab.mainPage = SC.Page.design({
  
  pagePath: 'Lab.mainPage',
  title: 'Lab Main Page',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    title: "Welcome to the Geniverse Labs",
    childViews: 'labelView buttonView'.w(),
    
    labelView: SC.LabelView.design({
      layout: { top: 50, left: 50, width: 200, height: 18 },
      textAlign: SC.ALIGN_CENTER,
      tagName: "h1", 
      valueBinding: 'Lab.mainPage.mainPane.title'
    }),
    
    buttonView: SC.ButtonView.design({
      layout: { top: 120, left: 80, width: 200 },
      title: 'Go to the training page',
      action: 'go'
    }),

    go: function() {
      SC.routes.set('location', 'chromosomeTrainingPage');
    },
    
    focusMainFrom: function(pane) {
      SC.$('title').text(this.get('title'));
    }
  })

});
