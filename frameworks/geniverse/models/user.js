// ==========================================================================
// Project:   Geniverse.User
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Geniverse.User = SC.Record.extend(
/** @scope Geniverse.User.prototype */ {

  username: SC.Record.attr(String),
  passwordHash: SC.Record.attr(String),
  firstName: SC.Record.attr(String),
  lastName: SC.Record.attr(String),
  groupId: SC.Record.attr(Number),
  memberId: SC.Record.attr(Number),
  note: SC.Record.attr(String),
  avatar: SC.Record.attr(String),
  metadata: SC.Record.attr(Object),
  className: SC.Record.attr(String)           // for now a student "owns" both group and class. Really they should belong to them...
});

Geniverse.User.modelName = "user";
Geniverse.User.modelsName = "users";
Geniverse.User.readOnly = NO;

Geniverse.railsBackedTypes.push(Geniverse.User.modelName);
