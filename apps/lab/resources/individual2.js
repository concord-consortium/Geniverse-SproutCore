// ==========================================================================
// Project:   Geniverse - individual2 page
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/**
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Geniverse, CC, CcChat, java static_url sc_static */
sc_require('mixins/simple_button');
sc_require('resources/top_bar_view');

Lab.marginSize = 15;

Lab.individual2 = SC.Page.design({

  pagePath: 'Lab.individual2',
  title: 'Drake Forecast | Geniverse',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'],
    childViews: 'backgroundView topBar mainAppView'.w(),
    backgroundView: SC.ImageView.design({
      value: static_url('bg2'),
      classNames: ['transparent','scalingimage']
    }),
    topBar: Lab.TopBarView.design({
      titlePath: 'Lab.individual2.title',
      welcomePath: 'Lab.loginController.welcomeMessage',
      welcomeIsVisiblePath: 'Lab.LOGIN.userLoggedIn',
      logoutButtonTargetPath: 'Lab.ACTIVITY',
      logoutButtonIsVisiblePath: 'Lab.LOGIN.userLoggedIn'
    }),

    mainAppView: SC.View.design({
      layout: { top: 37, left: 0, right: 0 },
      layerId: 'content',

      childViews: 'background returnButton continueButton'.w(),

      background: SC.ImageView.design({
        layout: { top: 0, left: 0, right: 0 },
        value: static_url('individual-bg2.jpg')
      }),

      returnButton: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'returnButton',
        target: 'Lab.individual2',
        action: 'goIndividual1',
        layoutStyle: {
          background: 'transparent',
          bottom: '115px',
          clear: 'both',
          display: 'block',
          height: '35px',
          left: '85px',
          position: 'absolute',
          'text-align': 'right',
          'text-decoration': 'none',
          width: '130px'
        }
      }),

      continueButton: SC.View.design(Lab.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'continueButton',
        target: 'Lab.individual2',
        action: 'goIndividualPage',
        layoutStyle: {
          //background: 'transparent',
          bottom: '115px',
          clear: 'both',
          display: 'block',
          height: '35px',
          right: '95px',
          position: 'absolute',
          'text-align': 'right',
          'text-decoration': 'none',
          width: '130px'
        }
      })
  	})
	}),

  goIndividual1: function() {
    SC.routes.set('location', 'lab/individual1');
  },

  goIndividualPage: function() {
    SC.routes.set('location', 'heredity/apprentice/individual');
  }
});
