// ==========================================================================
// Project:   Geniverse.breedDragonController Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse GenGWT module test ok equals same stop start afterPropertyChange controller eggs breedDragons oldBreedOrganisms */
var controller, oldBreedOrganisms, eggs, user;

module('Geniverse.breedDragonController unit test with GWT breedDragons mocked', {
  setup: function () {
    SC.Logger.warn("running setup");
    Geniverse.store = SC.Store.create().from(SC.Record.fixtures);
    Geniverse.userController.removeObserver('username', Geniverse.appController, 'login');
    SC.Logger.info("made store");
    controller = Geniverse.breedDragonController;
    SC.Logger.info("found breed controller");
    user = Geniverse.userController.createUser('test','test');
    SC.Logger.info("created user");
    Geniverse.userController.set('content',user);
    SC.Logger.info("set user");
    Geniverse.EGGS_QUERY = SC.Query.local('Geniverse.Dragon', {
        conditions: 'bred = true AND isEgg = true AND isInMarketplace = true',
        orderBy: 'storeKey'
    });
    SC.Logger.warn("finding eggs1!!");
    eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
  },
  
  teardown: function () {
    if (oldBreedOrganisms !== null && typeof oldBreedOrganisms != "undefined") Geniverse.gwtController.breedOrganisms = oldBreedOrganisms;
    controller.set('isBreeding', NO);
  }
});

test('Geniverse.breedDragonController breed() should ignore callbacks from all but the most recent call to breed()', function () {
  expect(7);
  SC.Logger.warn("running ignore callbacks test");
  var eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
  
  afterPropertyChange(Geniverse.gwtController, 'isReady', YES, function () {
    Geniverse.set('isLoaded', YES);
    
    function handleFather(org) {
      Geniverse.breedDragonController.set('father', org);
    }
    
    function handleMother(org) {
      Geniverse.breedDragonController.set('mother', org);
    }
    SC.Logger.warn("getting dragons!!");
    Geniverse.gwtController.generateDragon(0, "father", handleFather);
    Geniverse.gwtController.generateDragon(1, "mother", handleMother);
    
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
      SC.Logger.warn("has PARENTS!!");
      ok(!controller.get('isBreeding'), 'isBreeding should be NO before breed() is called');
      
      SC.Logger.warn("starting breed!!");
      controller.breed();
      var firstCallback = this.callback;
      SC.Logger.warn("starting breed2!!");
      controller.breed();
      var secondCallback = this.callback;
      SC.Logger.warn("comparing breeds!!");
      ok(firstCallback !== secondCallback, 'successive calls to breed should set different callback functions');
      equals(eggs.get('length'), 0, 'EGGS_QUERY result set should have 0 eggs immediately after breed()');      
      
      // clone mother
      SC.Logger.warn("cloning mother!!");
      var mother = Geniverse.breedDragonController.get('mother');
      var storeKey = mother.get('storeKey');
      var hash = Geniverse.store.readDataHash(storeKey);
      
      var dragon = Geniverse.store.createRecord(Geniverse.Dragon, hash);
      dragon.set('guid', 'dummy1');
      dragon.set('bred', YES);
      SC.Logger.warn("sending mother!!");
      firstCallback(dragon);

      equals(eggs.get('length'), 0, 'EGGS_QUERY result set size should still be 0 after firstCallback was called');  
      equals(dragon.get('isEgg'), null, 'dragon.isEgg should still be null after firstCallback is called');
      SC.Logger.warn("destroying mother!!");
      dragon.destroy();
      
      SC.Logger.warn("cloning mother again!!");
      dragon = Geniverse.store.createRecord(Geniverse.Dragon, hash);
      dragon.set('guid', 'dummy2');
      dragon.set('bred', YES); 
      SC.Logger.warn("sending mother again!!"); 
      secondCallback(dragon);

      eggs.reload();
      equals(eggs.get('length'), 1, 'EGGS_QUERY result set size should increase to 1 after secondCallback is called');  
      equals(dragon.get('isEgg'), YES, 'dragon.isEgg should be YES after secondCallback is called');
      SC.Logger.warn("destroying mother again!!");
      dragon.destroy();
    });
  });
});

module('Geniverse.breedDragonController unit test with GWT breedDragons mocked', {
  setup: function () {
    SC.Logger.warn("running setup2");
    Geniverse.store = SC.Store.create().from(SC.Record.fixtures);
    controller = Geniverse.breedDragonController;
    user = Geniverse.userController.createUser('test','test');
    Geniverse.userController.set('content',user);
    Geniverse.EGGS_QUERY = SC.Query.local('Geniverse.Dragon', {
        conditions: 'bred = true AND isEgg = true AND isInMarketplace = false',
        orderBy: 'storeKey'
    });
    SC.Logger.warn("finding eggs!!");
    eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
  },
  
  teardown: function () {
    if (oldBreedOrganisms !== null && typeof oldBreedOrganisms != "undefined") Geniverse.gwtController.breedOrganisms = oldBreedOrganisms;
    controller.set('isBreeding', NO);
  }
});

test('Geniverse.breedDragonController breed() should create 20 eggs', function () {
  expect(4);
  SC.Logger.warn("running 20 eggs test");
  afterPropertyChange(Geniverse.gwtController, 'isReady', YES, function () {
    Geniverse.set('isLoaded', YES);
    
    function handleFather(org) {
      Geniverse.breedDragonController.set('father', org);
    }
    
    function handleMother(org) {
      Geniverse.breedDragonController.set('mother', org);
    }

    Geniverse.gwtController.generateDragon(0, "father", handleFather);
    Geniverse.gwtController.generateDragon(1, "mother", handleMother);
    
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