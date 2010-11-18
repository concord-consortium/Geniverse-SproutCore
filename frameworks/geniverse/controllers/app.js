// ==========================================================================
// Project:   Geniverse.appController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse CcChat */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.appController = SC.ObjectController.create(
/** @scope Geniverse.appController.prototype */ {

  userLoggedIn: NO,
  
  loginView: null,
  mainPane:  null,
  containerView: null,
  mainAppView: null,
  // 
  // checkLoginState: function() {
  //   var containerView = this.get('mainPane').get('appContainer');
  //   if (containerView === undefined || containerView === null){
  //     return;
  //   }
  //   this.mainAppView = containerView.get('mainAppView');
  //   this.loginView = containerView.get('loginView');
  //  
  //   var username = Geniverse.userDefaults.readDefault('username');
  //   if (username !== undefined && username !== null && username.length > 0){
  //     SC.Logger.info("automatically logging in as %s", username);
  //     Geniverse.loginController.autoLogin(username);      // this will kick-off login
  //   } else {
  //     SC.RunLoop.begin();
  //     Geniverse.userDefaults.writeDefault('chatroom', '');  // if no username, make sure room is also cleared
  //     containerView.set('nowShowing', this.loginView);
  //     SC.RunLoop.end();
  //   }
  // },
  // 
  // login: function() {
  //   
  //   var username = Geniverse.userController.get('username');
  //   if (username === ""){
  //     return;
  //   }
  //   var group = Geniverse.loginController.get('groupNumber');
  //   Geniverse.userDefaults.writeDefault('username', username);
  //   Geniverse.userDefaults.writeDefault('groupNumber',group); 
  //   function initChat(chatroom){
  //     CcChat.chatController.set('username', username);
  //     
  //     CcChat.chatController.initChat(chatroom);
  //     
  //     Geniverse.userDefaults.writeDefault('chatroom', chatroom);
  //     SC.Logger.info("logged into %s",chatroom);
  //     
  //     Geniverse.activityController.startActivity();
  //   }
  //   
  //   var activityChannel = Geniverse.activityController.get('baseChannelName');
  //   var groupChannel = activityChannel+"-"+group;
  //   SC.Logger.info("Logging into group chan: '%s'",groupChannel);
  //   initChat(groupChannel);
  //   //var savedChatroom = Geniverse.userDefaults.readDefault('chatroom');
  //   //if (savedChatroom !== undefined && savedChatroom !== null && 
  //     //savedChatroom.length > 0 && savedChatroom.indexOf(activityChannel) >= 0){
  //     //SC.Logger.info("auto-logging into "+savedChatroom);
  //     //initChat(savedChatroom);
  //     //Geniverse.activityController.startActivity();
  //   //} else {
  //     //var maxUsers = Geniverse.activityController.get('maxUsersInRoom');
  //     //CcChat.chatRoomController.getFirstChannelWithSpace(activityChannel, maxUsers, initChat);
  //   //}
  //   
  //   SC.Logger.info("setting userLoggedIn");
  //   this.set('userLoggedIn', YES);
  //   
  //   var containerView = this.get('mainPane').get('appContainer');
  //   
  //   SC.RunLoop.begin();
  //   containerView.set('nowShowing', this.mainAppView);
  //   SC.RunLoop.end();
  //   
  // }.observes('Geniverse.userController.username'),
  // 
  // logout: function() {
  //   SC.Logger.info("logging out %s", CcChat.chatController.get('username'));
  //   
  //   CcChat.chatController.set('username', '');
  //   this.set('userLoggedIn', NO);
  //   
  //   Geniverse.userDefaults.writeDefault('username', '');
  //   Geniverse.userDefaults.writeDefault('chatroom', '');
  //   
  //   var containerView = this.get('mainPane').get('appContainer');
  //   
  //   SC.RunLoop.begin();
  //   containerView.set('nowShowing', this.loginView);
  //   SC.RunLoop.end();
  //   
  //   window.location.reload();
  // }
 
  

}) ;
