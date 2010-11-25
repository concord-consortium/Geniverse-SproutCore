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
  
  textAreaValue: '',
  username: '',
  loggedIn: NO,
  panel: null, 
  groupNumber: 1,
  memberNumber: 1,
    
  welcomeMessage: function(){
    var welcomeMessage = "";
    var user = this.get('username');
    if (this.get('loggedIn') == NO){
      return "Please wait ...";
    }
    var group = this.get('groupNumber');
    var member = this.get('memberNumber');
    welcomeMessage = "Welcome %@, you are member #%@ in group %@".fmt(user, member, group);
    return welcomeMessage;
  }.property('groupNumber', 'memberNumber', 'username', 'loggedIn').cacheable(),

  
  showCheckPanel: function() {
    this.hidePanel();
    this.panel = Lab.LoginCheckView.create({
      layout: {top: 10, width: 400, height: 100, centerX: 0}
    });
    this.panel.append();
    //this.restoreGroupinfo();
    this.checkCCAutToken();  
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
      var login = response.get('body').login;
      SC.Logger.log(login);
      var userFound = function(user) {
        Lab.loginController.set('username', login);
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
