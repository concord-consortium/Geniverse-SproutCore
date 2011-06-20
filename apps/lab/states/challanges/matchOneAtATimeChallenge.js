// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

Lab.matchOneAtATimeChallenge = Ki.State.extend({
  
  successfulMatch: NO,
  
  organismView: null,
  
  enterState: function() { 
  },
  
  startTrial: function() {
    
  },
  
  revealClicked: function(buttonView) {
    this.organismView = buttonView.get('parentView');
    this._revealImage();
    
    if (this._drakesMatch()){
      this.successfulMatch = YES;
      SC.AlertPane.plain(
        "Good work!", 
        "The drake you have created matches the target drake.",
        "",
        "OK",
        "",
        this
      );
    } else {
      this.successfulMatch = NO;
      SC.AlertPane.error(
        "That's not the drake!", 
        "The drake you have created doesn't match the target drake. Please try again.",
        "",
        "Try again",
        "",
        this
      );
    }
  },
  
  _revealImage: function(){
    SC.RunLoop.begin();
      this.organismView.set('useRevealButton', NO);
    SC.RunLoop.end();
    
    this.organismView.get('imageView').notifyPropertyChange('valueNeedsRecalculated');
  },
  
  _hideImage: function(){
    SC.RunLoop.begin();
      this.organismView.set('useRevealButton', YES);
    SC.RunLoop.end();
    
    this.organismView.get('imageView').notifyPropertyChange('valueNeedsRecalculated');
  },
  
  alertPaneDidDismiss: function() {
    if (this.successfulMatch){
      
    } else {
      this._hideImage();
    }
  },
  
  _drakesMatch: function() {
    // placeholder...
    return NO;
  },
  
  exitState: function() { 
  }
  
});