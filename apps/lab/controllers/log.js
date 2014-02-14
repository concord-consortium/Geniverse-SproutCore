// ==========================================================================
// Project:   Lab.logController
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*global Lab SC console*/

Lab.logController = SC.Object.create(
/** @scope Lab.avatarController.prototype */ {

  _session: null,

  startNewSession: function () {
    var session = this.generateGUID();
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
    they can be an object controller and an array of property strings:

      Lab.logController.logEvent(Lab.EVENT.CHANGED_ALLELE, {allele: 'horns', newValue: 'H'});

      Lab.logController.logEvent(Lab.EVENT.USER_LOGGED_IN, Geniverse.userController, "username firstName".w());
  */
  logEvent: function (evt, params, paramNames) {
    var controller, date, logData, param, session, i, ii;

    if (paramNames) {
      controller = params;
      params = {};
      for (i = 0, ii = paramNames.length; i < ii; i++) {
        param = paramNames[i];
        params[param] = controller.get(param);
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

  generateGUID: function () {
    function S4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4();
  }

}) ;
