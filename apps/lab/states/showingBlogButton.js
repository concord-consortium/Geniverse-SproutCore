// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

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
    
    blogPostView: null,
    
    enterState: function() {
      this.blogPostView = Geniverse.BlogPostView.create();
      this.blogPostView.append();
    },
    
    exitState: function() {
      Geniverse.blogPostController.blankContent();
      this.blogPostView.remove();
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
      
      SC.Request.postUrl("/portal/blog/post_blog").json().send(data);
    }
  })
  
});

