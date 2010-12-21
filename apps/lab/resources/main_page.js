// ==========================================================================
// Project:   Lab - mainPage
// Copyright: 2010 Concord Consortium
// ==========================================================================
/*globals Lab */
sc_require('mixins/simple_button');

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
    childViews: 'topBar mainAppView'.w(),
    topBar: Lab.TopBarView.design({
      titlePath: 'Lab.mainPage.mainPane.title'
    }),

    mainAppView: SC.View.design({
      layout: { top: 42, centerX: 0, width: 960},
      childViews: 'backgroundView caselogButtonView journalButtonView'.w(),

      backgroundView: SC.ImageView.design({
        layout: { top:0, centerX: 0, width: 960},
        value: static_url('mainscreen-bg.png')
      }),

      caselogButtonView: SC.View.design(Lab.SimpleButton, {
        layerId: 'caselog',
        tagName: 'a',
        hasHover: YES,
        layout: { top: 438, left: 467, width: 372, height: 158 },
        alt: 'Go to the Case Log',
        toolTip: 'Go to the Case Log',
        target: 'Lab.mainPage',
        action: 'goCaseLog',
        value: static_url('mainscreen-caselog-highlighted')
      }),

      journalButtonView: SC.View.design(Lab.SimpleButton, {
        layerId: 'journal',
        tagName: 'a',
        hasHover: YES,
        layout: { top: 477, left: 71, width: 249, height: 123 },
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
  }),

  goCaseLog: function() {
    SC.routes.set('location', 'lab/caselog');
  }

});
