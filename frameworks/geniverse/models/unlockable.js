// ==========================================================================
// Project:   Geniverse.Unlockable
// Copyright: ©2012 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Geniverse.Unlockable = SC.Record.extend(
/** @scope Geniverse.Unlockable.prototype */ {
  content: SC.Record.attr(String),
  trigger: SC.Record.attr(String),
  unlocked: SC.Record.attr(Boolean, { defaultValue: NO }),
  viewed: SC.Record.attr(Boolean, { defaultValue: NO })
});

Geniverse.Unlockable.modelName = "unlockable";
Geniverse.Unlockable.modelsName = "unlockables";
Geniverse.Unlockable.readOnly = YES;
Geniverse.railsBackedTypes.push(Geniverse.Unlockable.modelName);
