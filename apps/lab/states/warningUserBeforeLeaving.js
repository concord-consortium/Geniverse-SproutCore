// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.warningUserBeforeLeaving =  Ki.State.extend({

  initialSubstate: 'dontWarnUser',

  enterState: function() {
  },

  exitState: function() {
  },

  dontWarnUser: Ki.State.design({
    enterState: function() {
      window.onbeforeunload = null;
    },
    
    warnUserBeforeLeaving: function() {
      this.gotoState('warnUser');
    }
  }),

  warnUser: Ki.State.design({

    enterState: function() {
      function askConfirm(){
        return "You have unsaved changes in your notepad. Are you sure you want to leave this page?";
      }
      window.onbeforeunload = askConfirm;
    },

    dontWarnUserBeforeLeaving: function() {
      this.gotoState('dontWarnUser');
    }

  })

});

