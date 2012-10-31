Geniverse.unlockablesController = SC.Object.create({
  userBinding: 'Geniverse.userController.content',
  loadUnlockables: function() {
    var all = Geniverse.store.find(SC.Query.local(Geniverse.Unlockable));
    this.set('all', all);
    this.set('unlocked', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {conditions: 'unlocked = true'})));
    this.set('locked', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {conditions: 'unlocked = false'})));
    this.set('viewed', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {conditions: 'unlocked = true AND viewed = true'})));
    this.set('notViewed', Geniverse.store.find(SC.Query.local(Geniverse.Unlockable, {conditions: 'unlocked = true AND viewed = false'})));

    var user = this.get('user');
    if (typeof(user) != 'undefined' && user !== null) {
      // unlock whatever the user has already done
      // FIXME Something is loading after this and resetting the changes...
      all.invokeLater(function() {
        all.forEach(function(item) {
          var stars = Geniverse.userController.getPageStars(item.get('trigger'));
          if (stars > 0) {
            console.log("unlocking " + item.get('title'), item.get('status'));
            item.set('unlocked', YES);
            item.set('viewed', YES);
          }
        });
        Geniverse.store.commitRecords();
        all.reload();
        this.propertyDidChange('all');
        this.propertyDidChange('locked');
        this.propertyDidChange('unlocked');
        this.propertyDidChange('viewed');
        this.propertyDidChange('notViewed');
      }, 500);
    }
  }.observes('user'),
  all: null,
  unlocked: null,
  locked: null,
  viewed: null,
  notViewed: null,
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
