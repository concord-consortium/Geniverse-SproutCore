// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.inAvatar = Ki.State.extend({

  enterState: function() {
    // FIXME Temporarily disable this until we get artwork for it
    // Lab.routes.gotoLabRoute({pageName: 'avatarPage'});
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

    user = Geniverse.userController.get('content');

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

    // FIXME: for now, adding the observer to 'avatar'. Status does not
    // seem to get triggered (maybe it just doesn't get triggered if user
    // already has avatar set, but FR wants avatar button to always lead
    // to Fable Vison site for now)
    user.addObserver('avatar', stateChanged);
    console.log("setting avatar " + name + " on user: " + user.get('firstName') + " " + user.get('lastName'));
    user.set('avatar', name);
    Geniverse.store.commitRecords();

  }
});
