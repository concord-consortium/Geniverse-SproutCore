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
      childViews: 'caselogButtonView journalButtonView doorButtonView backdoorButtonView'.w(),

      caselogButtonView: SC.View.design(Geniverse.SimpleButton, {
        layerId: 'caselog',
        tagName: 'a',
        hasHover: YES,
        layout: { top: 614, centerX: 29, width: 258, height: 172 },
        target: 'Lab.routes',
        action: 'openCaselogRoute',
        value: static_url('mainscreen-caselog-highlighted')
      }),

      journalButtonView: SC.View.design(Geniverse.SimpleButton, {
        layerId: 'journal',
        tagName: 'a',
        hasHover: YES,
        layout: { top: 612, centerX: 217, width: 242, height: 125 },
        target: 'Lab.journalController',
        action: 'openWindow',
        value: static_url('mainscreen-journal-highlighted')
      }),

      doorButtonView: SC.View.design(Geniverse.SimpleButton, {
        layerId: 'door',
        tagName: 'a',
        hasHover: YES,
        layout: { top: 23, centerX: 403, width: 302, height: 485 },
        target: 'Lab.statechart',
        action: 'logOut',
        value: static_url('mainscreen-door-highlighted')
      }),

      backdoorButtonView: SC.View.design(Geniverse.SimpleButton, {
        layout: { top: 159, centerX: 71, width: 39, height: 39 },
        layerId: 'backdoor',
        tagName: 'a',
        hasHover: YES,
        target: 'Lab.backdoorController',
        action: 'showPane'
      }),

      focusMainFrom: function(pane) {
        SC.$('title').text(this.get('title'));
      }
    })
  })

});
