// ==========================================================================
// Project:   Geniverse.dragonChattingController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse CcChat GenGWT*/

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.dragonChattingController = SC.Controller.create(
/** @scope Geniverse.dragonChattingController.prototype */ {

  sendBredDragonsAction: function() {
    if (Geniverse.activityController.get('sendBredDragons')){
      var latestChild = Geniverse.breedDragonController.get('child');
      var message = {dragon: latestChild.get('gOrganism')};
      // SC.Logger.log("sending "+message.dragon);
      var orgChannel = CcChat.chatRoomController.get('channel')+'/org';
      CcChat.chatController.post(orgChannel, message);
    }
  }.observes('Geniverse.breedDragonController.child'),
  
  sendDragon: function(dragon){
    var message = {dragon: dragon};
    var orgChannel = CcChat.chatRoomController.get('channel')+'/org';
    // SC.Logger.log("sending dragon on "+orgChannel+": "+dragon);
    CcChat.chatController.post(orgChannel, message);
  },
  
  chatDragon: function(dragon){
    if (dragon !== undefined && dragon !== null){
      var dragonImageUrl = dragon.get('imageURL');
      var jsonDragon = {dragon: dragon.get('gOrganism'), imageUrl: dragonImageUrl, guid: dragon.get('id')};
      CcChat.chatComposeController.set('item', jsonDragon);
      CcChat.chatComposeController.set('clearButtonTitle', 'Remove Dragon');
    }
    
  },
  
  clearDragon: function() {
    CcChat.chatComposeController.set('item', []);
    this.set('showClearButton', NO);
  },
  
  receiveDragon: function(message) {
    this.createNewDragonFromChat(message.dragon);
  },
  
  receiveDragonFromChat: function() {
    var latestChat = CcChat.chatController.get('latestChat');
    var item = latestChat.get('item');
    if (item !== null && item.dragon !== undefined && item.dragon !== null){
      this.createNewDragonFromChat(item.dragon);
    }
  }.observes('CcChat.chatController.latestChat'),
  
  createNewDragonFromChat: function(jsonData,callback) {
    var guid = jsonData.guid;
    var user = Geniverse.userController.get('content');
    var jsonDragon = jsonData.dragon;
    var dragon = Geniverse.store.find(Geniverse.Dragon,guid);
    var dragonReady = function() {
      if (dragon.get('status') & SC.Record.READY === SC.Record.READY) {
        SC.Logger.info("dragon ready.");
        dragon.removeObserver('status', dragonReady);
        dragon.set('user',user);
        dragon.set('gOrganism',GenGWT.createDragon(jsonDragon));
        callback(dragon);
      } else { SC.Logger.info("dragon not ready."); }
    };
    
    if (dragon.get('status') & SC.Record.READY === SC.Record.READY) {
      dragonReady();
    } else {
      SC.Logger.log('adding dragons observer');
      dragon.addObserver('status', dragonReady);
    }

    //var dragon = Geniverse.store.createRecord(Geniverse.Dragon, {
    //bred: NO, sent: YES
    //});
    //var gOrg = GenGWT.createDragon(jsonDragon);
    //dragon.set('gOrganism', gOrg);
    //var user = Geniverse.userController.get('content');
    //dragon.set('user',user);
    ////Geniverse.store.commitRecords();
    //return dragon;
  }

}) ;
