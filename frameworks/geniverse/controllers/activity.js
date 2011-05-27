// ==========================================================================
// Project:   Geniverse.activityController
// Copyright: ©2010 Concord Consortium
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
  getConfigurationAsArray: function(isMatchingDragons){
    // TODO rename this property in the model to configuration
    var initialAlleles = isMatchingDragons ? this.get('matchDragonAlleles') : this.get('initialAlleles');
    
    // FIXME: JSON.parse(initialAlleles) doesn't work here. Don't know why.
    var initialAllelesAsArray = eval(initialAlleles);
    
    return initialAllelesAsArray;
  },
  
  getConfigurationForRoom: function (room, isMatchingDragons){
    var configurationArray = this.getConfigurationAsArray(isMatchingDragons);
    if (!configurationArray){
      SC.Logger.log("No alleles for room "+room);
      return [];
    }
    var length = configurationArray.length;
    if (length === undefined || length < 1) {
      SC.Logger.log("No alleles for room "+room);
      return [];
    }
    var room_index = room % length;
    var roomConfig = configurationArray[room_index];
    if (roomConfig === undefined || roomConfig === null){
      SC.Logger.log("No alleles for room "+room);
      return [];
    }
    return roomConfig;
  },

  //  [ rooms [users [alleles ] ] ]
  getConfigurationForRoomMember: function(room, member, isMatchingDragons) {
    var roomConfig = Geniverse.activityController.getConfigurationForRoom(room, isMatchingDragons);
    if (!roomConfig || roomConfig.length < 1){
      SC.Logger.info("No room config for room", room);
      return [];
    }
    var members = roomConfig;
    // if the first item is an Allelle, return the full set, but warn
    if (!!members[0].alleles) {
      SC.Logger.warn("Room Configuration only has one set of starter Alleles in it..");
      return roomConfig;  // EG everyone in the room shares a config set
    }
    var member_index = member % members.length;
    return members[member_index];
  }
  
});
