// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CC, CcChat, java static_url sc_static sc_require */
Lab.marginSize = 15;

sc_require('views/top_bar_view');
sc_require('views/bottom_bar_view');

Lab.matchNucleotidesGame = SC.Page.design({
  
  pagePath: 'Lab.matchNucleotidesGame',
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
              cmlUrl: "http://mw2.concord.org/model/1371db972fa/pagex.cml",
              width: 825,
              height: 550,
              layout: { centerX: 0, centerY: 0, width: 825, height: 550 }
            })
        })
    })
  })
});

