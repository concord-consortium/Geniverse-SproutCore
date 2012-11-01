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
    title: "Office",
    classNames: ['brown','mainPane'],
    childViews: 'mainAppView topBar'.w(),
    topBar: Lab.TopBarView.design(),

    mainAppView: SC.View.design({
      layout: { top: 57, centerX: 0, width: 1890, height: 890},
      classNames: ['mainscreen'],
      childViews: 'caselogButtonView journalButtonView'.w(),

      caselogButtonView: SC.View.design(Geniverse.SimpleButton, {
        layerId: 'caselog',
        tagName: 'a',
        hasHover: YES,
        layout: { top: 614, centerX: 29, width: 258, height: 172 },
        alt: 'Go to the Case Log',
        toolTip: 'Go to the Case Log',
        target: 'Lab.routes',
        action: 'openCaselogRoute',
        value: static_url('mainscreen-caselog-highlighted')
      }),

      journalButtonView: SC.View.design(Geniverse.SimpleButton, {
        layerId: 'journal',
        tagName: 'a',
        hasHover: YES,
        layout: { top: 612, centerX: 217, width: 242, height: 125 },
        alt: 'Open the 3G Journal',
        toolTip: 'Open the 3G Journal',
        target: 'Lab.journalController',
        action: 'openWindow',
        value: static_url('mainscreen-journal-highlighted')
      }),

      focusMainFrom: function(pane) {
        SC.$('title').text(this.get('title'));
      }
    })
  })

});
