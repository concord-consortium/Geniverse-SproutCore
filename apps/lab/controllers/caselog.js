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
  }.property('currentLevel'),
  
  activities: Geniverse.store.find(Geniverse.ACTIVITIES_QUERY),
  
  activityStatusDidChange: function() {
    if (this.getPath('activities.status') & SC.Record.READY) {
      this.notifyPropertyChange('routes');
    }
  }.observes('.activities.status'),
  
  routes: function() {
    return this.get('activities').getEach('route');
  }.property('activity').cacheable(),
  
  userMetadataBinding: 'Geniverse.userController.metadata',  
  
  // Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].title                  == "Case 1: Enter the Drake"
  // Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].challenges[0].title    == "Playground"
  // Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].challenges[0].href     == "#case1/playground"
  // Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases[0].challenges[0].starInfo == { stars: 1, useQuill: false }
  
  levels: function() {
    var ret    = Lab.caselogData.copy(),
        routes = this.get('routes'),
        i, max_i, cases, j, max_j, challenges, k, max_k;
        
    if (routes.get('length') > 0) {
      for (i = 0, max_i = ret.length; i < max_i; i++) {
        cases = ret[i].cases;
        for (j = 0, max_j = cases.length; j < max_j; j++) {
          challenges = cases[j].challenges;
          
          for (k = 0, max_k = challenges.length; k < max_k; k++) {
            challenges[k].starInfo = this._getStarInfoForRoute(challenges[k].href);
          }
        }
      }
    }

    return ret;
  }.property('routes', 'userMetadata').cacheable(),

  _getStarInfoForRoute: function(route) {
    route = route.slice(route.lastIndexOf('#') + 1);

    var userMetadata = this.get('userMetadata') || {},
        stars        = userMetadata.stars || {},
        activities   = this.get('activities'),
        activity     = activities.filterProperty('route', route)[0],
        activityId   = activity && activity.get('id'),
        useQuill     = activity && activity.get('isArgumentationChallenge'),
        activityStarsList = stars[activityId] || [];
    
    return {
      stars:    activityStarsList.lastObject() || 0,
      useQuill: !!useQuill     // want this coerced to a Boolean
    };
  }

});

