// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki gotoState*/

Lab.inActivity = Ki.State.extend({

  substatesAreConcurrent: YES,

  myCase: null,

  challengeState: Ki.State.design({
    substatesAreConcurrent: NO,

    initialSubstate: 'initialChallenge',
    argumentationChallenge: Ki.State.plugin('Lab.argumentationChallenge'),
    matchOneAtATimeChallenge: Ki.State.plugin('Lab.matchOneAtATimeChallenge'),
    matchThreeToOneChallenge: Ki.State.plugin('Lab.matchThreeToOneChallenge'),
    matchTargetDrakesListChallenge: Ki.State.plugin('Lab.matchTargetDrakesListChallenge'),
    matchTargetDrakesOneAtATimeChallenge: Ki.State.plugin('Lab.matchTargetDrakesOneAtATimeChallenge'),
    chromosomeBreedingOneAtATimeChallenge: Ki.State.plugin('Lab.chromosomeBreedingOneAtATimeChallenge'),
    invisibleGenotypeChallenge: Ki.State.plugin('Lab.invisibleGenotypeChallenge'),
    selectParentsChallenge: Ki.State.plugin('Lab.selectParentsChallenge'),
    defaultChallenge: Ki.State.plugin('Lab.defaultChallenge'),
    initialChallenge: Ki.State.plugin('Lab.initialChallenge'),
    firstMeiosisWithMatchTarget: Ki.State.plugin('Lab.firstMeiosisWithMatchTarget'),

    currentChallenge: null
  }),

  showingIntroScreen: Ki.State.plugin('Lab.showingIntroScreen'),

  enterState: function() {
    // gotoActivity needs to be invoked here via sendAction, not as a direct method call.

    // That's because this state isn't fully transitioned to until some time after this enterState method completes.
    // gotoState actions (which occur during the body of gotoActivity, when we revisit an already-loaded activity) have
    // unexpected behavior if called *during* enterState (i.e. when the state transition that resulted in enterState
    // execution is still in progress.)

    // In particular, calling gotoState(..) to one of our substates will not work here because *this state* is not
    // yet considered "current". Because the incorrect pivot state "loggedIn" has concurrent substates, the pivot state
    // will be thrown and the gotoState won't occur correctly (meaning we'll be in the wrong challenge state.)

    // Sending the statechart event 'gotoActivity' is perfectly valid here, though. It will *queue* the gotoActivity
    // action for completion when the current state transition completes.
    this.get('statechart').sendAction('gotoActivity');
  },

  lastNavigation: 0,

  // A statechart action
  gotoActivity: function() {
    // FIXME This is a hack to get around the fact that when you navigate using the bottom_bar arrows,
    // it triggers gotoActivity *twice*.
    var t = new Date().getTime();
    if ((t - this.lastNavigation) > 2000) {
      this.lastNavigation = t;

      SC.RunLoop.begin();
      Geniverse.activityController.set('content', null);
      SC.RunLoop.end();

      if (Geniverse.activityController.get('status') & SC.Record.READY) {
        this._activityLoaded();
      } else {
        Geniverse.activityController.addObserver('content', this, this._activityLoaded);
      }

      Lab.ACTIVITY.gotoActivity();
    }
    // Indicate that we handled 'gotoActivity' action so that our parent state (atLocation) doesn't try to handle it.
    return YES;
  },

  // Not a statechart action.
  _activityLoaded: function() {
    Geniverse.activityController.removeObserver('content', this, this._activityLoaded);

    Lab.ACTIVITY.set('LOAD_CHALLENGE_DRAKES', NO);     // set this here, it may get overrided by a challenge. New default is NO

    var pageType = Geniverse.activityController.get('pageType');
    var challengeType = Lab[pageType].get('challengeType');

    if (Geniverse.activityController.get('isArgumentationChallenge')) {
      this.get('challengeState').gotoState('argumentationChallenge');
    } else if (challengeType) {
      this.get('challengeState').gotoState(challengeType);
    } else if (eval(Geniverse.activityController.get('matchDragonAlleles'))) {
      this.get('challengeState').gotoState('matchTargetDrakesListChallenge');
    } else {
      this.get('challengeState').gotoState('defaultChallenge');
    }

    this._setupGenomeDragons(pageType);

    if (Geniverse.activityController.get('myCase')) {
      if (Geniverse.activityController.getPath('myCase.status') & SC.Record.READY) {
        this._caseLoaded();
      } else {
        this.myCase = Geniverse.activityController.get('myCase');
        this.myCase.addObserver('status', this, this._caseLoaded);
      }
    }
  },

  _setupGenomeDragons: function(pageType) {
    switch (pageType) {
      case 'chromosomeChallengePage':
      case 'chromosomeTrainingSinglePage':
        Geniverse.dragonGenomeController.initDragonForView(1, 1, true);
        break;
      case 'chromosomeBreedingPage':
      case 'chromosomeBreedingChallengePage':
      case 'chromosomeTrainingPage':
      case 'invisibleMaleGenotypePage':
      case 'invisibleFemaleGenotypePage':
      case 'chromosomeBreedingSelectParentsPage':
        Geniverse.dragonGenomeController.initDragonForView(1, 1, true);
        Geniverse.dragonGenomeController.initDragonForView(2, 0, true);
        break;
      case 'chromosomeTripleChallengePage':
        Geniverse.dragonGenomeController.initDragonForView(1, 1, true);
        Geniverse.dragonGenomeController.initDragonForView(2, 1, true);
        Geniverse.dragonGenomeController.initDragonForView(3, 1, true);
        break;
    }
  },

  // Not a statechart action.
  _caseLoaded: function() {
    if (this.myCase) {
      this.myCase.removeObserver('status', this, this._caseLoaded);
    }

    if (Geniverse.activityController.getPreviousActivity()) {
      this.get('statechart').sendAction('enablePreviousNavButton');
    } else {
      this.get('statechart').sendAction('disablePreviousNavButton');
    }

    if (Geniverse.activityController.getNextActivity()) {
      this.get('statechart').sendAction('enableNextNavButton');
    } else {
      this.get('statechart').sendAction('disableNextNavButton');
    }

    var myCase = Geniverse.activityController.get('myCase');
    if (Geniverse.activityController.get('myCaseOrder') === 1) {
      var imageUrl = myCase.get('introImageUrl');
      if (imageUrl) {
        if (imageUrl.length > 5) {
          this.get('showingIntroScreen').gotoState('showingIntroScreenPanel');
        }
      }
    }
  },

  enablePreviousNavButton: function() {
    Lab.navigationController.set('showPreviousButton', true);
  },

  enableNextNavButton: function() {
    Lab.navigationController.set('showNextButton', true);
  },

  disablePreviousNavButton: function() {
    Lab.navigationController.set('showPreviousButton', false);
  },

  disableNextNavButton: function() {
    Lab.navigationController.set('showNextButton', false);
  },

  blockNextNavButton: function() {
    Lab.navigationController.set('blockNextButton', true);
  },

  unblockNextNavButton: function() {
    Lab.navigationController.set('blockNextButton', false);
  },

  gotoNextActivity: function() {
    this.get('statechart').sendAction('unblockNextNavButton');
    var next = Geniverse.activityController.getNextActivity();
    if (next){
      SC.routes.set('location', next.get('route'));
    }
  },

  gotoPreviousActivity: function() {
    this.get('statechart').sendAction('unblockNextNavButton');
    var previous = Geniverse.activityController.getPreviousActivity();
    if (previous){
      SC.routes.set('location', previous.get('route'));
    }
  },

  repeatChallenge: function() {
   this.gotoActivity();
  },

  gotoHomePage: function() {
    Lab.statechart.getState('atLocation').startPage = "home";
    this.gotoState('inHomePage');
  },

  gotoAvatarPage: function() {
    Lab.statechart.getState('atLocation').startPage = "avatar";
    this.gotoState('inAvatar');
  },

  gotoEndingHub: function() {
    Lab.statechart.getState('atLocation').startPage = 'endingHub';
    this.gotoState('inEndingHub');
  },

  QTipStyle: {
    width: {
      max: 350
    },
    padding: '14px',
    border: {
      width: 1,
      radius: 5,
      color: '#b68b5a'
    },
    name: 'light',
    backgroundColor: '#f4eed3'
  },

  // Shows a tooltip on a jquery element, with a given text and options.
  // The options hash can specify a target (topLeft, leftMiddle, etc), a tooltip
  // (same values but for the tail of the tooltip), a maxWidth and a hideAction.
  // For convenience, if the $elem has title text then the tooltip will use that,
  // and if it has the classes 'hint-target-*' or 'hint-tooltip-*' it will pass
  // the * values as the appropriate options.
  showTooltip: function($elem, text, options) {
    var backdrop, config, style, classes, elemClass, i,
        opts      = options || {};
        target    = opts.target     || "leftMiddle",
        tooltip   = opts.tooltip    || "rightMiddle",
        maxWidth  = opts.maxWidth   || 280,
        text      = text || $elem.attr("title");

    if (!text) {
      return;
    }

    classes = $elem.attr('class').split(/\s+/);
    for (i = 0; i < classes.length; i++) {
      elemClass = classes[i];
      if (/hint-target-(.*)/.exec(elemClass)) {
        target = /hint-target-(.*)/.exec(elemClass)[1];
      } else if (/hint-tooltip-(.*)/.exec(elemClass)) {
        tooltip = /hint-tooltip-(.*)/.exec(elemClass)[1];
      }
    }

    style = SC.clone(this.QTipStyle, true);
    style.tip = tooltip;
    style.width = {
      max: maxWidth
    };
    config = {
      content: {
        title: {
          text: ''
        },
        text: text
      },
      position: {
        corner: {
          target: target,
          tooltip: tooltip
        }
      },
      show: {
        ready: true,
        solo: false,
        effect: { type: 'fade', length: 800 }
      },
      hide: {
        effect: { type: 'fade' }
      },
      style: style,
      api: {
        onRender: function() {
          this.elements.tooltip.click(this.hide);
        }
      }
    };
    if (opts.hideAction != null) {
      config.api.onHide = opts.hideAction;
    }
    return $elem.qtip(config);
  },

  showAllTooltips: function(elemClass) {
    var selection = $("."+elemClass),
        self = this;
    selection.each(function(){
      Lab.get('statechart').sendAction("showTooltip", $(this));
    });
  },

  exitState: function() {
    // Make sure any observers we might have added during in state are removed.

    // TODO implement methods to remember which observers we have added to which objects, and to remove them later.
    // (called perhaps this.pushObserver, this.cancelObserver, and this.cancelAllObservers)
    // These would be useful for managing observer lifecycle within any Ki.State.
    Geniverse.activityController.removeObserver('content', this, this._activityLoaded);
    if (this.myCase) {
      this.myCase.removeObserver('status', this, this._caseLoaded);
      this.myCase = null;
    }
  }

});
