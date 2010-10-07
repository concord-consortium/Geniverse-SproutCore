// ==========================================================================
// Project:   Geniverse.activityController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse CcChat GenGWT */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.activityController = SC.ObjectController.create(
/** @scope Geniverse.activityController.prototype */ {
  activity: null,
  activityTitle: null, // HACK: use the activity who's title matches this...o
  startActivity: function() {
    var chatroom = CcChat.chatRoomController.get('channel');
		
    if (this.get('sendBredDragons')){
      CcChat.chatController.subscribeToChannel(chatroom+'/org', this.receiveDragon);
    }
  },
  
  // converts a string in the form "[{m: 'a:h,b:h', f: 'a:H,b:H'}, {...}]" into
  // an array of initial alleles for rooms
  configurationAsArray: function(){
    // TODO rename this property in the model to configuration
    var initialAlleles = this.get('initialAlleles');
    
    // FIXME: JSON.parse(initialAlleles) doesn't work here. Don't know why.
    var initialAllelesAsArray = eval(initialAlleles);
    
    return initialAllelesAsArray;
  }.property("initialAlleles").cacheable(),
  
  getConfigurationForRoom: function (room){
    var configurationArray = this.get('configurationAsArray');
    if (!configurationArray){
      return [];
    }
    
    var roomConfig = configurationArray[room];
    if (roomConfig === undefined || roomConfig === null){
      SC.Logger.log("No alleles for room "+room);
      return "";
    }
    return roomConfig;
  }
}) ;
