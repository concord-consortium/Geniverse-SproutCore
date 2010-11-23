// ==========================================================================
// Project:   Lab.loginController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse SHA256 */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Lab.loginController = SC.ObjectController.create(
/** @scope Lab.loginController.prototype */ {

  // TODO: Add your own code here.
  
  textAreaValue: '',
  
  username: '',
  
  loggedIn: NO,
  
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
  }.property('groupNumber', 'memberNumber', 'username', 'loggedIn').cacheable()


}) ;
