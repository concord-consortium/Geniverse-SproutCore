// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.inAvatar = Ki.State.extend({

  enterState: function() {
    var user = Geniverse.userController.get('content');
    // clear the currently chosen avatar so that when we set one later,
    // it will definitely trigger a DIRTY state on the user object.
    user.set('avatar', '');
    Lab.routes.gotoLabRoute({pageName: 'avatarPage'});
  },

  exitState: function() {
  },

  choseScarlett: function() {
    this._chooseAvatar('Scarlett', Geniverse.resourceURL('/resources/narrative/intro/introduction.html#sequence-1.html'));
  },

  choseStrider: function() {
    this._chooseAvatar('Strider', Geniverse.resourceURL('/resources/narrative/intro/introduction.html#sequence-1-strider.html'));
  },

  _chooseAvatar: function(name, url) {
    Lab.avatarController.set('waiting', YES);

    var user = Geniverse.userController.get('content'),
        date,
        minutes;

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
    $.cookie("avatar",name);
    user.set('avatar', name);

    // set a quickly-expiring cookie that shows that we have recently selected an avatar, so that
    // when we return from the narrative we can go straight to the home page. This cookie expires so
    // that if we later return to GV, we will still see the intro screen.
    date = new Date();
    minutes = 20;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    $.cookie("avatar_selected", "true", { expires: date });

    Geniverse.store.commitRecords();

  }
});
