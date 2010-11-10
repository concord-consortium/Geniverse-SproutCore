// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse, CC, CcChat, java */
Geniverse.marginSize = 15;

sc_require('views/article');
sc_require('views/published_articles');

  
Geniverse.yourArticleView =Geniverse.ArticleView.design({
    layout: { left: 5, top: 10, height: 220}
});
  
Geniverse.publishedArticlesView =  Geniverse.PublishedArticlesView.design({
    layout: { left: 5, top: 10, height: 220}
});
  
