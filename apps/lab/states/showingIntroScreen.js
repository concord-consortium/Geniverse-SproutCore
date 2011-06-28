// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.showingIntroScreen =  Ki.State.extend({

  initialSubstate: 'introScreenReady',

  enterState: function() {
  },

  exitState: function() {
  },

  introScreenReady: Ki.State.design({
    showIntroScreenPanel: function() {
      this.gotoState('showingIntroScreenPanel');
    }
  }),

  showingIntroScreenPanel: Ki.State.design({

    enterState: function() {
      this.set('infoPaneShouldBeHidden', YES);
      this.introScreenView = Geniverse.IntroScreenView.create();
      this.introScreenView.append();
    },

    exitState: function() {
      this.introScreenView.remove();
      this.set('infoPaneShouldBeHidden', NO);
      Lab.infoController.showPane();
    },

    closePanel: function() {
      this.gotoState('introScreenReady');
    },

    infoPaneShouldBeHidden: NO,
    infoPaneIsVisibleBinding: 'Lab.infoController*pane.isVisibleInWindow',
    infoPaneVisibilityDidChange: function() {
      if (this.infoPaneShouldBeHidden) {
        Lab.infoController.removeView();
      }
    }.observes('infoPaneIsVisible', 'infoPaneShouldBeHidden')

  })

});

