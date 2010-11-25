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
       action: 'Lab.loginController.login'
     }),

     welcomeView: SC.LabelView.design({
       layout: { top: 5, height: 24, left: 10, width: 400 },
       value: "(this doesn't work yet please log in through the portal)"
     }),


     usernameLabel: SC.LabelView.design({
       layout: { top: 30, left: 10, height: 25, width: 90 },
       value: 'username'
     }),
     usernameView: SC.TextFieldView.design({
       layout: { bottom: 10, left: 10, height: 25, width: 90 },
       valueBinding: 'Lab.loginController.username'
     }),

     passwordLabel: SC.LabelView.design({
       layout: { top: 30, left: 110, height: 25, width: 90 },
       value: 'password'
     }),

     passwordView: SC.TextFieldView.design({
       layout: { bottom: 10, left: 110, height: 25, width: 90 },       
       isPassword: YES,
       valueBinding: 'Lab.loginController.password'
     })

  })
});


