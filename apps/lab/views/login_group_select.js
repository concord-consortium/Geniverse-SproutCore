// ==========================================================================
// Project:   Lab.LoginView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Lab.LoginGroupView = SC.PanelPane.extend({
  layout: {centerX: 0, top: 10, width: 400, height: 100},
  contentView: SC.View.design({
     layout: {left: 0, top: 0, width: 400, height: 100},

     // TODO: Add your own code here.
     //childViews: 'nameLabel nameField passwordLabel passwordField retypePasswordLabel retypePasswordField startButtonView registerButtonView welcomeView memberSelectView groupSelectView'.w(),
     childViews: 'startButtonView welcomeView memberSelectView groupSelectView'.w(),

       //isVisibleBinding: 'Lab.loginController.showRetypeField'
    //}),

     startButtonView: SC.ButtonView.design({
       layout: { bottom: 10, height: 24, right: 10, width: 100 },
       title:  "Start",
       action: 'Lab.loginController.finish',
       isEnabled: NO,
       isEnabledBinding: 'Lab.loginController.loggedIn'
     }),

     welcomeView: SC.LabelView.design({
       layout: { top: 5, height: 24, left: 10, width: 400 },
       value: "",
       valueBinding: SC.Binding.from('Lab.loginController.welcomeMessage').oneWay()
     }),

     memberSelectView: SC.SelectFieldView.design({
       layout: { bottom: 10, left: 10, height: 25, width: 90 },
       objects: [
         SC.Object.create({ value: 1, title: 'member 1'}),
         SC.Object.create({ value: 2, title: 'member 2'}),
         SC.Object.create({ value: 3, title: 'member 3'}),
         SC.Object.create({ value: 4, title: 'member 4'}),
         SC.Object.create({ value: 5, title: 'member 5'})
       ],

       valueBinding: 'Geniverse.userController.content.memberId',
       nameKey: 'title',
       valueKey: 'value'
     }),

     groupSelectView: SC.SelectFieldView.design({
       layout: { bottom: 10, left: 110, height: 25, width: 90 },

       objects: [
         SC.Object.create({ value: 1, title: 'group 1'}),
         SC.Object.create({ value: 2, title: 'group 2'}),
         SC.Object.create({ value: 3, title: 'group 3'}),
         SC.Object.create({ value: 4, title: 'group 4'}),
         SC.Object.create({ value: 5, title: 'group 5'}),
         SC.Object.create({ value: 6, title: 'group 6'}),
         SC.Object.create({ value: 7, title: 'group 7'}),
         SC.Object.create({ value: 8, title: 'group 8'}),
         SC.Object.create({ value: 9, title: 'group 9'}),
         SC.Object.create({ value: 10, title: 'group 10'})
       ],

       disableSort: YES,
       valueBinding: 'Geniverse.userController.content.groupId',
       nameKey: 'title',
       valueKey: 'value'
     })
  })
});


