// ==========================================================================
// Project:   Lab.logController
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*global Lab SC Geniverse*/

Lab.logController = SC.Object.create(
/** @scope Lab.avatarController.prototype */ {

  init: function () {
    this._attachDefaultListeners();
  },

  _session: null,

  startNewSession: function () {
    var session = this._generateGUID();
    this.set('_session', session);
    this.logEvent(Lab.EVENT.STARTED_SESSION);
    return session;
  },

  endSession: function () {
    this.logEvent(Lab.EVENT.ENDED_SESSION);
    this.set('_session', null);
  },

  /**
    Logs an event with optional parameters.

    The parameters can EITHER be an object containing the params, or, as a conventience,
    they can be an object controller and an array of property paths:

      Lab.logController.logEvent(Lab.EVENT.CHANGED_ALLELE,
        {allele: 'horns', newValue: 'H'});

      Lab.logController.logEvent(Lab.EVENT.USER_LOGGED_IN,
        Geniverse.userController, "username firstName".w());

    you can use a different name for the logged property key using 'key:property_path' like so

      Lab.logController.logEvent(Lab.EVENT.EXAMINED_GENOTYPE,
          Geniverse.chromosomeToolController, "alleles:dragon.alleles sex:dragon.sex".w());
  */
  logEvent: function (evt, params, paramNames) {
    var controller, date, logData, param, logKey, session, i, ii;

    if (paramNames) {
      controller = params;
      params = {};
      for (i = 0, ii = paramNames.length; i < ii; i++) {
        param = paramNames[i];
        logKey = param.split(":");
        if (logKey.length > 1){
          param   = logKey[1];
          logKey  = logKey[0];
        } else {
          logKey = param;
        }
        params[logKey] = controller.getPath(param);
      }
    }

    session = this.get('_session');
    if (!session) {
      session = this.startNewSession();
    }

    date = new Date();
    logData = {
      session     : session,
      time        : date.getTime(),
      prettyTime  : date.toString(),
      event       : evt,
      parameters  : params
    };

    // for now
    SC.Logger.group("Log Event");
    SC.Logger.info("Event: "+logData.event);
    SC.Logger.info(logData.parameters);
    SC.Logger.groupEnd();
  },

  _generateGUID: function () {
    function S4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4();
  },

  /**
    Since this is SproutCore, we can accomplish much of our logging
    via change listeners on various controllers.
  */
  _attachDefaultListeners: function () {
    Geniverse.activityController.addObserver('title', function() {
      if (Geniverse.activityController.get('title')) {
        Lab.logController.logEvent(Lab.EVENT.MOVED_TO,
          Geniverse.activityController, "title".w());
      }

      if (Geniverse.activityController.get('myCase')) {
        Lab.logController.logEvent(Lab.EVENT.STARTED_CHALLENGE,
          Geniverse.activityController, "title route case:myCase.order challenge:myCaseOrder".w());
      }
    });

    Geniverse.breedDragonController.addObserver('isBreeding', function() {
      if (Geniverse.breedDragonController.get('isBreeding')) {
        Lab.logController.logEvent(Lab.EVENT.BRED_DRAGONS,
          Geniverse.breedDragonController, "mother:mother.alleles father:father.alleles".w());
      }
    });

    Geniverse.chromosomeToolController.addObserver('dragon', function() {
      if (Geniverse.chromosomeToolController.get('dragon') &&
          Geniverse.chromosomeToolController.getPath("paneInstance") &&
          !Geniverse.chromosomeToolController.getPath("paneInstance.isDestroyed")) {
        Lab.logController.logEvent(Lab.EVENT.EXAMINED_GENOTYPE,
          Geniverse.chromosomeToolController, "alleles:dragon.alleles sex:dragon.sex".w());
      }
    });

    Geniverse.meiosisAnimationController.addObserver('mother', function() {
      if (Geniverse.meiosisAnimationController.get('mother')) {
        Lab.logController.logEvent(Lab.EVENT.SELECTED_PARENT,
            Geniverse.meiosisAnimationController, 'alleles:mother.alleles sex:mother.sex'.w());
      }
    });
    Geniverse.meiosisAnimationController.addObserver('father', function() {
      if (Geniverse.meiosisAnimationController.get('father')) {
        Lab.logController.logEvent(Lab.EVENT.SELECTED_PARENT,
            Geniverse.meiosisAnimationController, 'alleles:father.alleles sex:father.sex'.w());
      }
    });
    Geniverse.meiosisAnimationController.addObserver('offspring', function() {
      if (Geniverse.meiosisAnimationController.get('offspring')) {
        Lab.logController.logEvent(Lab.EVENT.PRODUCED_OFFSPRING_BY_MEIOSIS,
            Geniverse.meiosisAnimationController, 'alleles:offspring.alleles sex:offspring.sex'.w());
      }
    });


  }

}) ;
