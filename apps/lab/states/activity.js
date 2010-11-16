// ==========================================================================
// Project:   Lab.ACTIVITY
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Lab window*/

/** @class

  (Document Your State Here)

  @extends SC.Responder
  @version 0.1
*/
Lab.ACTIVITY = SC.Responder.create(
/** @scope Lab.DEFAULT.prototype */ {

  strand: null,
  level: null,
  activityType: null,
  activityIndex: null,
  
  /**
    The next state to check if this state does not implement the action.
  */
  nextResponder: null,
  
  didBecomeFirstResponder: function() {
    SC.Logger.log("ACTIVITY");
  },
  
  willLoseFirstResponder: function() {
    // Called when this state loses first responder
    // SC.Logger.info("Now removing default page");
    // Lab.getPath('trainingPage.mainPane').remove() ;
  },
  
  // ..........................................................
  // EVENTS
  //
  
  gotoActivity: function() {
    Lab.makeFirstResponder(this);
    
    var strand = this.get('strand');
    var level = this.get('level');
    var activityType = this.get('activityType');
    var activityIndex = this.get('activityIndex');
    
    SC.Logger.log("ACTIVITY gotoActivity: "+strand+"/"+level+"/"+activityType+"/"+activityIndex);
    
    switch(strand) {
      case 'heredity':
        switch (level) {
          case 'training':
            Lab.routes.gotoLabRoute({pageName: 'chromosomeTrainingPage'});
            break;
          case 'apprentice':
            switch (activityType) {
              case 'intro':
                Lab.routes.gotoLabRoute({pageName: 'breedingPage'});
                break;
              case 'individual':
                Lab.routes.gotoLabRoute({pageName: 'breedingPagePaper'});
                break;
              case 'group':
                Lab.routes.gotoLabRoute({pageName: 'breedingPageGroup'});
                break;
            }
            break;
        }
        break;
    }
  },
  
  logout: function() {
    SC.Logger.info("logging out %s", CcChat.chatController.get('username'));
    
    CcChat.chatController.set('username', '');
    Lab.LOGIN.set('userLoggedIn', NO);
    
    Lab.userDefaults.writeDefault('username', '');
    Lab.userDefaults.writeDefault('chatroom', '');
    
    Lab.makeFirstResponder(Lab.START);
    
    SC.routes.set('location', '');
    window.location.reload();
  }
  
}) ;
