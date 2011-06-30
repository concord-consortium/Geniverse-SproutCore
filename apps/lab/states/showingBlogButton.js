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
      this._postToWPBlog(title, content);
      
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
    
    _postToWPBlog: function(title, content) {
      var className = Geniverse.userController.get('className');
      
      var data = {
        blog_url: "http://geniverse.buddypress.staging.concord.org/" + className + "/xmlrpc.php",
        post_title: title,
        post_content: content
      };
      
      SC.Request.postUrl("/portal/blog/post_blog").json().notify(this, '_showConfirmation').send(data);
    },
    
    _waitDialog: null,
    
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
    
    _showFailureMessage: function() {
      this._waitDialog.dismiss();
      SC.AlertPane.extend({
        layout: {top: 0, centerX: 0, width: 400, height: 100 }
      }).show(
        "Error posting to the journal", 
        "Your post doesn't seem to have reached the journal. Please check your internet connection and try again.",
        "",
        "OK",
        this
      );
      
      Geniverse.blogPostController.restoreBlogPost();
    },
    
    // delegate for _showFailureMessage alertPane
    alertPaneDidDismiss: function() {
      Lab.statechart.getState('showingBlogButton').gotoState('showingBlogPostPanel');
    },
    
    _showConfirmation: function(response){
      this._waitDialog.dismiss();
      this.get('_failureTimer').invalidate();
      
      if (SC.ok(response)) {
        var match = response.rawRequest.responseText.match(/<int>(.*)<\/int>/);
        if (match.length > 0) {
          var postId = match[1];
          var className = Geniverse.userController.get('className');
          var postURL = "http://geniverse.buddypress.staging.concord.org/" + className + "/?p=" + postId;
          SC.AlertPane.extend({
            layout: {top: 0, centerX: 0, width: 360, height: 100 },
            displayDescription: function() {
              var desc = this.get('description');
              if (!desc || desc.length === 0) {return desc;} 
              return '<p class="description">' + desc.split('\n').join('</p><p class="description">') + '</p>';
            }.property('description').cacheable()
          }).plain(
            "Journal post successfully created", 
            "Your latest post can be found <a target='_blank' href='"+postURL+"'>here</a>.<br/>(Link will open in a new tab) ",
            "",
            "OK",
            "",
            ""
          );
        }
      }
    }
  })
  
});

