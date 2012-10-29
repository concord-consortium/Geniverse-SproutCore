Geniverse.unlockablesController = SC.Object.create({
  userBinding: 'Geniverse.userController.content',
  loadUnlockables: function() {
    var all = Geniverse.store.find(SC.Query.local(Geniverse.Unlockable));
    this.set('all', all);
    this.set('unlocked', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {conditions: 'unlocked = true'})));
    this.set('locked', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {conditions: 'unlocked = false'})));
    this.set('viewed', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {conditions: 'unlocked = true AND viewed = true'})));
    this.set('notViewed', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {conditions: 'unlocked = true AND viewed = false'})));

    // Not sure what's not loaded yet that this depends on, so delay it slightly
    var _this = this;
    setTimeout(function() {
      var user = _this.get('user');
      if (typeof(user) != 'undefined' && user !== null) {
        // unlock whatever the user has already done
        all.forEach(function(item) {
          var stars = Geniverse.userController.getPageStars(item.get('trigger'));
          if (stars > 0) {
            item.set('unlocked', YES);
            item.set('viewed', YES);
          }
        });
      } else {
        // make sure everything is locked and unvisited
        all.forEach(function(item) {
          item.set('unlocked', NO);
          item.set('viewed', NO);
        });
      }
      Geniverse.store.commitRecords();
      all.reload();
    }, 100);
  }.observes('user'),
  all: [],
  unlocked: [],
  locked: [],
  viewed: [],
  notViewed: [],
  unlockFor: function(trigger) {
    var locked = this.get('locked').filter(function(item) { return item.get('trigger') == trigger; });
    locked.forEach(function(item) { item.set('unlocked', YES); });
    this.get('all').reload();
  }
});
