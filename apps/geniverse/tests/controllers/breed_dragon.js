// ==========================================================================
// Project:   Geniverse.breedDragonController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse module test ok equals same stop start afterPropertyChange controller eggs breedDragons oldBreedOrganisms */

module('Geniverse.breedDragonController unit test with GWT breedDragons mocked', {
  setup: function () {
    controller = Geniverse.breedDragonController;
    eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
  },
  
  teardown: function () {
    if (oldBreedOrganisms) Geniverse.gwtController.breedOrganisms = oldBreedOrganisms;
    controller.set('isBreeding', NO);
  }
});

test('Geniverse.breedDragonController breed() should ignore callbacks from all but the most recent call to breed()', function () {
  expect(7);
  
  afterPropertyChange(Geniverse.gwtController, 'isReady', YES, function () {
    Geniverse.set('isLoaded', YES);
    
    // mock breedOrganisms so we can manually inspect & call the callbacks
    oldBreedOrganisms = Geniverse.gwtController.breedOrganisms;
    var self = this;
    Geniverse.gwtController.breedOrganisms = function (number, mother, father, handleChildFunction) {
      self.number = number;
      self.mother = mother;
      self.father = father;
      self.callback = handleChildFunction;
    };
    
    afterPropertyChange(controller, 'hasParents', YES, function () {    
      ok(!controller.get('isBreeding'), 'isBreeding should be NO before breed() is called');
      
      controller.breed();
      var firstCallback = this.callback;
      controller.breed();
      var secondCallback = this.callback;
      
      ok(firstCallback !== secondCallback, 'successive calls to breed should set different callback functions');
      equals(eggs.get('length'), 0, 'EGGS_QUERY result set should have 0 eggs immediately after breed()');      
      
      // clone mother
      var mother = Geniverse.breedDragonController.get('mother');
      var storeKey = mother.get('storeKey');
      var hash = Geniverse.store.readDataHash(storeKey);
      
      var dragon = Geniverse.store.createRecord(Geniverse.Dragon, hash);
      dragon.set('guid', 'dummy1');
      dragon.set('bred', YES);
      firstCallback(dragon);

      equals(eggs.get('length'), 0, 'EGGS_QUERY result set size should still be 0 after firstCallback was called');  
      equals(dragon.get('isEgg'), null, 'dragon.isEgg should still be null after firstCallback is called');
      
      dragon.destroy();
      
      dragon = Geniverse.store.createRecord(Geniverse.Dragon, hash);
      dragon.set('guid', 'dummy2');
      dragon.set('bred', YES);      
      secondCallback(dragon);

      equals(eggs.get('length'), 1, 'EGGS_QUERY result set size should increase to 1 after secondCallback is called');  
      equals(dragon.get('isEgg'), YES, 'dragon.isEgg should be YES after secondCallback is called');

      dragon.destroy();
    });
  });
});


module("Geniverse.breedDragonController integration test", {
  setup: function () {
    controller = Geniverse.breedDragonController;
    eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
  }
});

test('Geniverse.breedDragonController breed() should create 20 eggs', function () {
  expect(4);
  
  afterPropertyChange(Geniverse.gwtController, 'isReady', YES, function () {
    Geniverse.set('isLoaded', YES);
    afterPropertyChange(controller, 'hasParents', YES, function () {
      
      ok(!controller.get('isBreeding'), 'isBreeding should be NO before breed() is called');
      
      controller.breed();              
      
      ok(controller.get('isBreeding'), 'isBreeding should be YES immediately after breed()');
      equals(eggs.get('length'), 0, 'EGGS_QUERY result set should have 0 eggs immediately after breed()');
      
      afterPropertyChange(controller, 'isBreeding', NO, function () {
        equals(eggs.get('length'), 20, 'EGGS_QUERY result set should have 20 eggs after isBreeding is set to NO');
      });
    });
  });
});