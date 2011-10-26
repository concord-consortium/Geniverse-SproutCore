// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CC, CcChat, java static_url sc_static sc_require */
Lab.marginSize = 15;

sc_require('views/top_bar_view');
sc_require('views/bottom_bar_view');

Lab.singleIframePage = SC.Page.design({
  
  pagePath: 'Lab.singleIframePage',
  title: 'DNA to Trait Page',
  
  // challengeType: 'matchOneAtATimeChallenge',
  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'], 
    childViews: 'backgroundView mainAppView topBar bottomBar'.w(),
    backgroundView: SC.ImageView.design({
      value: static_url('lab_background.png'),
      classNames: ['transparent','scalingimage']
    }),
    topBar: Lab.TopBarView.design({
      classNames: ['brown']
    }),
    bottomBar: Lab.BottomBarView.design({
      classNames: ['brown']
    }),

    mainAppView: SC.View.design({
      
      childViews: 'mwView'.w(),
      
		  mwView: SC.WebView.design({
      	layout: { top: 100, centerX: 0, width: 800, height: 430 },
//				value: 'http://geniverse.concord.org/mw/transcript-translate/transcriptTranslate.html',
				value: static_url('transcript-translate/transcriptTranslate.html'),
				shouldAutoResize: YES
			})
    })
  })      
});

