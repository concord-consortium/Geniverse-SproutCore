// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.loadingData = Ki.State.extend({
  
  hasLoadedActivityData: NO,
  
  enterState: function() { 
    this.set('hasLoadedActivityData', NO);
    
    if (Geniverse.gwtController.get('isReady')){
      this.initActivity();
    } else {
      Geniverse.gwtController.addObserver('isReady', this, 'initActivity');
    }
  },
  
  startTrial: function() {
    // placeholder
  },
  
  exitState: function() { 
  }
  
});