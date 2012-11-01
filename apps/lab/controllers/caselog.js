// ==========================================================================
// Project:   Lab
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse Ki */

sc_require('cases');

Lab.LEVEL_TRAINING   = 0;
Lab.LEVEL_APPRENTICE = 1;
Lab.LEVEL_JOURNEYMAN = 2;
Lab.LEVEL_MASTER     = 3;
Lab.LEVEL_MEIOSIS    = 4;
Lab.LEVEL_DNA        = 5;

Lab.caselogController = SC.Object.create({

  levelNames: ['training', 'apprentice', 'journeyman', 'master'],

  currentLevel: Lab.LEVEL_TRAINING,

  currentLevelName: function(key, value) {
    if (typeof value === 'undefined') {
      // get
      return this.get('levelNames')[this.get('currentLevel')];
    }
    else {
      this.set('currentLevel', this.levelNames.lastIndexOf(value));
    }
  }.property('currentLevel'),

  userMetadataBinding: 'Geniverse.userController.metadata',

  // Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].title                  == "Case 1: Enter the Drake"
  // Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].challenges[0].title    == "Playground"
  // Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].challenges[0].href     == "#case1/playground"
  // Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].challenges[0].starInfo == { stars: 1, useQuill: false }

  levels: function() {
    var levels    = Lab.caselogData.copy(),
        i, max_i, cases, j, max_j, challenges, k, max_k;

    for (i = 0, max_i = levels.length; i < max_i; i++) {
      cases = levels[i].cases;
      for (j = 0, max_j = cases.length; j < max_j; j++) {
        challenges = cases[j].challenges;

        for (k = 0, max_k = challenges.length; k < max_k; k++) {
          challenges[k].starInfo = this._getStarInfoForRoute(challenges[k]);
        }
      }
    }
    return levels;
  }.property('userMetadata').cacheable(),

  _getStarInfoForRoute: function(challenge) {

    var useQuill     = !!challenge.useQuill,
        activityId   = challenge.href.slice(challenge.href.lastIndexOf('#') + 1);

    return {
      stars:    Geniverse.userController.getPageStars(activityId),
      useQuill: useQuill
    };
  }

});

