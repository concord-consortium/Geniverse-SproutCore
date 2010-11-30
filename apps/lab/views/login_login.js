// ==========================================================================
// Project:   Lab.LoginView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Lab.LoginLoginView = SC.PanelPane.extend({
  layout: {centerX: 0, top: 10, width: 400, height: 100},
  contentView: SC.View.design({
     layout: {left: 0, top: 0, width: 400, height: 100},

     // TODO: Add your own code here.
     childViews: 'loginButtonView welcomeView usernameLabel usernameView passwordLabel passwordView'.w(),

       //isVisibleBinding: 'Lab.loginController.showRetypeField'
    //}),

     loginButtonView: SC.ButtonView.design({
       layout: { bottom: 10, height: 24, right: 10, width: 100 },
       title:  "login",
       action: 'Lab.loginController.loginPortal'
     }),

     welcomeView: SC.LabelView.design({
       layout: { top: 5, height: 24, left: 10, width: 400 },
       valueBinding: 'Lab.loginController.welcomeMessage'
     }),


     usernameLabel: SC.LabelView.design({
       layout: { bottom: 40, left: 10, height: 20, width: 65 },
       value: 'username'
     }),
     usernameView: SC.TextFieldView.design({
       layout: { bottom: 40, left: 75, height: 20, width: 90 },
       valueBinding: 'Lab.loginController.username'
     }),

     passwordLabel: SC.LabelView.design({
       layout: { bottom: 10, left: 10, height: 20, width: 65 },
       value: 'password'
     }),

     passwordView: SC.TextFieldView.design({
       layout: { bottom: 10, left: 75, height: 20, width: 90 },       
       isPassword: YES,
       valueBinding: 'Lab.loginController.password'
     })

  })
});


