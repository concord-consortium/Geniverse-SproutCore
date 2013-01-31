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
  title: SC.Record.attr(String, { defaultValue: "No title" }),
  content: SC.Record.attr(String),
  trigger: SC.Record.attr(String),
  openAutomatically: SC.Record.attr(Boolean, { defaultValue: NO }),
  unlocked: SC.Record.attr(Boolean, { defaultValue: NO }),
  viewed: SC.Record.attr(Boolean, { defaultValue: NO }),

  icon: function() {
    if (this.get('viewed')) {
      return '';
    }
    return 'icon-unviewed-16';
  }.property('viewed')
});

Geniverse.Unlockable.modelName = "unlockable";
Geniverse.Unlockable.modelsName = "unlockables";
Geniverse.Unlockable.readOnly = YES;
Geniverse.railsBackedTypes.push(Geniverse.Unlockable.modelName);
