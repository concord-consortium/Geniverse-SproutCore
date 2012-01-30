// ==========================================================================
// Project:   Lab
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse Ki */

sc_require('resources/caselog/cases');

Lab.LEVEL_TRAINING   = 0;
Lab.LEVEL_APPRENTICE = 1;
Lab.LEVEL_JOURNEYMAN = 2;
Lab.LEVEL_MASTER     = 3;

Lab.caselogController = SC.Object.create({
  levels: Lab.caselogData
});

// e.g., 
//
// Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].title               == "Case 1: Enter the Drake"
// Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].challenges[0].title == "Playground"
// Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].challenges[0].href  == "#case1/playground"
