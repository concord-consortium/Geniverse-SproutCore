// ==========================================================================
// Project:   Geniverse.Article
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Geniverse.Article = SC.Record.extend(
/** @scope Geniverse.Article.prototype */ {
  
  group: SC.Record.attr(Number),        // for now, just the number. We may later want a group model
  
  activity: SC.Record.toOne('Geniverse.Activity'),        // which activity the paper belogs to. Can only be in one
  
  text: SC.Record.attr(String),
  
  dragons: SC.Record.toMany('Geniverse.Dragon', { 
    inverse: 'articles', isMaster: NO 
  }),
  
  time: SC.Record.attr(Number),
  
  submitted: SC.Record.attr(Boolean, { defaultValue: NO }),   // submitted to teacher
  
  teacherComment: SC.Record.attr(String),
  
  accepted: SC.Record.attr(Boolean, { defaultValue: NO })     // accepted by teacher

});

Geniverse.Article.modelName = "article";
Geniverse.Article.modelsName = "articles";

Geniverse.railsBackedTypes.push(Geniverse.Article.modelName);

// TODO enable if we want to use the automated rails backend code to persist changes to activities
// Geniverse.railsBackedTypes.push(Geniverse.Article.modelName);