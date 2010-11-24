// ==========================================================================
// Project:   Lab.LoginView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Lab.LoginView = SC.View.extend(
/** @scope Lab.LoginView.prototype */ {

   showPasswordField: YES,

   // TODO: Add your own code here.
   //childViews: 'nameLabel nameField passwordLabel passwordField retypePasswordLabel retypePasswordField startButtonView registerButtonView welcomeView memberSelectView groupSelectView'.w(),
   childViews: 'startButtonView welcomeView memberSelectView groupSelectView'.w(),

   //nameLabel: SC.LabelView.design({
     //layout: {left: 40, top: 5, width: 80, height: 24 },
     //value: "Username",
     //fontWeight: SC.BOLD_WEIGHT
  //}),

   //nameField: SC.TextFieldView.design({
     //layout: {left: 130, top: 5, width: 200, height: 24 },
     //isTextArea: NO,
     //valueBinding: 'Lab.loginController.username',
     //keyUp: function (evt){
       //if (evt.keyCode === 13){
         //Lab.LOGIN.login();
       //}
       //this.fieldValueDidChange();
       //evt.allowDefault(); 
       //return YES;
     //}
  //}),

  //passwordLabel: SC.LabelView.design({
     //layout: {left: 40, top: 35, width: 80, height: 24 },
     //value: "Password",
     //fontWeight: SC.BOLD_WEIGHT,
     //isVisibleBinding: '*parentView.showPasswordField'
  //}),

   //passwordField: SC.TextFieldView.design({
     //layout: {left: 130, top: 35, width: 200, height: 24 },
     //isPassword: YES,
     //isTextArea: NO,
     //valueBinding: 'Lab.loginController.passwordValue',
     //keyUp: function (evt){
       //if (evt.keyCode === 13){
         //Lab.LOGIN.login();
       //}
       //this.fieldValueDidChange();
       //evt.allowDefault(); 
       //return YES;
     //},
     //isVisibleBinding: '*parentView.showPasswordField'
  //}),

  //retypePasswordLabel: SC.LabelView.design({
     //layout: {left: 0, top: 65, width: 120, height: 24 },
     //value: "Retype Password",
     //fontWeight: SC.BOLD_WEIGHT,
     //isVisibleBinding: 'Lab.loginController.showRetypeField'
  //}),

   //retypePasswordField: SC.TextFieldView.design({
     //layout: {left: 130, top: 65, width: 200, height: 24 },
     //isPassword: YES,
     //isTextArea: NO,
     //valueBinding: 'Lab.loginController.retypePasswordValue',
     //keyUp: function (evt){
       //if (evt.keyCode === 13){
         //Lab.loginController.register();
       //}
       //this.fieldValueDidChange();
       //evt.allowDefault(); 
       //return YES;
     //},
     //isVisibleBinding: 'Lab.loginController.showRetypeField'
  //}),

   startButtonView: SC.ButtonView.design({
     layout: { top: 35, height: 24, left: 350, width: 100 },
     title:  "Start",
     action: 'start',
     isEnabledBinding: 'Lab.loginController.loggedIn',

     init: function() {
       if (!this.get('parentView').get('showPasswordField')){
         this.adjust({ top: 5 });
       }
      sc_super();
    }
   }),

   welcomeView: SC.LabelView.design({
     layout: { top: 5, height: 24, left: 130, width: 400 },
     value: "",
     valueBinding: SC.Binding.from('Lab.loginController.welcomeMessage').oneWay()
   }),

   memberSelectView: SC.SelectFieldView.design({
     layout: { top: 65, left: 130, height: 25, width: 90 },
     objects: [ 
       SC.Object.create({ value: 1, title: 'member 1'}),
       SC.Object.create({ value: 2, title: 'member 2'}),
       SC.Object.create({ value: 3, title: 'member 3'})
     ],

     isEnabledBinding: 'Lab.loginController.loggedIn',
     valueBinding: 'Lab.loginController.memberNumber',
     nameKey: 'title',
     valueKey: 'value'
   }),

   groupSelectView: SC.SelectFieldView.design({
     layout: { top: 65, left: 230, height: 25, width: 90 },

     objects: [ 
       SC.Object.create({ value: 1, title: 'group 1'}),
       SC.Object.create({ value: 2, title: 'group 2'}),
       SC.Object.create({ value: 3, title: 'group 3'})
     ],

     isEnabledBinding: 'Lab.loginController.loggedIn',
     valueBinding: 'Lab.loginController.groupNumber',
     nameKey: 'title',
     valueKey: 'value'
   })

});
