// ==========================================================================
// Project:   Geniverse.breedDragonController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse generateDragonWithSex*/

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.breedDragonController = SC.Controller.create(
/** @scope Geniverse.breedDragonController.prototype */ {

  initParentsImmediately: YES,
  gwtReadyBinding: 'Geniverse.gwtController.isReady',
  isBreeding: NO,

  mother: null,
  father: null,
  child: null,
  
  hasParents: function () {
    return !!(this.get('mother') && this.get('father'));
  }.property('mother', 'father').cacheable(),
  
  initParents: function () {
    var self = this;
    
    // set mother, father to null in case we are re-running initParents() 
    // (we wouldn't want hasParents to be YES because of stale parents)
    this.set('mother', null);
    this.set('father', null);
    
    function setMother(dragon) {
      SC.RunLoop.begin();
      self.set('mother', dragon);
      SC.RunLoop.end();
    }
    
    function setFather(dragon) {
      SC.RunLoop.begin();
      self.set('father', dragon);
      SC.RunLoop.end();
    }
    
    if (this.get('gwtReady') && this.get('initParentsImmediately')) {
      SC.Logger.log('gwt ready. initializing parents');
      
      var alleles = Geniverse.activityController.getInitialAlleles('f');
      if (typeof(alleles) === 'string') {
        Geniverse.gwtController.generateDragonWithAlleles(alleles, 1, 'Mother', setMother);
      } 
      else {
        Geniverse.gwtController.generateDragon(1, 'Mother', setMother);
      }
      
      alleles = Geniverse.activityController.getInitialAlleles('m');
      if (typeof(alleles) === 'string') {
        Geniverse.gwtController.generateDragonWithAlleles(alleles, 0, 'Father', setFather);
      } 
      else {
        Geniverse.gwtController.generateDragon(0, 'Father', setFather);
      }
    }
  }.observes('gwtReady'),

  breed: function () {
    var self = this;
    var nEggs = 0;
    this.set('isBreeding', YES);
    Geniverse.eggsController.removeAllEggs(); // clear the breeding pen
    
    if (this._callback_version === undefined) this._callback_version = 0;
    this._callback_version++;

    // wrap callback passed to GWT with a version number; this way we can reject callbacks from outdated calls to breed()
    var didCreateChild = function (version) {
      return function (child) {
        if (version !== self._callback_version) {
          console.log('breedDragonController: rejecting callback from earlier breed() ' +
            '(callback version = %d, current version = %d)', version, self._callback_version);
          return;
        }
        SC.RunLoop.begin();
        self.set('child', child);
        // if isEgg and isInMarketplace aren't yet properties on backend, we have to reset them here
        if (child.get('isEgg') === null){
          child.set('isEgg', true);
          child.set('isInMarketplace', true);
        }
        SC.RunLoop.end();

        nEggs++;
        if (nEggs == 20) {
          SC.RunLoop.begin();
          self.set('isBreeding', NO);
          SC.RunLoop.end();
        }
        else if (nEggs > 20) {
          throw "Oops; GWT called back one too many times!";
        }
      };
    }(this._callback_version);

    Geniverse.gwtController.breedOrganisms(20, this.get('mother'), this.get('father'), didCreateChild);
  }
  
});
