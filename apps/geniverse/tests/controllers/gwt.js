// ==========================================================================
// Project:   Geniverse.gwt Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================


/*globals Geniverse module test ok equals same stop start checkGWTReadiness runTest */

module("Geniverse.gwt");

function checkGWTReadiness() {
  if (Geniverse.gwtController.get('isReady')) {
    Geniverse.gwtController.removeObserver('isReady', window, checkGWTReadiness);
    Geniverse.set('isLoaded', YES);
    start();
    runTest();
  }
}

test("basic gwt test", function () {
  stop(5000);
  Geniverse.gwtController.addObserver('isReady', window, checkGWTReadiness);
  checkGWTReadiness();
});

function runTest() {
  stop(5000);
  Geniverse.gwtController.generateRandomDragon(function (org){
    start();
    ok(true, "We got called back");
  });
}