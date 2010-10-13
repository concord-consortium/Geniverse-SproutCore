// ==========================================================================
// Project:   Geniverse.appController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse module test ok equals same stop start */

module("Geniverse.activityController");

// TODO: Replace with real unit test for Geniverse.activityController
test("test conversion of initial alleles to array", function() {
  SC.Store.create().from(SC.Record.fixtures);
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
      allelesForRoomOneMale = allelesForRoomOne[i].alleles;
    }
    if (allelesForRoomTwo[i].sex === 1) {
      allelesForRoomTwoFemale = allelesForRoomTwo[i].alleles;
    }
  }
  
  equals(allelesForRoomOneMale, 'a:h,b:h', "Room one male should be 'a:h,b:h'");
  equals(allelesForRoomTwoFemale, 'a:h,b:H', "Room two female should be 'a:h,b:H'");
});

test("test getConfigurationForRoomMember ", function() {
  SC.Store.create().from(SC.Record.fixtures);
  SC.run(function() {
    var config = 
    [
      [
        [
          {alleles: 'a:h,b:h', sex: 0, name: 'father1'},
          {alleles: 'a:h,b:h', sex: 0, name: 'father2'},
          {alleles: 'a:h,b:h', sex: 0, name: 'father3'},
          {alleles: 'a:h,b:h', sex: 0, name: 'father4'}
        ],
        [
          {alleles: 'a:h,b:h', sex: 1, name: 'mother1'},
          {alleles: 'a:h,b:h', sex: 1, name: 'mother2'},
          {alleles: 'a:h,b:h', sex: 1, name: 'mother3'},
          {alleles: 'a:h,b:h', sex: 1, name: 'mother4'}
        ]
      ],
      [
        [
          {alleles: 'a:h,b:h', sex: 0, name: 'pop1'},
          {alleles: 'a:h,b:h', sex: 0, name: 'pop2'},
          {alleles: 'a:h,b:h', sex: 0, name: 'pop3'},
          {alleles: 'a:h,b:h', sex: 0, name: 'pop4'}
        ],
        [
          {alleles: 'a:h,b:h', sex: 1, name: 'mom1'},
          {alleles: 'a:h,b:h', sex: 1, name: 'mom2'},
          {alleles: 'a:h,b:h', sex: 1, name: 'mom3'},
          {alleles: 'a:h,b:h', sex: 1, name: 'mom4'}
        ]
      ]
    ];

    var activity = Geniverse.store.createRecord(Geniverse.Activity, 
      {initialAlleles: JSON.stringify(config)}
    );
    Geniverse.activityController.set('content', activity);
  });
  
  var testFunc = Geniverse.activityController.getConfigurationForRoomMember;
  
  equals(testFunc(0,0)[0].name, 'father1', "group 0 memeber 0 first dragon should be named father'");
  equals(testFunc(0,1)[0].name, 'mother1', "group 0 memeber 1 first dragon should be named mother'");
  equals(testFunc(1,0)[0].name, 'pop1',    "group 1 memeber 0 first dragon should be named father'");

  // test modulus wrapping of configuration selection.
  equals(testFunc(2,0)[0].name, 'father1', "group 2 (virtual) memeber 0 first dragon should be named father'");
  equals(testFunc(0,3)[0].name, 'mother1', "group 0 member 3 (virtual) first dragon should be named mother'");

});

