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
Lab.LEVEL_MEIOSIS    = 4;
Lab.LEVEL_DNA        = 5;

Lab.caselogController = SC.Object.create({
  
  levels: Lab.caselogData,

  levelNames: ['training', 'apprentice', 'journeyman', 'master', 'meiosis', 'dna'],
  
  currentLevel: Lab.LEVEL_TRAINING,
  
  currentLevelName: function(key, value) {
    if (typeof value === 'undefined') {
      // get
      return this.get('levelNames')[this.get('currentLevel')]; 
    }
    else {
      this.set('currentLevel', this.levelNames.lastIndexOf(value));
    }
  }.property('currentLevel')

});

// e.g., 
//
// Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].title               == "Case 1: Enter the Drake"
// Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].challenges[0].title == "Playground"
// Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].challenges[0].href  == "#case1/playground"
