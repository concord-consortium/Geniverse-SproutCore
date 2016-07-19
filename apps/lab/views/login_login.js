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

     childViews: 'logo loginButtonView welcomeView introLabel'.w(),

     logo: SC.ImageView.design({
       layout: {top: 0, left: 11, width: 188, height: 84 },
       value: static_url("geniverse-logo.png")
     }),

     loginButtonView: SC.ButtonView.design({
       layout: { bottom: 0, height: 40, centerX: 0, width: 210 },
       title:  function() {
        var extra = "";
        if (SC.buildMode == "demo") {
          extra = " Demo";
        }
        return "Continue to Geniverse" + extra;
       }.property('SC.buildMode'),
       action: function() {
        Lab.loginController.autoLogin("User", "User", "user");
       }
     }),

     welcomeView: SC.LabelView.design({
       layout: { top: 89, height: 20, left: 0, right: 0 },
       fontWeight: SC.BOLD_WEIGHT,
       textAlign: "center",
       attributeBindings: ['style'],
       controlSize: SC.LARGE_CONTROL_SIZE,
       value: 'Welcome!'
     }),

     introLabel: SC.LabelView.design({
       layout: { top: 129, height: 60, left: 0, right: 0 },
       escapeHTML: NO,
       value: function() {
         var extra = "";
         if (SC.buildMode == "demo") {
           extra = "This is the Geniverse DEMO site. ";
         }
         return extra + 'To log in to Geniverse and save your progress, visit <a href="https://geniverse-lab.concord.org/">geniverse-lab.concord.org</a>.';
       }.property()
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


