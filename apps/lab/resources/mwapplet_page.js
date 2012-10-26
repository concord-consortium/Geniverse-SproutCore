// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CC, CcChat, java static_url sc_static sc_require */
Lab.marginSize = 15;

sc_require('views/top_bar_view');
sc_require('views/bottom_bar_view');

Lab.mwAppletPage = SC.Page.design({
  
  pagePath: 'Lab.mwAppletPage',
  title: 'Identify the Connection Between DNA and Amino Acids',
  
  // challengeType: 'matchOneAtATimeChallenge',
  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown','lab'],
    childViews: 'mainAppView topBar bottomBar'.w(),
    topBar: Lab.TopBarView.design({
      classNames: ['brown']
    }),
    bottomBar: Lab.BottomBarView.design({
      classNames: ['brown']
    }),

    mainAppView: SC.View.design({
      
      childViews: 'mwAppletView'.w(),
      
        mwAppletView: SC.View.design({

          childViews: 'mwApplet'.w(),

            mwApplet: CC.MwAppletView.design({
              cmlUrl: "http://mw2.concord.org/model/1371060f321/transcribe-translate2.cml",
              width: 825,
              height: 500,
              layout: { centerX: 0, centerY: -25, width: 825, height: 500 }
            })
        })
    })
  })
});

