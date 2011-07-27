// ==========================================================================
// Project:   Geniverse - caselog page
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/**
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Geniverse, CC, CcChat, java static_url sc_static Lab */


// silly temporary page for PD to use new case log -dan
Lab.marginSize = 15;

Lab.caselog2 = SC.Page.design({
  
  pagePath: 'Lab.caselog2',
  title: 'Case Log',
  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'], 
    childViews: 'mainAppView'.w(),

    mainAppView: SC.WebView.design({
      layout: { top: 100, bottom: 100, left: 1000, right: 100 },
			value: 'http://geniverse.concord.org/caselog/'
  	})
	})
});
