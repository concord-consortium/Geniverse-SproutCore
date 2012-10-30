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
    var _this = this;
    var locked = this.get('locked').filter(function(item) { return item.get('trigger') == trigger; });
    locked.forEach(function(item) {
      item.set('unlocked', YES);
      _this.notifyUnlockable(item);
    });
    this.get('all').reload();
    this.propertyDidChange('all');
    this.propertyDidChange('locked');
    this.propertyDidChange('unlocked');
  },
  toNotify: [],
  currentNotification: null,
  notifyUnlockable: function(unlockable) {
    this.get('toNotify').push(unlockable);
    this.notifyNextUnlockable();
  },
  notifyNextUnlockable: function() {
    if (!this.get('currentNotification')) {
      var n = this.get('toNotify').shift();
      if (n) {
        // Show notification popup
        var _this = this;
        var pane = Geniverse.UnlockableNotificationView.create({
          message: n.get('title'),
          click: function() {
            console.log("notification clicked");
            _this.removeCurrentNotification(true);
            _this.set('selectedUnlockable', n);
          }
        });
        this.set('currentNotification', pane);
        pane.append();
        // Set timer to remove popup and show next popup
        setTimeout(this.removeCurrentNotification, 5000);
      }
    }
  },
  removeCurrentNotification: function(skipNext) {
    _this = Geniverse.unlockablesController;
    if (!!_this.get('currentNotification')) {
      // TODO Fade it out, then remove it
      _this.get('currentNotification').remove();
      _this.set('currentNotification', null);
    }
    if (!skipNext) {
      _this.notifyNextUnlockable();
    }
  },
  displayUnlockable: function() {
    var unlockable = this.get('selectedUnlockable');
    if (unlockable) {
      unlockable.set('viewed', YES);
      this.showPane();
    }
  }.observes('selectedUnlockable'),
  selectedUnlockable: null,
  pane: null,
  showPane: function() {
    var _pane = this.get('pane') || Geniverse.UnlockableView.create();
    this.set('pane',_pane);
    if (!_pane.get('isVisibleInWindow')){
      _pane.append();
    }
  },
  removePane: function() {
    var _pane = this.get('pane');
    if (this.get('pane')) {
      this.get('pane').remove();
      this.set('pane', null);
      this.set('selectedUnlockable', null);
    }
    this.notifyNextUnlockable();
  }
});
