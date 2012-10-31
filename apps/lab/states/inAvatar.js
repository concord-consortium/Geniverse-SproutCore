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
    this._chooseAvatar('Scarlett', '/intro/scarlett.html');
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
        window.location = url;
      }
    };

    user.addObserver('status', stateChanged);
    console.log("setting avatar " + name + " on user: " + user.get('firstName') + " " + user.get('lastName'));
    user.set('avatar', name);
    Geniverse.store.commitRecords();
  }
});
