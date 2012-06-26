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
    childViews: 'mainAppView'.w(),

    mainAppView: SC.View.design({

      childViews: 'mwView'.w(),

      mwView: SC.WebView.design({
      layout: { centerY: -20, centerX: 0, width: 706, height: 500 },
//				value: 'http://geniverse.concord.org/mw/transcript-translate/transcriptTranslate.html',
//        value: static_url('transcript-translate/transcriptTranslate.html'),
        value: static_url('transcribeFlash/playTranscribe.html'),
				shouldAutoResize: YES
			})
    })
  })
});

