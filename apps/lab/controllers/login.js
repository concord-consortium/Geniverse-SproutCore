// ==========================================================================
// Project:   Lab.loginController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab Geniverse SHA256 */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Lab.loginController = SC.ObjectController.create(
/** @scope Lab.loginController.prototype */ {

  // TODO: Add your own code here.
  
  textAreaValue: null,
  
  username: null,
  
  passwordValue: null,
  
  retypePasswordValue: null,
  
  usernameBinding: 'CcChat.chatController.username',
  
  showRetypeField: NO,
  
  loggedIn: NO,
  
  test: 35,
  
  groupNumber: 1,
  memberNumber: 1,

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
