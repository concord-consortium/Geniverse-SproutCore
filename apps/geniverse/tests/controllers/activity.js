// ==========================================================================
// Project:   Geniverse.appController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse module test ok equals same stop start */

module("Geniverse.articleController");

// TODO: Replace with real unit test for Geniverse.articleController
test("test conversion of initial alleles to array", function() {
  SC.run(function() {
    var activity = Geniverse.store.createRecord(Geniverse.Activity, 
      {initialAlleles: "[ [{alleles: 'a:h,b:h', sex: 0, name: 'father'}, {alleles: 'a:H,b:H', sex: 1, name: 'mother'}], [{alleles: 'a:H,b:h', sex: 0}, {alleles: 'a:h,b:H', sex: 1}] ]"}
    );
    Geniverse.activityController.set('content', activity);
  });
  
  var array = Geniverse.activityController.get('configurationAsArray');
  
  equals(array.length, 2, "there should be two items in the initial alleles array");
  
  var allelesForRoomOne = Geniverse.activityController.getConfigurationForRoom(0);
  var allelesForRoomTwo = Geniverse.activityController.getConfigurationForRoom(1);
  
  var allelesForRoomOneMale;
  var allelesForRoomTwoFemale;
  
  for (var i = 0; i < allelesForRoomOne.length; i++) {
    if (allelesForRoomOne[i].sex === 0) {
      allelesForRoomOneMale = allelesForRoomOne[i];
    }
    if (allelesForRoomTwo[i].sex === 1) {
      allelesForRoomTwoFemale = allelesForRoomTwo[i];
    }
  }
  
  equals(allelesForRoomOneMale, 'a:h,b:h', "Room one male should be 'a:h,b:h'");
  equals(allelesForRoomTwoFemale, 'a:h,b:H', "Room two female should be 'a:h,b:H'");
});

