// ==========================================================================
// Project:   Lab.LOGIN
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat SHA256 */

/** @class

  (Document Your State Here)

  @extends SC.Responder
  @version 0.1
*/
Lab.LOGIN = SC.Responder.create(
/** @scope Lab.DEFAULT.prototype */ {

  /**
    The next state to check if this state does not implement the action.
  */
  nextResponder: null,
  
  userLoggedIn: NO,
  loginPanel: null, 
  didBecomeFirstResponder: function() {
    var lastGroup = Lab.userDefaults.readDefault('groupNumber');
    var lastMember = Lab.userDefaults.readDefault('memberNumber');
    if (lastGroup) {
      Lab.loginController.set('groupNumber',lastGroup);
    }
    if (lastMember) {
      Lab.loginController.set('memberNumber',lastMember);
    }
    // this.checkLoginState();
    this.showLoginPanel();
    this.checkCCAutToken();
    SC.Logger.log("LOGIN");
  },

  willLoseFirstResponder: function() {
    // Called when this state loses first responder
  },
  
  showLoginPanel: function() {
    this.loginPanel = SC.PanelPane.create({
      layout: { width: 400, height: 100, centerX: 0, top: 20 },
      contentView: Lab.LoginView.extend({
      })
    }).append();
  },

  hideLoginPanel: function() {
    if(this.loginPanel) {
      this.loginPanel.remove();
      this.loginPanel = null;
    }
  },
  // ..........................................................
  // EVENTS
  //
  
  
  login: function (){
    SC.Logger.log("LOGIN: Authenticated.");
    Lab.loginController.set('loggedIn', YES);
  },
  
  // ask the portal if this user is logged in 
  checkCCAutToken: function() {
    SC.Request.getUrl('/portal/verify_cc_token').header({'Accept': 'application/json'}).json()
        .notify(this, 'didCCAuth')
        .send();
      return YES;
  },

  didCCAuth: function(response) {
    SC.Logger.log(response);
    var self = this;
    if (SC.ok(response)) {
      // valid user
      SC.Logger.log(response.body());
      login = response.get('body').login;
      SC.Logger.log(login);
      var userFound = function(user) {
        Lab.loginController.set('username', login);
        Geniverse.userController.set('content',user);
      };
      Geniverse.userController.findOrCreateUser(login, userFound);
      self.login();
    }
    else {
      Lab.loginController.set('username', "BAD AUTH_TOKEN");
      Lab.loginController.set('showSignupScreen');
      Lab.routes.gotoLabRoute({pageName: 'signUp'});
      // send to back to login screen
    }
  },
  
  start: function() {
    var user = Geniverse.userController.get('content');
    SC.Logger.log("starting up");
    Lab.userDefaults.writeDefault('username', user.get('username'));
    Lab.userDefaults.writeDefault('groupNumber',Lab.loginController.get('groupNumber')); 
    Lab.userDefaults.writeDefault('memberNumber',Lab.loginController.get('memberNumber'));
    
    CcChat.chatController.set('username', user.get('username'));
    Lab.loginController.set('loggedIn', YES);
    
    this.set('userLoggedIn', YES);
    this.hideLoginPanel();
  }
}) ;
