// ==========================================================================
// Project:   Lab - mainPage
// Copyright: 2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse*/

// This page describes the main user interface for your application.
Lab.mainPage = SC.Page.design({

  pagePath: 'Lab.mainPage',
  title: 'Lab Main Page',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design({
    title: "Welcome to the Geniverse Labs",
    classNames: ['brown'],
    childViews: 'mainAppView'.w(),

    mainAppView: SC.View.design({
      layout: { top: 0, centerX: 0, width: 960},
      childViews: 'loadingView'.w(),

      loadingView: SC.LabelView.design({
        layout: { centerY: 0, centerX: 0, width: 300, height: 100 },
        classNames: ['loading-text'],
        value: "Loading..."
      }),

      focusMainFrom: function(pane) {
        SC.$('title').text(this.get('title'));
      }
    })
  })

});
