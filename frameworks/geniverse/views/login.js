// ==========================================================================
// Project:   Geniverse.LoginView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Geniverse.LoginView = SC.View.extend(
/** @scope Geniverse.LoginView.prototype */ {
  
  showPasswordField: YES,

  // TODO: Add your own code here.
  childViews: 'nameLabel nameField passwordLabel passwordField retypePasswordLabel retypePasswordField loginButtonView registerButtonView welcomeView memberSelectView groupSelectView'.w(),
  
  nameLabel: SC.LabelView.design({
    layout: {left: 40, top: 5, width: 80, height: 24 },
    value: "Username",
    fontWeight: SC.BOLD_WEIGHT
	}),
	
  nameField: SC.TextFieldView.design({
    layout: {left: 130, top: 5, width: 200, height: 24 },
    isTextArea: NO,
    valueBinding: 'Geniverse.loginController.username',
    keyUp: function (evt){
      if (evt.keyCode === 13){
        Geniverse.loginController.login();
      }
      this.fieldValueDidChange();
      evt.allowDefault(); 
      return YES;
    }
	}),
	
	passwordLabel: SC.LabelView.design({
    layout: {left: 40, top: 35, width: 80, height: 24 },
    value: "Password",
    fontWeight: SC.BOLD_WEIGHT,
    isVisibleBinding: '*parentView.showPasswordField'
	}),
	
  passwordField: SC.TextFieldView.design({
    layout: {left: 130, top: 35, width: 200, height: 24 },
    isPassword: YES,
    isTextArea: NO,
    valueBinding: 'Geniverse.loginController.passwordValue',
    keyUp: function (evt){
      if (evt.keyCode === 13){
        Geniverse.loginController.login();
      }
      this.fieldValueDidChange();
      evt.allowDefault(); 
      return YES;
    },
    isVisibleBinding: '*parentView.showPasswordField'
	}),
	
 retypePasswordLabel: SC.LabelView.design({
    layout: {left: 0, top: 65, width: 120, height: 24 },
    value: "Retype Password",
    fontWeight: SC.BOLD_WEIGHT,
    isVisibleBinding: 'Geniverse.loginController.showRetypeField'
	}),
	
  retypePasswordField: SC.TextFieldView.design({
    layout: {left: 130, top: 65, width: 200, height: 24 },
    isPassword: YES,
    isTextArea: NO,
    valueBinding: 'Geniverse.loginController.retypePasswordValue',
    keyUp: function (evt){
      if (evt.keyCode === 13){
        Geniverse.loginController.register();
      }
      this.fieldValueDidChange();
      evt.allowDefault(); 
      return YES;
    },
    isVisibleBinding: 'Geniverse.loginController.showRetypeField'
	}),
	
  loginButtonView: SC.ButtonView.design({
    layout: { top: 35, height: 24, left: 350, width: 100 },
    title:  "Log in",
    target: 'Geniverse.loginController',
    action: 'login',
    isVisibleBinding: SC.Binding.not('Geniverse.loginController.showRetypeField'),
    
    init: function() {
      if (!this.get('parentView').get('showPasswordField')){
        this.adjust({ top: 5 });
      }
  		sc_super();
  	}
  }),
  
  registerButtonView: SC.ButtonView.design({
    layout: { top: 65, height: 24, left: 350, width: 140 },
    title:  "Register new user",
    target: 'Geniverse.loginController',
    action: 'register',
    isVisible: NO
    // isVisibleBinding: '*parentView.showPasswordField'
  }),
  
  welcomeView: SC.LabelView.design({
    layout: { top: 5, height: 24, left: 370, width: 200 },
    value: "",
    valueBinding: SC.Binding.from('Geniverse.loginController.welcomeMessage').oneWay()
  }),
  
  groupSelectView: SC.SelectFieldView.design({
    layout: { top: 65, left: 130, height: 25, width: 90 },
    
    objects: [ 
      SC.Object.create({ value: 1, title: 'group 1'}),
      SC.Object.create({ value: 2, title: 'group 2'}),
      SC.Object.create({ value: 3, title: 'group 3'})
    ],

    valueBinding: 'Geniverse.loginController.groupNumber',
    nameKey: 'title',
    valueKey: 'value'
  }),
  memberSelectView: SC.SelectFieldView.design({
    layout: { top: 65, left: 230, height: 25, width: 90 },
    objects: [ 
      SC.Object.create({ value: 1, title: 'member 1'}),
      SC.Object.create({ value: 2, title: 'member 2'}),
      SC.Object.create({ value: 3, title: 'member 3'})
    ],

    valueBinding: 'Geniverse.loginController.memberNumber',
    nameKey: 'title',
    valueKey: 'value'
  })
});
