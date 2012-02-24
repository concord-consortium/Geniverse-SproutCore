// ==========================================================================
// Project:   Lab.loginController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse SHA256 sc_require CcChat*/

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Lab.loginController = SC.ObjectController.create(
/** @scope Lab.loginController.prototype */ {
  
  defaultResponder: 'Lab.statechart',

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

  autoLogin: function(first_name, last_name, username) {
    var fake_response = SC.Object.create({
      body: {
        login: username,
        first: first_name,
        last: last_name,
        class_words: []
      }
    });
    this.triedPortal = YES;
    this.didCCAuth(fake_response);
  },

  didCCAuth: function(response) {
    SC.Logger.log(response);
    if (SC.ok(response)) {
      // valid user
      SC.Logger.log(response.get('body'));
      var login = response.get('body').login;
      var first = response.get('body').first;
      var last = response.get('body').last;
      var self = this;
      SC.Logger.log(login);
      var userFound = function(user) {
        user.set('firstName',first);
        user.set('lastName',last);
        var classWords = response.get('body').class_words;
        if (classWords && classWords.length > 0){
          user.set('className', classWords[0]);           // for now, we assume student is only in one class on portal
        } else {
          user.set('className', "no_class");
        }
        Geniverse.store.commitRecords();
        Geniverse.userController.set('content',user);
        Geniverse.userController.doWhenReady(self,user,self.didAuthenticate);
      };
      Geniverse.userController.findOrCreateUser(login, userFound);
    }
    else {
      SC.Logger.log("Login failure.");
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
    this.set('triedPortal', false);
    
    var cc_auth_token = SC.Cookie.find('cc_auth_token');
    if (cc_auth_token) {
      cc_auth_token.destroy();
    }
    
    var self = this;
    SC.Logger.info("logging out %s", this.get('username'));
    this.set('username','');
    this.set('lastName','');
    this.set('firstName', '');
    this.set('password', '');
    this.set('loggedIn', NO);
    
    Lab.userDefaults.writeDefault('username', '');
    Lab.userDefaults.writeDefault('password', '');
    Lab.userDefaults.writeDefault('chatroom', '');
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
    this.set('lastGroupId', group);
    this.set('lastMemberId', member);
    //Lab.infoController.displayButtonOnly("<div><h2>"+this.get('welcomeMessage')+"</h2></div>");
    // CcChat.chatController.set('username', user.get('username'));
    Lab.ACTIVITY.initChatChannels();
    Lab.userDefaults.writeDefault('username', user.get('username'));
    this.updateGroupInfo();
    this.set('loggedIn', YES);
    
    Lab.statechart.sendAction('logIn');
  },
  
  lastGroupId: -1,
  lastMemberId: -1,
  
  loadTimer: null,
  setupTimer: function(array, callback) {
	  if (this.get('loadTimer') !== null) {
	    this.get('loadTimer').invalidate();
    }
    
    this.set('loadTimer', SC.Timer.schedule({
      target: this,
      action: function() {
        function isReady(item, index){
          return ((item.get('status') & SC.Record.READY) === SC.Record.READY);
        }
        if (array.every(isReady)) {
          this.get('loadTimer').invalidate();
          callback();
        }
      },
      interval: 500,
      repeats: YES
    }));
	},
  
  groupInfoDidUpdate: function() {
    var self = this;
    if ((Geniverse.userController.get('groupId') != this.get('lastGroupId') || 
        Geniverse.userController.get('memberId') != this.get('lastMemberId')) &&
        Lab.ACTIVITY.get('hasLoadedActivityData')){
      SC.Logger.log("reloading data after group change");
      Lab.ACTIVITY.set('hasLoadedActivityData', NO);
      
      var user = Geniverse.userController.get('content');
      var challengeDragons = Geniverse.challengePoolController.get('arrangedObjects');
      var watchDragonsArray = [];
      challengeDragons.forEach(function(item){
        watchDragonsArray.push(item);
      });
      
      function sellAndReload(){
        if ((user.get('status') & SC.Record.READY) === SC.Record.READY) {
          user.removeObserver('status', sellAndReload);
          Lab.ACTIVITY.sellAllUsersDrakes();
          
          Geniverse.store.commitRecords();
          
          
          function reload(){
            if ((challengeDragons.get('status') & SC.Record.READY) === SC.Record.READY) {
              challengeDragons.removeObserver('status', reload);
              Lab.ACTIVITY.reloadData();
            }
          }
          self.setupTimer(watchDragonsArray, reload);
          
          
          // if ((challengeDragons.get('status') & SC.Record.READY) === SC.Record.READY) {
          //             reload();
          //           } else {
          //             SC.Logger.log("challengeDragons.get('status') = "+challengeDragons.get('status'))
          //             challengeDragons.addObserver('status', reload);
          //           }
        }
      }
      
      if ((user.get('status') & SC.Record.READY) === SC.Record.READY) {
        sellAndReload();
      } else {
        user.addObserver('status', sellAndReload);
      }
        
        
        
      this.set('lastGroupId', Geniverse.userController.get('groupId'));
      this.set('lastMemberId', Geniverse.userController.get('memberId'));
    }
  }.observes('Geniverse.userController.memberId', 'Geniverse.userController.groupId')
}) ;
