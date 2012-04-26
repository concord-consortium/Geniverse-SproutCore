// ==========================================================================
// Project:   Geniverse.blogPostController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
sc_require('views/blog_post');

Geniverse.blogPostController = SC.Controller.create(
/** @scope Geniverse.chromosomeToolController.prototype */ {
  
  title: "",
  
  content1: "",
  
  content2: "",
  
  content3: "",
  
  content: function() {
    var content =
      "<b>Evidence</b>" +
      "<p>" +
      "${evidence}</br>" +
      "<a href='${url}'>${url}</a>" +
      "</p>" +
      "<b>Reasoning</b>" +
      "<p>" +
      "${reasoning}" +
      "</p>";
      
    content = content
                .replace(/\$\{evidence\}/g, this.get('content1'))
                .replace(/\$\{url\}/g, this.get('content2'))
                .replace(/\$\{reasoning\}/g, this.get('content3'));
                
    return content;
  }.property('content1', 'content2', 'content3'),
  
  blogPostView: null,

	iframe: null,

	currentPageView: function(){
		var pageType = Geniverse.activityController.get('pageType');
		return Lab[pageType].mainPane;
	}.property(),

  
  showBlogPane: function() {
    this.blogPostView = Geniverse.BlogPostView.create();
		this.set('iframe',SC.WebView.create({								//This is an empty iFrame used to make sure the InfoView will be on top of applets
			layoutBinding: 'Geniverse.blogPostController.blogPostView.layout',
			value: static_url('empty.html')}));
		this.get('currentPageView').appendChild(this.get('iframe'));
    this.blogPostView.append();
  },
  
  hideBlogPane: function() {
    // save content in case in needs to be restored
    this.set('_savedTitle', this.get('title'));
    this.set('_savedContent1', this.get('content1'));
    this.set('_savedContent2', this.get('content2'));
    this.set('_savedContent3', this.get('content3'));
    
    this.set('title', '');
    this.set('content1', '');
    this.set('content2', '');
    this.set('content3', '');
    this.blogPostView.remove();
		this.get('iframe').parentView.removeChild(this.get('iframe'));
  },
  
  restoreBlogPost: function() {
    this.set('title', this.get('_savedTitle'));
    this.set('content1', this.get('_savedContent1'));
    this.set('content2', this.get('_savedContent2'));
    this.set('content3', this.get('_savedContent3'));
  },
  
  _savedTitle: "",
  
  _savedContent1: "",
  
  _savedContent2: "",
  
  _savedContent3: ""

}) ;
