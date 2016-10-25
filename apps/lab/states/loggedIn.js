// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.loggedIn = Ki.State.extend({

  substatesAreConcurrent: YES,

  atLocation: Ki.State.design({

    substatesAreConcurrent: NO,
    initialSubstate: 'empty',

    inHomePage: Ki.State.plugin('Lab.inHomePage'),
    inActivity: Ki.State.plugin('Lab.inActivity'),
    inCaselog:  Ki.State.plugin('Lab.inCaselog'),
    inAvatar:   Ki.State.plugin('Lab.inAvatar'),
    inEndingHub: Ki.State.plugin('Lab.inEndingHub'),

    empty: Ki.State.design(),

    startPage: null,

    enterState: function() {
      avatar = Geniverse.userController.get('avatar');
      if (typeof(avatar) == "undefined" || avatar === null || avatar === "") {
        Lab.statechart.getState('atLocation').startPage = 'avatar';
      }

      this.get('statechart').sendAction('gotoRequestedPage');
    },

    gotoHomePage: function() {
      this.startPage = 'home';
      this.get('statechart').sendAction('gotoRequestedPage');
    },

    gotoCaselog: function() {
      this.startPage = 'caselog';
      this.get('statechart').sendAction('gotoRequestedPage');
    },

    gotoActivity: function() {
      this.startPage = 'activity';
      this.get('statechart').sendAction('gotoRequestedPage');
    },

    gotoAvatarPage: function() {
      this.startPage = 'avatar';
      this.get('statechart').sendAction('gotoRequestedPage');
    },

    gotoEndingHub: function() {
      this.startPage = 'endingHub';
      this.get('statechart').sendAction('gotoRequestedPage');
    },

    gotoRequestedPage: function() {
      switch (this.startPage || 'home') {
        case 'home':
          this.gotoState('inHomePage');
          break;
        case 'caselog':
          this.gotoState('inCaselog');
          break;
        case 'activity':
          this.gotoState('inActivity');
          break;
        case 'avatar':
          this.gotoState('inAvatar');
          break;
        case 'endingHub':
          this.gotoState('inEndingHub');
          break;
        default:
          throw new Error(
            "Lab.statechart.loggedIn.atLocation.startPage was set to an unexpected value, '%@'".fmt(this.startPage));
      }
    },

    exitState: function() {
      // clear start page
      this.startPage = null;
    }

  }),

  enterState: function() {
    /** WARNING MESSAGE **/

    // reveal warning message
    $('#demo-warning').delay(1000).animate({'top': 0});

    $('.dismiss-warning').click(function(){
      $(this).parent().animate({'top': '-40px'});
    });

  },

  showingBlogButton: Ki.State.plugin('Lab.showingBlogButton'),

  warningUserBeforeLeaving: Ki.State.plugin('Lab.warningUserBeforeLeaving'),

  logOut: function() {
    $.removeCookie("avatar");
    SC.Request.postUrl(Lab.loginController.logoutUrl,null).header({'Accept': 'application/json'}).json()
      .notify(this, function(){
        Lab.statechart.gotoState('loggedOut');
        })
      .send();

    // rm cookies and blank user object
    Lab.loginController.logout();
  },

  enterState: function() {
    Lab.logController.logEvent(Lab.EVENT.USER_LOGGED_IN, Geniverse.userController,
      "username firstName lastName className".w());
  },

  exitState: function() {
    Lab.logController.logEvent(Lab.EVENT.USER_LOGGED_OUT);
    Lab.logController.endSession();
    // clear fragment identifier from navigation bar
    SC.routes.set('location', '');
    if (history && history.pushState) {
      history.pushState('', document.title, window.location.pathname);
    } else {
      // this notifies app of statechange so is not as good...
      window.location.hash = '';
    }
  },

  // *** tooltip-related functions ***
    // Shows a tooltip on a jquery element, with a given text and options.
  // The options hash can specify a target (topLeft, leftMiddle, etc), a tooltip
  // (same values but for the tail of the tooltip), a maxWidth and a hideAction.
  // For convenience, if the $elem has title text then the tooltip will use that,
  // and if it has the classes 'hint-target-*' or 'hint-tooltip-*' it will pass
  // the * values as the appropriate options.
  showTooltip: function($elem, text, options) {
    if (!Geniverse.activityController.getPath('content.showTooltips') &&
        Geniverse.activityController.getPath('content.title') !== "Office") return;

    if (!$elem.attr("alt")) {
      $elem.attr("alt", $elem.attr("title"));
    }

    var backdrop, config, style, classes, elemClass, i,
        opts      = options || {};
        target    = opts.target     || "leftMiddle",
        tooltip   = opts.tooltip    || "rightMiddle",
        maxWidth  = opts.maxWidth   || 250,
        text      = text || $elem.attr("alt"),
        dark      = false,
        showOnReady = opts.showOnReady == null ? true : opts.showOnReady;

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
      } else if (/hint-max-width-(.*)/.exec(elemClass)) {
        maxWidth = /hint-max-width-(.*)/.exec(elemClass)[1];
      } else if (/hint-dark/.exec(elemClass)) {
        dark = true;
      }
    }

    var minWidth = Math.min(maxWidth, 240)

    style = {
      width: {
        min: minWidth,
        max: maxWidth
      },
      padding: '14px',
      border: {
        width: 0,
        radius: 2,
        color: '#FFF'
      },
      color: '#FFF'
    };
    style.tip = tooltip;
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
        delay: 800,
        ready: showOnReady,
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

    $elem.attr('title', '');  // rm title attribute so we don't see it as well

    return $elem.qtip(config);
  },

  showAllTooltips: function(elemClass) {
    // Rm any created tooltips
    $(".qtip").hide();

    var selection = $("."+elemClass),
        self = this;
    selection.each(function(){
      self.showTooltip($(this));
    });

    hideListener = function() {
      $(".qtip").hide();
      $('body').unbind('mousedown', hideListener);
    }
    $('body').bind('mousedown', hideListener)
  },

  registerAllTooltips: function(elemClass) {
    var selection = $("."+elemClass),
        self = this;
    selection.each(function(){
      self.showTooltip($(this), null, {showOnReady: false});
    });
  }

});
