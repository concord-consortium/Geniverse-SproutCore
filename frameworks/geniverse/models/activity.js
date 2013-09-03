// ==========================================================================
// Project:   Geniverse.Activity
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Geniverse.Activity = SC.Record.extend(
/** @scope Geniverse.Activity.prototype */ {

  title: SC.Record.attr(String,  { defaultValue: "Geniverse" }),

  baseChannelName: SC.Record.attr(String),

  maxUsersInRoom: SC.Record.attr(Number,  { defaultValue: 3 }),

  // we originally had 'initialAlleles' as an array. To speed up development on Rails, 'initialAlleles'
  // is now a string, and 'initialAllelesAsArray' on the controller converts that string to
  // an array. Eventually, the Rails back-end should support initialAlleles being an array

  initialAlleles: SC.Record.attr(String),   // a string in the form of "[{m: 'a:H,b:H',f: 'a:h,b:h'},{m: 'a:h,b:H',f: 'a:H,b:h'}]"

  matchDragonAlleles: SC.Record.attr(String),   // a string in the form of "[{m: 'a:H,b:H',f: 'a:h,b:h'},{m: 'a:h,b:H',f: 'a:H,b:h'}]"

  sendBredDragons: SC.Record.attr(Boolean, { defaultValue: NO }),

  route: SC.Record.attr(String),           //  e.g. heretity/training, heredity/apprentice/intro

  pageType: SC.Record.attr(String),           //  e.g. breedingPage

  hiddenGenes: SC.Record.attr(String),      // case-insensitive comma-separated alleles in json, e.g. {'female': 'h,w,s'}

  staticGenes: SC.Record.attr(String),      // case-insensitive comma-separated alleles in json, e.g. {'all': 'h,w,s'}

  crossoverWhenBreeding: SC.Record.attr(Boolean),

  message: SC.Record.attr(String), // info text (perhaps HTML formatted) for display when this activity is initialized

  isArgumentationChallenge: SC.Record.attr(Boolean, {defaultValue: NO}),    // whether chal. is solved by a blog post

  showTooltips: SC.Record.attr(Boolean, {defaultValue: NO}), // whether templates should show their tooltips

  myCase: SC.Record.toOne('Geniverse.Case'),
  myCaseOrder: SC.Record.attr(Number, { defaultValue: 1 }),

  currentSession: null
});

Geniverse.Activity.modelName = "activity";
Geniverse.Activity.modelsName = "activities";
Geniverse.Activity.readOnly = YES;

Geniverse.railsBackedTypes.push(Geniverse.Activity.modelName);
