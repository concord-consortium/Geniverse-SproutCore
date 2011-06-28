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
      "${url}" +
      "</p>" +
      "<b>Reasoning</b>" +
      "<p>" +
      "${reasoning}" +
      "</p>";
      
    content = content
                .replace("${evidence}", this.get('content1'))
                .replace("${url}", this.get('content2'))
                .replace("${reasoning}", this.get('content3'));
                
    return content;
  }.property('content1', 'content2', 'content3'),
  
  blankContent: function() {
    this.set('title', '');
    this.set('content1', '');
    this.set('content2', '');
    this.set('content3', '');
  }

}) ;
