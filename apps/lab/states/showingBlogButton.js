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
    },

    exitState: function() {
      Geniverse.blogPostController.hideBlogPane();
    },

    post: function() {
      var title = Geniverse.blogPostController.get('title');
      var content = Geniverse.blogPostController.get('content');
      var tags = this._get_blog_tags();
      if (!this._checkURL(content)) {
        return;
      }

      this._postToWPBlog(title, content, tags);

      this._showWaitDialog();

      this._failureTimer = SC.Timer.schedule({
        target: this,
        action: '_showFailureMessage',
        interval: 10000,
        repeats: NO
      });

      this.closePanel();
    },

    closePanel: function() {
      this.gotoState('ready');
    },

    _checkURL: function() {
      var url = Geniverse.blogPostController.get('content3');
      if (url && !/^http:\/\//.exec(url)) {
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
    },

    _postToWPBlog: function(title, content, tags) {
      var className = Geniverse.userController.get('className');

      var data = {
        blog_name: className,
        post_title: title,
        post_content: content,
        post_tags: tags
      };

      SC.Request.postUrl("/portal/blog/post_blog").json().notify(this, 'didSendBlogPost').send(data);
    },

    _waitDialog: null,

    _get_blog_tags: function() {
      var tags = "";

      var challengeTitle = Geniverse.activityController.get('title');
      if (challengeTitle) {
        tags += challengeTitle;
      }
      return tags;
    },

    _showWaitDialog: function() {
      this._waitDialog = SC.AlertPane.extend({
        layout: {top: 0, centerX: 0, width: 300, height: 100 }
      }).show(
        "",
        "Posting to the journal...",
        "",
        "Dismiss",
        "",
        "",
        'spinner-icon-48'
      );
    },

    _failureTimer: null,

    _failureDialog: null,

    _showFailureMessage: function() {
      if (this._failureDialog) {
        return;
      }
      this._waitDialog.dismiss();
      this.get('_failureTimer').invalidate();

      Geniverse.blogPostController.restoreBlogPost();

      this._failureDialog = SC.AlertPane.extend({
        layout: {top: 0, centerX: 0, width: 400, height: 100 }
      }).show(
        "Error posting to the journal",
        "Your post doesn't seem to have reached the journal. Please check your internet connection and try again.",
        "",
        "OK",
        this
      );
    },

    // delegate for _showFailureMessage alertPane
    alertPaneDidDismiss: function() {
      this._failureDialog = null;
      Lab.statechart.getState('showingBlogButton').gotoState('showingBlogPostPanel');
    },

    didSendBlogPost: function(response) {
      var match, postId, className, postURL;

      this._waitDialog.dismiss();
      this.get('_failureTimer').invalidate();

      if (SC.ok(response)) {

        match = response.rawRequest.responseText.match(/<int>(.*)<\/int>/);
        if (match.length > 0) {
          postId    = match[1];
          className = Geniverse.userController.get('className');
          postURL   = Lab.journalController.get('journalBaseURL') + className + "/?p=" + postId;

          Lab.statechart.sendAction('didSendBlogPost');

          Lab.feedbackController.didSendBlogPost(this.get('description'), postURL);
        }
      } else {
        this._showFailureMessage();
      }
    }
  })

});

