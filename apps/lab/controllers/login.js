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
  textAreaValue: '',
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  loggedIn: NO,
  panel: null,
  groupNumber: 1,
  memberNumber: 1,
    
  welcomeMessage: function(){
    var welcomeMessage = "";
    var userName = this.get('firstName');
    if (this.get('loggedIn') == NO){
      return "Please wait ...";
    }
    var group = this.get('groupNumber');
    var member = this.get('memberNumber');
    welcomeMessage = "Welcome %@, you are member #%@ in group %@".fmt(userName, member, group);
    return welcomeMessage;
  }.property('groupNumber', 'memberNumber', 'username', 'firstName', 'loggedIn').cacheable(),

  
  showCheckPanel: function() {
    this.hidePanel();
    this.panel = Lab.LoginCheckView.create({
      layout: {top: 10, width: 400, height: 100, centerX: 0}
    });
    this.panel.append();
    //this.restoreGroupinfo();
    this.checkCCAuthToken();  
  },
 
  showGroupPanel: function() {
    this.hidePanel();
    this.panel = Lab.LoginGroupView.create({
      layout: {top: 10, width: 400, height: 100, centerX: 0}
    });
    this.panel.append();
    this.restoreGroupinfo();
  },
  
  showLoginPanel: function() {
    this.hidePanel();
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
 
  restoreGroupinfo: function() {
    var lastGroup = Lab.userDefaults.readDefault('groupNumber');
    var lastMember = Lab.userDefaults.readDefault('memberNumber');
    if (lastGroup) {
      Lab.loginController.set('groupNumber',lastGroup);
    }
    if (lastMember) {
      Lab.loginController.set('memberNumber',lastMember);
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
    return YES;
  },

  // logout from the portal
  logoutPortal: function() {
    var self = this;

    SC.Request.postUrl(self.logoutUrl,null).header({'Accept': 'application/json'}).json()
      .notify(self, 'logout')
      .send();
    var cc_auth_token = SC.Cookie.find('cc_auth_token');
    if (cc_auth_token) {
      cc_auth_token.destroy();
    }
    return YES;
  },

  didCCAuth: function(response) {
    SC.Logger.log(response);
    var self = this;
    if (SC.ok(response)) {
      // valid user
      SC.Logger.log(response.body());
      var login = response.get('body').login;
      var first = response.get('body').first;
      var  last = response.get('body').last;
      SC.Logger.log(login);
      var userFound = function(user) {
        self.set('firstName',first);
        self.set('lastName',last);
        self.set('username', login);
        Geniverse.userController.set('content',user);
      };
      Geniverse.userController.findOrCreateUser(login, userFound);
      self.login();
    }
    else {
      SC.Logger.log("FAILURE!");
      this.showLoginPanel();
    }
  },

  login: function (){
    SC.Logger.log("LOGIN: Authenticated.");
    this.set('loggedIn', YES);
    this.showGroupPanel();
  },
  
  logout: function() {
    self = this;
    SC.Logger.info("logging out %s", this.get('username'));
    this.set('username','');
    this.set('lastName','');
    this.set('firstName', '');
    this.set('loggedIn', NO);
    Lab.LOGIN.set('userLoggedIn', NO); 
    Lab.userDefaults.writeDefault('username', '');
    Lab.userDefaults.writeDefault('password', '');
    Lab.userDefaults.writeDefault('chatroom', '');
    Lab.makeFirstResponder(Lab.LOGIN);
    Lab.LOGIN.addObserver('userLoggedIn', Lab.ACTIVITY, 'gotoActivity');
  },


  finish: function() {
    this.hidePanel();
    var user = Geniverse.userController.get('content');
    CcChat.chatController.set('username', user.get('username'));
    Lab.userDefaults.writeDefault('username', user.get('username'));
    Lab.userDefaults.writeDefault('groupNumber',Lab.loginController.get('groupNumber')); 
    Lab.userDefaults.writeDefault('memberNumber',Lab.loginController.get('memberNumber'));
    this.set('loggedIn', YES);
    Lab.LOGIN.finish();
  }



}) ;
