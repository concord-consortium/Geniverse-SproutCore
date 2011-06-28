// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki SC*/

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
    
    _showConfirmation: function(response){
      if (SC.ok(response)) {
        var match = response.rawRequest.response.match(/<int>(.*)<\/int>/);
        if (match.length > 0) {
          var postId = match[1];
          var className = Geniverse.userController.get('className');
          var postURL = "http://geniverse.buddypress.staging.concord.org/" + className + "/?p=" + postId;
          SC.AlertPane.extend({
            layout: {top: 0, centerX: 0, width: 300, height: 100 },
            displayDescription: function() {
              var desc = this.get('description');
              if (!desc || desc.length === 0) {return desc;} 
              return '<p class="description">' + desc.split('\n').join('</p><p class="description">') + '</p>';
            }.property('description').cacheable()
          }).plain(
            "Blog post successfully created", 
            "Your latest post can be found <a target='_blank' href='"+postURL+"'>here</a>.<br/>(Link will open in a new tab) ",
            "",
            "OK",
            "",
            this
          );
        }
      }
    }
  })
  
});

