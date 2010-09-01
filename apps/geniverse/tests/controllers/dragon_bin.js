// ==========================================================================
// Project:   Geniverse.dragonBinController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse module test ok equals same stop start */

module("Geniverse.dragonBinController");

// TODO: Replace with real unit test for Geniverse.dragonBinController
test("test adding to and clearing dragon bin", function() {
  var dragon;
  SC.run(function() {
    dragon = Geniverse.store.createRecord(Geniverse.Dragon, {
      bred: NO, sent: NO
    });
  });
  
  equals(Geniverse.dragonBinController.get('isEmpty'), true, "Dragon bin starts empty");
  
  var dragonArray = [];
  
  Geniverse.dragonBinController.set('content', dragonArray);
  
  equals(Geniverse.dragonBinController.get('isEmpty'), true, "Dragon bin is empty after empty array is added");
  
  var dragonArray2 = [];
  dragonArray2.push(dragon);
  Geniverse.dragonBinController.set('content', dragonArray2);
  
  equals(Geniverse.dragonBinController.get('isEmpty'), false, "Dragon bin is not empty after a dragon is added");
  
  Geniverse.dragonBinController.clearDragons();
  
  equals(Geniverse.dragonBinController.get('isEmpty'), true, "Dragon bin returns to empty after it is cleared");
});
