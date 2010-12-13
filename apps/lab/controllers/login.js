// ==========================================================================
// Project:   Lab.loginController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse SHA256 */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
sc_require('views/login');
Lab.loginController = SC.ObjectController.create(
/** @scope Lab.loginController.prototype */ {

  // TODO: Add your own code here.
  checkTokenUrl: '/portal/verify_cc_token',
  loginUrl: '/portal/remote_login',
  logoutUrl: '/portal/remote_logout',
  username: '',
  password: '',
  loggedIn: NO,
  triedPortal: NO,
  panel: null,
  welcomeMessage: 'please wait ...', 
  
  showCheckPanel: function() {
    this.hidePanel();
    this.panel = Lab.LoginCheckView.create({
      layout: {top: 10, width: 400, height: 100, centerX: 0}
    });
    this.panel.append();
    this.checkCCAuthToken();  
  },
 
  showGroupPanel: function() {
    this.hidePanel();
    this.panel = Lab.LoginGroupView.create({
      layout: {top: 10, width: 400, height: 100, centerX: 0}
    });
    this.panel.append();
  },
  
  showLoginPanel: function() {
    this.hidePanel();
    this.set('welcomeMessage','please log in');
    if (this.triedPortal) {
      this.set('welcomeMessage','invalid login. try again.');
    }
    this.panel = Lab.LoginLoginView.create({
      layout: {top: 10, width: 400, height: 100, centerX: 0}
    });
    this.panel.append();
  },
  

  hidePanel: function() {
    if(this.panel) {
      this.panel.remove();
      this.panel = null;
    }
  },
 
  // ask the portal if this user is logged in 
  checkCCAuthToken: function() {
    var checkTokenUrl = this.checkTokenUrl;
    SC.Request.getUrl(checkTokenUrl).header({'Accept': 'application/json'}).json()
        .notify(this, 'didCCAuth')
        .send();
      return YES;
  },

  // loginPortal
  loginPortal: function() {
    var self = this;
    var loginUrl = this.loginUrl;
    var usename = this.get('username');
    var password = this.get('password');
    var body = {
      login: usename,
      password: password
    };
    // TODO: Default portal authentication does not use hash!
    // send over https!
    SC.Request.postUrl(loginUrl,body).header({'Accept': 'application/json'}).json()
        .notify(self, 'checkCCAuthToken')
        .send();
    this.triedPortal = YES;
    return YES;
  },

  // logout from the portal
  logoutPortal: function() {
    SC.Request.postUrl(this.logoutUrl,null).header({'Accept': 'application/json'}).json()
      .notify(this, 'logout')
      .send();
    var cc_auth_token = SC.Cookie.find('cc_auth_token');
    if (cc_auth_token) {
      cc_auth_token.destroy();
    }
    this.triedPortal = NO;
    return YES;
  },

  didCCAuth: function(response) {
    SC.Logger.log(response);
    if (SC.ok(response)) {
      // valid user
      SC.Logger.log(response.body());
      var login = response.get('body').login;
      var first = response.get('body').first;
      var last = response.get('body').last;
      var self = this;
      SC.Logger.log(login);
      var userFound = function(user) {
        user.set('firstName',first);
        user.set('lastName',last);
        Geniverse.store.commitRecords();
        Geniverse.userController.set('content',user);
        Geniverse.userController.doWhenReady(self,user,self.didAuthenticate);
      };
      Geniverse.userController.findOrCreateUser(login, userFound);
    }
    else {
      SC.Logger.log("Login failure..");
      this.showLoginPanel();
    }
  },

  didAuthenticate: function (){
    SC.Logger.log("LOGIN: Authenticated.");
    this.set('loggedIn', YES);
    var user = Geniverse.userController.get('content');
    if (user) {
      this.finish();
    }
    else {
      this.showGroupPanel();
    }
  },
  
  logout: function() {
    self = this;
    SC.Logger.info("logging out %s", this.get('username'));
    this.set('username','');
    this.set('lastName','');
    this.set('firstName', '');
    this.set('password', '');
    this.set('loggedIn', NO);
    Lab.LOGIN.set('userLoggedIn', NO); 
    Lab.userDefaults.writeDefault('username', '');
    Lab.userDefaults.writeDefault('password', '');
    Lab.userDefaults.writeDefault('chatroom', '');
    Lab.makeFirstResponder(Lab.LOGIN);
    Lab.LOGIN.addObserver('userLoggedIn', Lab.ACTIVITY, 'gotoActivity');
  },

  updateGroupInfo: function() {
    var user = Geniverse.userController.get('content');
    if (user) {
      //user.set('groupId',this.get('groupId'));
      //user.set('memberId',this.get('memberId'));
      Geniverse.store.commitRecords();
    }
    else {
      SC.Logger.log("probably an error condition -- no user when updateing groups"); 
    }
  },

  finish: function() {
    var user = Geniverse.userController.get('content');
    var member = user.get('memberId');
    var group = user.get('groupId');
    var userName = user.get('firstName');
    this.hidePanel();
    this.set('welcomeMessage',"Welcome %@, you are member #%@ in group %@".fmt(userName, member, group));
    Lab.infoController.display("<div><h2>"+this.get('welcomeMessage')+"</h2></div>");
    CcChat.chatController.set('username', user.get('username'));
    Lab.userDefaults.writeDefault('username', user.get('username'));
    this.updateGroupInfo();
    this.set('loggedIn', YES);
    Lab.LOGIN.finish();
  }
}) ;
