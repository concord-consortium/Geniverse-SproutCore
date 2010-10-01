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

  gwtReadyBinding: 'Geniverse.gwtController.isReady',
  isBreeding: NO,

  mother: Geniverse.NO_DRAGON,
  father: Geniverse.NO_DRAGON,
  child: Geniverse.NO_DRAGON,

  parentStats: SC.Object.create({
    colors: SC.Object.create({
      red: 0,
      green: 0,
      yellow: 0,
      purple: 0
    })
  }),

  hasParents: function () {
    var mother = this.get('mother');
    var father = this.get('father');
    return !!(mother && mother != Geniverse.NO_DRAGON && father && father != Geniverse.NO_DRAGON);
  }.property('mother', 'father').cacheable(),

  breed: function () {
    var self = this;
    var nEggs = 0;
    this.set('isBreeding', YES);
    Geniverse.eggsController.removeAllEggs(); // clear the breeding pen
    
    if (this._callback_version === undefined) {
      this._callback_version = 0;
    }
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
        self.updateStats(child);
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
  },

  updateStats: function(new_dragon)  {
    var color = new_dragon.get('color');
    var value = this.getPath('parentStats.colors.' + color) + 1;
    SC.Logger.info("update stats called: C: %s, V: %d", color, value);
    this.setPath('parentStats.colors.' + color, value);
  }
  
});
