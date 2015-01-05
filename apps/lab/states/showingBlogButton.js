// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki SC static_url*/

Lab.showingBlogButton =  Ki.State.extend({

  initialSubstate: 'ready',

  enterState: function() {
    // Lab.mainPage.get('topView').set('isVisible', YES);
  },

  exitState: function() {
    // Lab.mainPage.get('topView').set('isVisible', YES);
  },

  ready: Ki.State.design({
    showBlogPostPanel: function() {
      this.gotoState('showingBlogPostPanel');
    }
  }),

  showingBlogPostPanel: Ki.State.design({

    enterState: function() {
      Geniverse.blogPostController.showBlogPane();
      Lab.logController.logEvent(Lab.EVENT.OPENED_JOURNAL_POST);
    },

    exitState: function() {
      Geniverse.blogPostController.hideBlogPane();
    },

    post: function() {
      // save a draft first
      this.save();

      if (!this._checkURL(content)) {
        return;
      }

      // then save the post
      Geniverse.blogPostController.saveBlogPost();

      // Trigger statechart actions (possibly marking the challenge complete), and a notification.
      Lab.statechart.sendAction('didSendBlogPost');
      Lab.feedbackController.didSendBlogPost();

      Lab.logController.logEvent(Lab.EVENT.JOURNAL_POST);

      this.closePanel();
    },

    save: function() {
      Geniverse.blogPostController.saveDraftBlogPost();
      Lab.logController.logEvent(Lab.EVENT.SAVED_JOURNAL_POST);
    },

    closePanel: function() {
      this.gotoState('ready');
      Lab.logController.logEvent(Lab.EVENT.CLOSED_JOURNAL_POST);
    },

    saveAndClose: function() {
      this.save();
      this.closePanel();
    },

    _checkURL: function() {
      var url = Geniverse.blogPostController.get('content3');
      if (url && !/^http[s]?:\/\//.exec(url)) {
        SC.AlertPane.extend({
          layout: {top: 0, centerX: 0, width: 400, height: 100 }
        }).show(
          "",
          "Please make sure your evidence URL starts with http://",
          "",
          "OK"
        );
        return false;
      } else {
        return true;
      }
    }
  })

});

