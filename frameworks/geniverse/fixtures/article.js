// ==========================================================================
// Project:   Geniverse.Article Fixtures
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

sc_require('models/article');

Geniverse.Article.FIXTURES = [

  // TODO: Add your data fixtures here.
  // All fixture records must have a unique primary key (default 'guid').  See 
  // the example below.

  { guid: 1,
    group: 1,
    activity: [1],
    text: "<div class='claim'>Paper for group 1 in activity 1</div>",
    // dragons: ,
    submitted: NO,
    published: NO },
  
  { guid: 2,
    group: 2,
    activity: [1],
    text: "<div class='claim'>Published Paper for group 2 in activity 1</div>",
    // dragons: ,
    submitted: YES,
    published: YES }
    
    
    
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
