// ==========================================================================
// Project:   Lab.LOGIN
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab Geniverse SHA256 */

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
  
  didBecomeFirstResponder: function() {
    // this.checkLoginState();
    SC.Logger.log("LOGIN");
  },
  
  willLoseFirstResponder: function() {
    // Called when this state loses first responder
  },
  
  // ..........................................................
  // EVENTS
  //
  
  checkLoginState: function() {
    // check cookies
    var username = Lab.userDefaults.readDefault('username');
    if (username !== undefined && username !== null && username.length > 0){
      SC.Logger.info("automatically logging in as %s", username);
      this.autoLogin(username);      // this will kick-off login
      return true;
    } else {
      // if no username cookie, make sure chatroom is also cleared
      Lab.userDefaults.writeDefault('chatroom', '');
    }
    
    // check portal here?
    
    return this.userLoggedIn;
  },
  
  login: function (){
    SC.Logger.log("LOGIN login!");
    var password = Lab.loginController.get('passwordValue');
    var passwordHash = SHA256(password);
    var self = this;
    var uname = Lab.loginController.username;
    var userFound = function(user) {
      if (typeof user == 'undefined') {
		    // no user exists for that username. create one
		    SC.Logger.info("No User exists for that login. Creating account.");
		    user = Geniverse.userController.createUser(uname, password);
		  }
      self.checkUserPassword(user, passwordHash);
    };
    
    Geniverse.userController.findUser(this.username, userFound);
    Lab.loginController.set('textAreaValue', '');
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
    Lab.userDefaults.writeDefault('username', user.get('username'));
    Geniverse.userController.set('content', user);
    Lab.loginController.set('loggedIn', YES);
    this.set('userLoggedIn', YES);
  }
  
}) ;
