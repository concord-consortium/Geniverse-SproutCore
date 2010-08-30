// ==========================================================================
// Project:   Geniverse.breedDragonController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse module test ok equals same stop start */

module("Geniverse.breedDragonController");

function checkGWTReadiness() {
  if (Geniverse.gwtController.get('isReady')) {
    Geniverse.gwtController.removeObserver('isReady', window, checkGWTReadiness);
    Geniverse.set('isLoaded', YES);
    runTest();
  }
}

function runTest() {
  SC.RunLoop.begin();
  var controller = Geniverse.breedDragonController;
  controller.initParents();
  controller.invokeLast(run2);
  SC.RunLoop.end();
}

function run2() {
  start();
  Geniverse.breedDragonController.breed();
  SC.Logger.log('2222');
  SC.Logger.log('3333');
  var eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
  SC.Logger.log('#eggs = ' + eggs.get('length'));
  equals(eggs.get('length'), 20, "breed() breeds 20 dragons at a time");
  SC.Logger.log('4444');
}

test("Tests for breeding", function () {
  stop(10000);
  Geniverse.gwtController.addObserver('isReady', window, checkGWTReadiness);
});

