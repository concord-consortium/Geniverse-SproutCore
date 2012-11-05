// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.inAvatar = Ki.State.extend({

  enterState: function() {
    // FIXME Temporarily disable this until we get artwork for it
    // Lab.routes.gotoLabRoute({pageName: 'avatarPage'});
    var user = Geniverse.userController.get('content');
    // clear the currently chosen avatar so that when we set one later,
    // it will definitely trigger a DIRTY state on the user object.
    user.set('avatar', '');
    this.get('statechart').sendAction('choseScarlett');
  },

  exitState: function() {
  },

  choseScarlett: function() {
    this._chooseAvatar('Scarlett', 'http://geniverse.fablevision-dev.com/#sequence-1.html');
  },

  choseStrider: function() {
    this._chooseAvatar('Strider', '/intro/strider.html');
  },

  _chooseAvatar: function(name, url) {
    Lab.avatarController.set('waiting', YES);

    var user = Geniverse.userController.get('content');

    stateChanged = function() {
      console.log("status: " + user.get('status'));
      if (user.get('status') == SC.Record.READY_CLEAN) {
        user.removeObserver('status', stateChanged);

        // FIXME: after going to url, back button returns user to #avatar, and
        // then this cycles back to url. Removing hash first fixes it.
        window.location.hash = "";

        window.location = url;
      }
    };

    user.addObserver('status', stateChanged);
    console.log("setting avatar " + name + " on user: " + user.get('firstName') + " " + user.get('lastName'));
    user.set('avatar', name);
    Geniverse.store.commitRecords();

  }
});
