// ==========================================================================
// Project:   Geniverse - group1 page
// Copyright: 2010 Concord Consortium
// ==========================================================================
/**
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Geniverse, CC, CcChat, java static_url sc_static */
sc_require('views/top_bar_view');

Lab.marginSize = 15;

Lab.group1 = SC.Page.design({

  pagePath: 'Lab.group1',
  title: 'A Perfect Look-alike | Geniverse',

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
      titlePath: 'Lab.group1.title'
    }),

    mainAppView: SC.View.design({
      layout: { top: 37, left: 0, right: 0 },
      layerId: 'content',

      childViews: 'background returnButton continueButton'.w(),

      background: SC.ImageView.design({
        layout: { top: 0, left: 0, right: 0 },
        value: static_url('group-bg1.jpg')
      }),

      returnButton: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'returnButton',
        target: 'Lab.group1',
        action: 'goCaseLog',
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

      continueButton: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'continueButton',
        target: 'Lab.group1',
        action: 'goGroupPage',
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

  goCaseLog: function() {
    SC.routes.set('location', 'lab/caselog');
  },

  goGroupPage: function() {
    SC.routes.set('location', 'heredity/apprentice/group');
  }
});
