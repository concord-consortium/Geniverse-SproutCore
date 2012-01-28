// ==========================================================================
// Project:   Geniverse Lab - Caselog page
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Geniverse Lab*/

sc_require('views/top_bar_view');
sc_require('views/bottom_bar_view');

Lab.caselogPage = SC.Page.design({
  
  // used for the index page
  pagePath: 'Lab.caselogPage',
  title: 'Caselog Page',
  
  mainPane: SC.MainPane.design({
    
    classNames: ['brown'],
    
    childViews: ['topBar', 'bottomBar', 'mainAppView'],

    topBar: Lab.TopBarView.design({
      classNames: ['brown']
    }),
    
    bottomBar: Lab.BottomBarView.design({
      classNames: ['brown']
    }),
    
    mainAppView: SC.View.design({
      layout: { top: 25, bottom: 0, left: 10, right: 0 },
      
      childViews: ['label1View', 'label2View'],
      
      label1View: SC.LabelView.design({
        layout: { width: 400, height: 20, centerX: 0, centerY: -10 },
        value: "Hello from the caselog! Try <a href=\"#case4/argumentation\">Case 4\'s argumentation challenge.</a>",
        escapeHTML: false
      }),
      
      label2View: SC.LabelView.design({
        layout: { width: 400, height: 20, centerX: 0, centerY: 10 },
        value: "Alternatively, try <a href=\"#demos/challenge1\">This demo challenge</a>",
        escapeHTML: false
      })
    })
  })
  
});
