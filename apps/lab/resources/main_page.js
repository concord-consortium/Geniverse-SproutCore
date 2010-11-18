// ==========================================================================
// Project:   Lab - mainPage
// Copyright: ©2010 Concord Consortium
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
    childViews: 'backgroundView topBar mainAppView'.w(),
    backgroundView: SC.ImageView.design({
      value: static_url('bg2.png'),
      classNames: ['transparent','scalingimage']
    }),
    topBar: Lab.TopBarView.design({
      titlePath: 'Lab.mainPage.mainPane.title',
      welcomePath: 'Lab.loginController.welcomeMessage',
      welcomeIsVisiblePath: 'Lab.LOGIN.userLoggedIn',
      logoutButtonTargetPath: 'Lab.ACTIVITY',
      logoutButtonIsVisiblePath: 'Lab.LOGIN.userLoggedIn'
    }),

    mainAppView: SC.View.design({
      childViews: 'mainscreenView caselogButtonView'.w(),

      mainscreenView: SC.ImageView.design({
        layout: { top: 42, left: 5},
        value: static_url('mainscreen-bg')
      }),

      caselogButtonView: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        layout: { top: 480, left: 470, width: 372, height: 158 },
        //title: 'Go to the Case Log',
        target: 'Lab.mainPage',
        action: 'goCaseLog',
        value: static_url('mainscreen-caselog-highlighted')
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
