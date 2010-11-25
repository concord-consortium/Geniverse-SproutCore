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
         SC.Object.create({ value: 3, title: 'member 3'})
       ],

       valueBinding: 'Lab.loginController.memberNumber',
       nameKey: 'title',
       valueKey: 'value'
     }),

     groupSelectView: SC.SelectFieldView.design({
       layout: { bottom: 10, left: 110, height: 25, width: 90 },

       objects: [ 
         SC.Object.create({ value: 1, title: 'group 1'}),
         SC.Object.create({ value: 2, title: 'group 2'}),
         SC.Object.create({ value: 3, title: 'group 3'})
       ],

       valueBinding: 'Lab.loginController.groupNumber',
       nameKey: 'title',
       valueKey: 'value'
     })
  })
});


