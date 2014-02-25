// ==========================================================================
// Project:   Lab.logController
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*global Lab SC Geniverse SyncTime $ console setInterval sc_require*/

sc_require('lib/sync_time');

Lab.logController = SC.Object.create(
/** @scope Lab.avatarController.prototype */ {

  init: function () {
    this._attachDefaultListeners();
  },

  _session: null,

  learnerDataUrl: null,

  syncTime: new SyncTime('/portal/time'),
  eventQueue: [],
  eventQueueInProgress: [],

  startNewSession: function () {
    var session = this._generateGUID();
    this.set('_session', session);
    this.logEvent(Lab.EVENT.STARTED_SESSION);
    this._startEventQueuePolling();
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
    var controller, date, eventData, param, logKey, session, i, ii;

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

    var sync = this.get('syncTime');
    date = sync ? sync.now() : new Date();
    var drift = sync ? sync.drift : null;
    eventData = {
      session     : session,
      time        : date.getTime(),
      prettyTime  : date.toString(),
      timeDrift   : drift,
      event       : evt,
      parameters  : params
    };

    // for now
    SC.Logger.group("Log Event");
    SC.Logger.info("Event: "+eventData.event);
    SC.Logger.info(eventData.parameters);
    SC.Logger.groupEnd();

    this._persistEvent(eventData);
  },

  _persistEvent: function(evt) {
    var self = this,
        url  = this.get('learnerDataUrl');
    if (url) {
      $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(evt),
        dataType: 'text',
        success: function() {
          console.log('log event saved');
          // only unset url when we have successfully logged final event of the session
          if (evt.event == Lab.EVENT.ENDED_SESSION) {
            self.set('learnerDataUrl', null);
          }
        },
        error: function() {
          console.log('log event save failed!');
          self.eventQueue.push(evt);
        }
      });
    } else {
      console.log('log event generated (no saving)', evt);
      return this.eventQueue.push(evt);
    }
  },

  _learnerDataUrlChanged: function() {
    this._processEventQueue();
  }.observes('learnerDataUrl'),

  _startEventQueuePolling: function() {
    var self = this;
    setInterval(function() {
      if (self.eventQueueInProgress.length === 0) {
        self._processEventQueue();
      }
    }, 10000);
  },

  _processEventQueue: function() {
    var evt;
    if (this.get('learnerDataUrl') && this.eventQueue.length > 0) {
      this.eventQueueInProgress = this.eventQueue.slice(0);
      this.eventQueue = [];
      while (this.eventQueueInProgress.length > 0) {
        evt = this.eventQueueInProgress.shift();
        this._persistEvent(evt);
      }
    }
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
        var cazePath = /[^\/]*$/.exec(Geniverse.activityController.getPath('myCase.id')),
            caze = cazePath.length ? parseInt(cazePath[0]) : null;
        Lab.logController.logEvent(Lab.EVENT.STARTED_CHALLENGE,
            {
              title: Geniverse.activityController.get('title'),
              route: Geniverse.activityController.get('route'),
              "case": caze,
              challenge: Geniverse.activityController.get('myCaseOrder')
            });
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
