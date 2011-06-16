// ==========================================================================
// Project:   Geniverse.Case
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Geniverse.Case = SC.Record.extend(
/** @scope Geniverse.Case.prototype */ {
  name: SC.Record.attr(String),
  order: SC.Record.attr(Number, { defaultValue: 1 }),
  activities: SC.Record.toMany("Geniverse.Activity", { inverse: 'myCase' })
});

Geniverse.Case.modelName = "case";
Geniverse.Case.modelsName = "cases";
Geniverse.railsBackedTypes.push(Geniverse.Case.modelName);
