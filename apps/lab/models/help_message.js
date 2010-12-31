// ==========================================================================
// Project:   Lab.HelpMessage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */

/** @class

  A simple mapping of a pageName to a message to show when a user clicks the Help button.

 @extends SC.Record
 @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 @version 0.1
 */
Lab.HelpMessage = SC.Record.extend(
  /** @scope Lab.HelpMessage.prototype */ {
  pageName: SC.Record.attr(String),
  message: SC.Record.attr(String)
});

Lab.HelpMessage.modelName = "help_message";
Lab.HelpMessage.modelsName = "help_messages";

Geniverse.railsBackedTypes.push(Lab.HelpMessage.modelName);
//console.warn("Called Geniverse.railsBackedTypes.push(Lab.HelpMessage.modelName);",
//  Geniverse.railsBackedTypes);
