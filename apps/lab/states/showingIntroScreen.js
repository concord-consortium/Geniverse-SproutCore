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
      this.introScreenView = Geniverse.IntroScreenView.create();
      this.introScreenView.append();
    },

    exitState: function() {
      this.introScreenView.remove();
    },

    closePanel: function() {
      this.gotoState('introScreenReady');
    }
  })

});

