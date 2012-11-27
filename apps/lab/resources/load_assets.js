// ==========================================================================
// Project:   Lab - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse */

// This page describes the main user interface for your application.
Lab.loadAssetsPage = SC.Page.design({
  pagePath: 'Lab.loadAssetsPage',
  title: 'Lab Asset Loading Page',
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design({
    defaultResponder: Lab.statechart,

    childViews: 'wait status'.w(),

    wait: SC.LabelView.design({
      layerId: 'pleaseWait',
      classNames: 'rather-unfortunate'.w(),
      layout: { centerX: 0, centerY: -23, width: 350, height: 46 },
      textAlign: SC.ALIGN_CENTER,
      value: "Loading. Please wait..."
    }),

    status: SC.View.design({
      layerId: 'loadingStatus',
      classNames: 'rather-unfortunate'.w(),
      layout: { centerX: 0, centerY: 23, width: 350, height: 46 }
    })
  })
});
