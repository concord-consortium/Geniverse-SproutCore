// ==========================================================================
// Project:   Geniverse.loginController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse SHA256*/

/** @class

  This view currently does nothing but set the 'username' property on
  chatController. However, it can be used by other views that want to
  hook into the login process. For instance, if the students start out
  seeing a login field, a controller can be watching the username property
  on chatController and, once it is set, log in and start up the application.

  @extends SC.Object
*/
Geniverse.loginController = SC.ObjectController.create(
/** @scope CcChat.loginController.prototype */ {

  // TODO: Add your own code here.
  
  textAreaValue: null,
  
  username: null,
  
  passwordValue: null,
  
  retypePasswordValue: null,
  
  usernameBinding: 'CcChat.chatController.username',
  
  showRetypeField: NO,
  
  loggedIn: NO,
  
  test: 35,
  
  groupNumber: 2,
  memberNumber: 2,

  login: function (){
    SC.Logger.log("login");
    var password = this.get('passwordValue');
    var passwordHash = SHA256(password);
    var self = this;
    var uname = this.username;
    var userFound = function(user) {
      if (typeof user == 'undefined') {
		    // no user exists for that username. create one
		    SC.Logger.info("No User exists for that login. Creating account.");
		    user = Geniverse.userController.createUser(uname, password);
		  }
      self.checkUserPassword(user, passwordHash);
    };
    
    Geniverse.userController.findUser(this.username, userFound);
    this.set('textAreaValue', '');
  },
  
  autoLogin: function(username) {
    var self = this;
    
    var userFound = function(user) {
      if (typeof user == 'undefined') {
		    // no user exists for that username
		    SC.Logger.info("No User exists for that login. Please log in again.");
		    Geniverse.appController.logout();
		  } else {
		    self.finishLogin(user);
		  }
    };
    
    Geniverse.userController.findUser(username, userFound);
  },
  
  checkUserPassword: function(user, passwordHash) {
    var username = user.username;
    var rails_password_hash = user.get('passwordHash');
    SC.Logger.log("hash from rails = "+rails_password_hash);
    SC.Logger.log("hash from user = "+passwordHash);
    if (rails_password_hash === passwordHash){
      SC.Logger.log("passwords match!");
      this.finishLogin(user);
    } else {
      alert("Passwords do not match");
    }
  },
  
  finishLogin: function(user) {
    Geniverse.userController.set('content', user);
    Geniverse.loginController.set('loggedIn', YES);
  },

  welcomeMessage: function(){
    var welcomeMessage = "[Not set]";
    var user = this.get('username');
    var group = this.get('groupNumber');
    var member = this.get('memberNumber');
    welcomeMessage = "Welcome %@, you are user #%@ in group %@".fmt(user, member, group);
    //SC.Logger.log("returning %@", welcomeMessage);
    return welcomeMessage;
  }.property('groupNumber', 'memberNumber', 'username').cacheable()
 

}) ;
