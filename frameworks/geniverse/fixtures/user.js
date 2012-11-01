// ==========================================================================
// Project:   Geniverse.User Fixtures
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

sc_require('models/user');

Geniverse.User.FIXTURES = [

  // TODO: Add your data fixtures here.
  // All fixture records must have a unique primary key (default 'guid').  See
  // the example below.

  { guid: 1,
    username: "Tester",
    firstName: "Test",
    lastName: "er",
    groupId: 1,
    memberId: 1,
    note: "note"},
  { guid: 2,
    username: "student",
    firstName: "Jackie",
    lastName: "FIXTURES",
    groupId: 1,
    memberId: 1,
    note: "note",
    passwordHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
  //
  // { guid: 2,
  //   firstName: "Dwight",
  //   lastName: "Schrute" },
  //
  // { guid: 3,
  //   firstName: "Jim",
  //   lastName: "Halpert" },
  //
  // { guid: 4,
  //   firstName: "Pam",
  //   lastName: "Beesly" },
  //
  // { guid: 5,
  //   firstName: "Ryan",
  //   lastName: "Howard" }

];
