sc_require('views/top_bar_view');
sc_require('views/bottom_bar_view');

Lab.LabPane = SC.MainPane.extend({
  classNames: ['brown','lab'],
  layout: { minHeight: 780, minWidth: 1200 },

  childViews: 'mainAppView topBar bottomBar'.w(),

  topBar: Lab.TopBarView.design({
    classNames: ['brown']
  }),

  bottomBar: Lab.BottomBarView.design({
    classNames: ['brown']
  }),

  mainAppView: SC.View.design()
});
