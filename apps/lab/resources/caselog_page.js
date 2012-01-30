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
    
    childViews: ['caselogView'],
    
    caselogView: SC.View.design({
      render: function (context, isFirstTime) {
        if (isFirstTime) {
          
          context.push("<div>\n" +
           "<p>Try <a href=\"#case4/argumentation\">Case 4\'s argumentation challenge.</a></p>\n" + 
           "<p>Alternatively, try <a href=\"#demos/challenge1\">This demo challenge</a></p>\n" + 
           "</div>");
        }
        return context;
      }
    })
  })
  
});
