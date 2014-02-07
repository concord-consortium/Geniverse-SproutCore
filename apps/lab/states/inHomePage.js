// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.inHomePage = Ki.State.extend({
  dummyActivity: null,

  enterState: function() {
    var dummy = this.get('dummyActivity');
    if (!dummy) {
      dummy = Geniverse.store.createRecord(Geniverse.Activity, {
        title: "Office"
      });
      this.set('dummyActivity', dummy);
    }
    Geniverse.activityController.set('content', dummy);
    Lab.routes.gotoLabRoute({pageName: 'mainPage'});
    setTimeout( function() {
      Lab.statechart.sendAction('showAllTooltips', 'office-hint-available');
      setTimeout( function() {
        $(".qtip").fadeOut();
      },3500);
    },1500);
  },

  // Shows a tooltip on a jquery element, with a given text and options.
  // The options hash can specify a target (topLeft, leftMiddle, etc), a tooltip
  // (same values but for the tail of the tooltip), a maxWidth and a hideAction.
  // For convenience, if the $elem has title text then the tooltip will use that,
  // and if it has the classes 'hint-target-*' or 'hint-tooltip-*' it will pass
  // the * values as the appropriate options.
  showTooltip: function($elem, text, options) {

    if (!$elem.attr("alt")) {
      $elem.attr("alt", $elem.attr("title"));
    }

    var backdrop, config, style, classes, elemClass, i,
        opts      = options || {};
        target    = opts.target     || "leftMiddle",
        tooltip   = opts.tooltip    || "rightMiddle",
        maxWidth  = opts.maxWidth   || 280,
        text      = text || $elem.attr("alt"),
        dark      = false;

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
      } else if (/hint-dark/.exec(elemClass)) {
        dark = true;
      }
    }

    style = {
      width: {
        min: 240
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

    $elem.attr('title', '');  // rm title attribute so we don't see it as well

    return $elem.qtip(config);
  },

  showAllTooltips: function(elemClass) {
    // Rm any created tooltips
    $(".qtip").remove();

    var selection = $("."+elemClass),
        self = this;
    selection.each(function(){
      self.showTooltip($(this));
    });
  },

  exitState: function() {
  }

});
