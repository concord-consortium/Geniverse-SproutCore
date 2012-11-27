Geniverse.unlockablesController = SC.Object.create({
  userBinding: 'Geniverse.userController.content',
  loaded: NO,
  loadQueries: function() {
    // only load the queries once. Doing it multiple times messes up the unlockables pulldown,
    // and is totally unnecessary.
    if (!this.get('loaded')) {
      this.set('all', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {orderBy: "title ASC"})));
      this.set('unlocked', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {conditions: 'unlocked = true', orderBy: "title ASC"})));
      this.set('locked', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {conditions: 'unlocked = false', orderBy: "title ASC"})));
      this.set('viewed', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {conditions: 'unlocked = true AND viewed = true', orderBy: "title ASC"})));
      this.set('notViewed', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {conditions: 'unlocked = true AND viewed = false', orderBy: "title ASC"})));
      this.set('loaded', YES);
    }
  },

  loadUnlockables: function() {
    this.loadQueries();
    var user = this.get('user');
    var all = this.get('all');
    if (typeof(user) != 'undefined' && user !== null) {
      // unlock whatever the user has already done
      var unlock = function() {
        all.forEach(function(item) {
          var stars = 0;
          if (Geniverse.userController.isAccelerated()) {
            stars = 1;
          } else if (Geniverse.userController.isUnlocked("unlockables", item.get('title'))) {
            stars = 1;
          } else {
            stars = Geniverse.userController.getPageStars(item.get('trigger'));
          }
          if (stars > 0) {
            console.warn("unlocking " + item.get('title'), item.get('status'));
            item.set('unlocked', YES);
            item.set('viewed', YES);
          }
        });
      };
      if (all.get('status') == SC.Record.READY_CLEAN) {
        unlock();
      } else {
        all.addObserver('status', function() {
          if (all.get('status') == SC.Record.READY_CLEAN) {
            all.removeObserver('status', this);
            unlock();
          }
        });
      }
    }
  }.observes('user'),
  unlockAllLocked: function() {
    var _this = this;
    this.loadQueries();
    var locked = this.get('locked');
    locked.forEach(function(item) {
      item.set('unlocked', YES);
      _this.notifyUnlockable(item);
    });
    this.get('all').reload();
    this.propertyDidChange('all');
    this.propertyDidChange('locked');
    this.propertyDidChange('unlocked');
  },
  all: null,
  unlocked: null,
  locked: null,
  viewed: null,
  notViewed: null,
  unlockFor: function(trigger, skipNotify) {
    var _this = this;
    var locked = this.get('locked').filter(function(item) { return item.get('trigger') == trigger; });
    var unlocked = [];
    locked.forEach(function(item) {
      item.set('unlocked', YES);
      Geniverse.userController.setUnlocked("unlockables",item.get('title'));
      if (!skipNotify) {
        _this.notifyUnlockable(item);
      }
      unlocked.push(item);
    });
    this.get('all').reload();
    this.propertyDidChange('all');
    this.propertyDidChange('locked');
    this.propertyDidChange('unlocked');
    return unlocked;
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
    if (unlockable && unlockable.get('content')) {
      unlockable.set('viewed', YES);
      this.showPane();
    }
  }.observes('selectedUnlockable'),
  selectedUnlockable: null,
  pane: null,
  showPane: function() {
    var _pane = Geniverse.UnlockableView;
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
      this.set('selectedUnlockable', SC.Object.create());
    }
    this.notifyNextUnlockable();
  }
});
