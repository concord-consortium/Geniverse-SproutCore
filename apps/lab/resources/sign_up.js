// ==========================================================================
// Project:   Lab - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse */

// This page describes the main user interface for your application.
Lab.signUp = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design({
    defaultResponder: Lab.LOGIN,
    classNames: ['brown'],

    title: "Welcome to the Geniverse Labs",
    childViews: 'background loginView'.w(),

    background: SC.ImageView.design({
      layout: { top: 0, left: 0, right: 0 },
      value: static_url('mainscreen-bg.jpg'),
      classNames: ['super-transparent']
    }),


    loginView: SC.LabelView.design({
      layout: {centerX: 0, top: Lab.marginSize, width: 200, height: 300},
      escapeHTML: NO,
      // TODO: Better redirect or something for this:
      value: 'first <a href="http://geniverse-portal.dev.concord.org/login">login</a> to participate '
    })
  })

});

