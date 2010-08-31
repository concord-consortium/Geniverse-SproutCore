// ==========================================================================
// Project:   Geniverse.breedDragonController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse module test ok equals same stop start eggs gwtObserver waitForParents parentsObserver controller testBreeding isBreedingObserver */

module("Geniverse.breedDragonController", {
  setup: function () {
    controller = Geniverse.breedDragonController;
    eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
  },
  
  teardown: function () {
    Geniverse.gwtController.removeObserver('isReady', gwtObserver);
    controller.removeObserver('hasParents', parentsObserver);
    controller.removeObserver('isBreeding', isBreedingObserver);
  }
});

function gwtObserver() {
  if (Geniverse.gwtController.get('isReady')) {
    Geniverse.set('isLoaded', YES);
    Geniverse.invokeOnce(waitForParents);
  }
}

function waitForParents() {
  controller.initParents();
  controller.addObserver('hasParents', parentsObserver);
}

function parentsObserver() {
  if (controller.get('hasParents')) {
    controller.removeObserver('hasParents', parentsObserver);
    controller.invokeOnce(testBreeding);
  }
}

function testBreeding() {  
  ok(!controller.get('isBreeding'), 'isBreeding should be NO before breed() is called');
  controller.breed();
  ok(controller.get('isBreeding'), 'isBreeding should be YES immediately after breed()');
  equals(eggs.get('length'), 0, 'EGGS_QUERY result set should have 0 eggs immediately after breed()');
  
  controller.addObserver('isBreeding', isBreedingObserver);
}

function isBreedingObserver() {
  if (!controller.get('isBreeding')) {
    console.log('isBreeding = NO');
    controller.removeObserver('isBreeding', isBreedingObserver);
    equals(eggs.get('length'), 20, 'EGGS_QUERY result set should have 20 eggs after isBreeding is set to NO');
    start();
  }
}

test("Test that breed() breeds 20 eggs", function () {
  stop(10000);
  Geniverse.gwtController.addObserver('isReady', gwtObserver);
});

