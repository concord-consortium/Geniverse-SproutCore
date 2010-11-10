// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */
Geniverse.marginSize = 15;

sc_require('views/breed_dragon');
sc_require('views/chromosome');
sc_require('views/dragon_genome');

Geniverse.InnerView = SC.View.extend({
  childViews: 'textView'.w(),
  
  textView: SC.LabelView.design({
    layout: {top: 0, left: 0, width: 200, height: 25 },
    valueBinding: '*parentView*parentView.checked'
  })
});

Geniverse.OuterView = SC.View.extend({
  childViews: 'innerView checkbox'.w(),
  
  checked: NO,
  
  innerView: Geniverse.InnerView.design({
    layout: {top: 0, left: 0, width: 200, height: 25 }
  }),
  
  checkbox: SC.CheckboxView.design({
    layout: { top: 30, left: 0, width: 250, height: 25 },
    title: "Checked",
    valueBinding: '*parentView.checked'
  })
});

Geniverse.scratch = SC.Page.design({

  mainPane: SC.MainPane.design({
    childViews: 'outerView outerView2'.w(),
    
    outerView: Geniverse.OuterView.design({
      layout: {top: 10, left: 10, width: 200, height: 60 }
    }),
    
    outerView2: Geniverse.OuterView.design({
      layout: {top: 10, left: 210, width: 200, height: 60 }
    })
    
  })
  
});
