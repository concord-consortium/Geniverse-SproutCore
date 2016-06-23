// ==========================================================================
// Project:   Lab.LoginView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Lab.LoginLoginView = SC.View.extend({
     layout: {left: 0, top: 0, width: 400, height: 100},

     childViews: 'logo loginButtonView welcomeView usernameLabel usernameView passwordLabel passwordView registerView demoLinkView'.w(),

     logo: SC.ImageView.design({
       layout: {top: 0, left: 11, width: 188, height: 84 },
       value: static_url("geniverse-logo.png")
     }),

     loginButtonView: SC.ButtonView.design({
       layout: { top: 216, height: 40, right: 0, width: 90 },
       title:  "enter &raquo;",
       isVisibleBinding: 'Lab.loginController.loginShowing',
       action: 'Lab.loginController.loginPortal'
     }),

     welcomeView: SC.LabelView.design({
       layout: { top: 89, height: 20, left: 0, width: 210 },
       valueBinding: 'Lab.loginController.welcomeMessage'
     }),

     registerView: SC.LabelView.design({
       layout: { bottom: 77, height: 20, left: 0, width: 210 },
       escapeHTML: false,
       value: "Don't have a login? <a style='text-decoration:none; color:#2a777b;' href='/portal'>Register now <span style='color:#eb8723;'>&raquo;</span></a>"
     }),

     demoLinkView: SC.LabelView.design({
       layout: { bottom: 11, height: 45, left: 0, width: 210 },
       escapeHTML: false,
       value: "Want to try the game without saving data? <a style='text-decoration:none; color:#2a777b;' href='http://demo.geniverse.concord.org'>Go to the Demo Site <span style='color:#eb8723;'>&raquo;</span></a>"
     }),


     usernameLabel: SC.LabelView.design({
       layout: { top: 117, left: 0, height: 20, width: 210 },
       isVisibleBinding: 'Lab.loginController.loginShowing',
       value: 'username'
     }),
     usernameView: SC.TextFieldView.design({
       layout: { top: 137, left: 0, height: 20, width: 210 },
       isVisibleBinding: 'Lab.loginController.loginShowing',
       valueBinding: 'Lab.loginController.username',
       keyDown: function (evt){
         // HACK on tab, focus on the password field.
         // This fixes a bug where after you log out, tab no longer switches the cursor location.
         // This has to happen on keyDown so that we intercept it before the browser handles it.
         if (evt.keyCode === 9){
           this.getPath('parentView.passwordView').$input().focus();
           return YES;
         }
         this.fieldValueDidChange();
         evt.allowDefault();
         return YES;
       }
     }),

     passwordLabel: SC.LabelView.design({
       layout: { top: 166, left: 0, height: 20, width: 210 },
       isVisibleBinding: 'Lab.loginController.loginShowing',
       value: 'password'
     }),

     passwordView: SC.TextFieldView.design({
       layout: { top: 185, left: 0, height: 20, width: 210 },
       isVisibleBinding: 'Lab.loginController.loginShowing',
       isPassword: YES,
       valueBinding: 'Lab.loginController.password',
       keyUp: function (evt){
         if (evt.keyCode === 13){
           Lab.loginController.loginPortal();
         }
         this.fieldValueDidChange();
         evt.allowDefault();
         return YES;
       }
     })

});


