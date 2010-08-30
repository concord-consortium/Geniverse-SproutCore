// ==========================================================================
// Project:   Geniverse.breedDragonController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse module test ok equals same stop start eggs eggsObserver runTest parentsObserver controller testBreeding*/

module("Geniverse.breedDragonController", {    
  teardown: function () {
    eggs.removeObserver('length', eggsObserver);
  }
});

function checkGWTReadiness() {
  if (Geniverse.gwtController.get('isReady')) {
    Geniverse.gwtController.removeObserver('isReady', checkGWTReadiness);
    Geniverse.set('isLoaded', YES);
    Geniverse.invokeOnce(runTest);
  }
}

test("Tests for breeding", function () {
  stop();
  Geniverse.gwtController.addObserver('isReady', checkGWTReadiness);
});

function runTest() {
  controller = Geniverse.breedDragonController;
  controller.initParents();
  console.log('adding parentsObserver');
  controller.addObserver('parentsAreSet', parentsObserver);
}

function parentsObserver() {
  if (controller.get('parentsAreSet')) {
    controller.removeObserver('parentsAreSet', parentsObserver);
    controller.invokeOnce(testBreeding);
  }
}

function testBreeding() {
  console.log('calling breed()');
  Geniverse.breedDragonController.breed();
  console.log('breed() called');
  
  eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
  console.log('adding eggsObserver');
  eggs.addObserver('length', eggsObserver);
}

function checkLength() {
  var length = eggs.get('length');
  
  if (length === 20) {
    ok(true, 'eggs.length == 20');
    start();
  }
  else if (length > 20) {
    // should never be called; 
    // note start() will have been called at this point so the 'ok' assertion will be an error
    ok(false, "eggs.length > 20");
  }
  console.log(length);
}
  
function eggsObserver() {
  eggs.invokeOnce(checkLength);
}



