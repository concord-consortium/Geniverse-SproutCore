// ==========================================================================
// Project:   Geniverse - individual1 page
// Copyright: 2010 Concord Consortium
// ==========================================================================
/**
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Geniverse, CC, CcChat, java static_url sc_static */
sc_require('views/lab_pane');

Lab.marginSize = 15;

Lab.individual1 = SC.Page.design({

  pagePath: 'Lab.individual1',
  title: 'Drake Forecast | Geniverse',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: Lab.LabPane.design({
    mainAppView: SC.View.design({
      layout: { top: 37, left: 0, right: 0 },
      layerId: 'content',

      childViews: 'background returnButton continueButton'.w(),

      background: SC.ImageView.design({
        layout: { top: 0, left: 0, right: 0 },
        value: static_url('individual-bg1.jpg')
      }),

      returnButton: SC.View.design(Geniverse.SimpleButton, {
        hasHover: YES,
        tagName: 'a',
        layerId: 'returnButton',
        target: 'Lab.individual1',
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
        target: 'Lab.individual1',
        action: 'goIndividual2',
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

  goIndividual2: function() {
    SC.routes.set('location', 'lab/individual2');
  }
});
