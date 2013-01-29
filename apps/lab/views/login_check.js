// ==========================================================================
// Project:   Lab.LoginView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Lab.LoginCheckView = SC.View.extend({
     layout: {left: 0, top: 0, width: 400, height: 100},

     // TODO: Add your own code here.
     childViews: 'welcomeView '.w(),


     welcomeView: SC.LabelView.design({
       layout: { top: 5, height: 24, left: 10, width: 400 },
       value: "please wait ..."
     })

});


