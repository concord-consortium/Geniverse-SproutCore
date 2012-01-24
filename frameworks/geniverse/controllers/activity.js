// ==========================================================================
// Project:   Geniverse.activityController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse CcChat GenGWT SC*/

/** @class

  (Document Your Controller Here)
Gen
  @extends SC.Object
*/
Geniverse.activityController = SC.ObjectController.create(
/** @scope Geniverse.activityController.prototype */ {
  activity: null,
  activityTitle: null, // HACK: use the activity who's title matches this...o
  startActivity: function() {
    if (Geniverse.ENABLE_CHAT) {
      var chatroom = CcChat.chatRoomController.get('channel');

      if (this.get('sendBredDragons')){
        CcChat.chatController.subscribeToChannel(chatroom+'/org', this.receiveDragon);
      }
    }
  },
  
  // grab this from DB now, so it's around when we need it
  initCase: function() {
      var myCase = this.get('myCase');
      if (!!myCase) {
        var setIntroImageUrl = function() {
          myCase.removeObserver('status', this, setIntroImageUrl);
          SC.Logger.info("Setting intro screen url: ", myCase.get('introImageUrl'));
          Geniverse.introScreenController.set('imageUrl', myCase.get('introImageUrl'));
        };
        if (myCase.get('status') & SC.READY) {
          setIntroImageUrl();
        } else {
          myCase.addObserver('status', this, setIntroImageUrl);
        }
      } else {
        Geniverse.introScreenController.set('imageUrl', null);
      }
  }.observes('*content'),
  
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
  },
  
  getActivityList: function() {
    var myCase = this.get('myCase');
    if (myCase) {
      return myCase.get('activities');
    } else {
      return [];
    }
  },
  
  getNextActivity: function() {
    var activityList = this.getActivityList();
    if (activityList.get('length') < 2){
      return null;
    }
    
    var length = activityList.get('length');
    for (var i = 0; i < (length - 1); i++){
      if (activityList.objectAt(i) == this.get('content')){
        return activityList.objectAt(i+1);
      }
    }
    return null;
  },
  
  getPreviousActivity: function() {
    var activityList = this.getActivityList();
    if (activityList.get('length') < 2){
      return null;
    }
    
    var length = activityList.get('length');
    for (var i = 1; i < length; i++){
      if (activityList.objectAt(i) == this.get('content')){
        return activityList.objectAt(i-1);
      }
    }
    
    return null;
  },
  
  hiddenGenes: function() {
      return this.getHiddenOrStaticGenes('hiddenGenes');
  }.property('*content').cacheable(),
  
  staticGenes: function() {
    return this.getHiddenOrStaticGenes('staticGenes');
  }.property('*content').cacheable(),
  
  getHiddenOrStaticGenes: function(property, sex){
    var activity = this.get('content');
    if (!!activity) {
      
      var genes = "";
      var rawGenes = activity.get(property);
      if (!!rawGenes){
        var genesHash = eval("("+rawGenes+")");
        if (sex === 0){
          genes = genesHash.male;
        } else if (sex === 1){
          genes = genesHash.female;
        }
        
        if (!genes){
          genes = genesHash.all;
        }
      }
      
      if (!!genes){
        genes = genes.split(/,[ ]*/);
        
        // now we have an array such as ['h', 'a', 'd'],
        // but this won't cover "sister" alleles, such as 'a3', 'a5'
        // we want to make the array ['h', 'a', 'a3', 'a5', 'd', 'dl']
        
        // hard-code extras for now -- not DRY, but much more efficient than searching
        var extras = [];
        for (var i in genes){
          if (genes[i] === "a"){
            extras.push("a1", "a2");
          } else if (genes[i] === "d"){
            extras.push("dl");
          } else if (genes[i] === "m"){
            extras.push("mt");
          }
        }
        
        for (var j in extras){
          if (SC.typeOf(extras[j]) === SC.T_STRING){
            genes.push(extras[j]);
          }
        }
        
        return genes;
      } else {
        return [];
      }
    } else {
      return [];
    }
  },

  initStars: function() {
    var twoStars = this.get('thresholdTwoStars');
    var threeStars = this.get('thresholdThreeStars');
    if (typeof twoStars == 'number') {
      Geniverse.scoringController.set('twoStarThreshold', twoStars);
    } else {
      Geniverse.scoringController.set('twoStarThreshold', 2);
    }

    if (typeof threeStars == 'number') {
      Geniverse.scoringController.set('threeStarThreshold', threeStars);
    } else {
      Geniverse.scoringController.set('threeStarThreshold', 1);
    }

    Geniverse.scoringController.set('minimumScore', 0);
  }.observes('*content')

});
