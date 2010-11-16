// ==========================================================================
// Project:   Lab - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab Geniverse */

// This page describes the main user interface for your application.  
Lab.pageIndex = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    title: "Welcome to the Geniverse Labs",
    childViews: 'labelView'.w(),
    
    init: function() {
  	  sc_super();
      this.addLinks();
  	},
    
    labelView: SC.LabelView.design({
      layout: { top: 50, left: 50, width: 200, height: 18 },
      textAlign: SC.ALIGN_CENTER,
      tagName: "h1", 
      valueBinding: 'Lab.mainPage.mainPane.title'
    }),

    addLinks: function (dragon, i) {
      var pages = SC.Page.instances;
      
      var totalLinks = 0;
      var titles = [];
      
      pages.forEach(function(item, i) {
        if (item.pagePath && item.title){
          var path = item.pagePath.split('.');
          if (path[0] === "Lab"){
            path = "lab/"+path[1];
          } else if (path[0] === "Geniverse"){
            path = "geniverse/"+path[1];
          } else {
            path = "";
          }
          
          if (!titles[item.title]) {
            var linkView = SC.LabelView.create({
              value: "<a href=\"#"+path+"\">"+item.title+"</a>",
              layout: {top: (100 + (totalLinks * 30)), left: 100, height: 40, width: 200},
              escapeHTML: NO
            });
            this.appendChild(linkView);
            totalLinks++;
            titles[item.title] = true;
          }
        }
       // var path = item.getPath();
      }, this);
    }
  })

});
