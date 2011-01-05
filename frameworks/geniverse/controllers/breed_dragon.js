// ==========================================================================
// Project:   Geniverse.breedDragonController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse generateDragonWithSex*/

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.breedDragonController = SC.Controller.create(
/** @scope Geniverse.breedDragonController.prototype */ {

  gwtReadyBinding: 'Geniverse.gwtController.isReady',
  isBreeding: NO,

  mother: null, //Geniverse.NO_DRAGON,
  father: null, //Geniverse.NO_DRAGON,
  child: null, //Geniverse.NO_DRAGON,
  newChild: null,
  resetCount: 0,
  breedCount: 0,
  numberOfOffspring: 20,

  hasParents: function () {
    var mother = this.get('mother');
    var father = this.get('father');
    return !!(mother && mother != Geniverse.NO_DRAGON && father && father != Geniverse.NO_DRAGON);
  }.property('mother', 'father').cacheable(),

  parentsChanged: function() {
   // this.set('child', Geniverse.NO_DRAGON);
    this.set('newChild', null);
    this.set('resetCount',this.get('resetCount') + 1); // poor mans event propogation
  }.observes('mother','father'),

  // http://www.pivotaltracker.com/story/show/5298197
  // rest parents and breeding pool.
  reset: function() {
    this.set('mother', null); //Geniverse.NO_DRAGON);
    this.set('father', null); //Geniverse.NO_DRAGON);
    this.set('child',  null); //Geniverse.NO_DRAGON);
    this.set('newChild', null);
    this.set('resetCount',this.get('resetCount') + 1); // poor mans event propogation
    this.set('breedCount', 0);
  },

  breed: function () {
    var self = this;
    var nEggs = 0;
    this.set('isBreeding', YES);
    Geniverse.eggsController.removeAllEggs(); // clear the breeding pen
    
    if (this._callback_version === undefined) {
      this._callback_version = 0;
    }
    this._callback_version++;
    
    var breedTime = new Date().getTime();
    this.set('breedCount', this.get('breedCount') + 1);

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
        self.set('newChild',child);  // should only ever be called once per dragon.
        // if isEgg and isInMarketplace aren't yet properties on backend, we have to reset them here
        if (child.get('isEgg') === null){
          child.set('isEgg', true);
          // child.set('isInMarketplace', false);
          child.set('isInMarketplace', true);
        }
        
        child.set('breedTime', breedTime);
        
        Geniverse.eggsController.addObject(child);
        SC.RunLoop.end();

        nEggs++;
        if (nEggs == self.get('numberOfOffspring')) {
          SC.RunLoop.begin();
          self.set('isBreeding', NO);
          SC.RunLoop.end();
        }
        else if (nEggs > self.get('numberOfOffspring')) {
          throw "Oops; GWT called back one too many times!";
        }
      };
    }(this._callback_version);
    Geniverse.gwtController.breedOrganisms(this.get('numberOfOffspring'), this.get('mother'), this.get('father'), didCreateChild);
  }
  
});
