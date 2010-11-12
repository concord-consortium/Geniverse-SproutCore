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
    childViews: 'backgroundView mainscreenView labelView buttonView'.w(),

    backgroundView: SC.ImageView.design({
      value: static_url('bg2.png')
    }),

    mainscreenView: SC.ImageView.design({
      value: static_url('mainscreen-bg.png')
    }),

    labelView: SC.LabelView.design({
      layout: { top: 6, left: 4, width: 200, height: 18 },
      textAlign: SC.ALIGN_CENTER,
      tagName: "h1",
      valueBinding: 'Lab.mainPage.mainPane.title'
    }),

    buttonView: SC.ButtonView.design({
      layout: { top: 6, left: 200, width: 200 },
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
