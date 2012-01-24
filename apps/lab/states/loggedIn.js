// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki*/

Lab.loggedIn = Ki.State.extend({
  
  substatesAreConcurrent: YES,
  
  atLocation: Ki.State.design({
    
    substatesAreConcurrent: NO,
    
    inHomePage: Ki.State.plugin('Lab.inHomePage'),
    inActivity: Ki.State.plugin('Lab.inActivity'),
    inCaselog:  Ki.State.plugin('Lab.inCaselog'),

    startPage: null,
    
    enterState: function() {
      this.gotoRequestedSubstate();
    },
      
    gotoRequestedSubstate: function() { 
      // Ki can be infuriating. What the following does is find the state which is "current" from the set of
      // atLocation + its descendant states. Without this incantation, Ki doesn't "focus" the transition requested by
      // this.gotoState('inHomePage') only to the state represented by 'this'. That is to say, instead of 
      // switching the current *substate* of 'atLocation' from 'inActivity' (or its substates) to 'inHomePage',
      // this.gotoState('inHomePage') tries to transition from showingBlogButton to inHomePage, also from 
      // warningUserBeforeLeaving to inHomePage ...and these are invalid state transitions as described in
      // http://frozencanuck.wordpress.com/2011/02/22/ki-concurrent-states-and-the-pivot-state-error-what-to-do/
      // (The complaint here is that there's no reason to think the incantation 'this.gotoState('inHomePage')' should
      // have any effect at all on the substates that are *concurrent* to 'this', which is the 'atLocation' state. One
      // would think it leaves them alone, and just switches *atLocations*'s current substate. The "pivot state" should
      // be 'atLocation'--you'd be switching from loggedIn.atLocation.inActivity to loggedIn.atLocation.atHomePage--and
      // 'atLocation' does NOT have concurrent substates.
      
      // And, by the way, this.get('substates') won't return *any* state that is 'current' if the inActivity substate
      // has been entered! Only *substates* of 'inActivity' are normally current, and the only way to find
      // the substates of our substate 'inActivity' seems to be this.get('enteredSubstates').
      
      // Oh, and, last thing, the "|| this" only works because this method happens to be called the first time
      // before any of our concurrent substates ('showingBlogButton' and 'warningUserBeforeLeaving') are set up. If
      // those concurrent substates ever *do* get set up before the first call to this method, it'll blow up again!
      // That's because 'this' won't be current, which means that this.gotoState('inHomePage') will become
      // this.get('statechart').gotoState('inHomePage'), which will try to transition invalidly from 
      // 'showingBlogButton' to 'inHomePage'...
      
      var startState = this.get('enteredSubstates').filterProperty('isCurrentState')[0] || this;
      
      switch (this.startPage) {
        case 'home':
          startState.gotoState('inHomePage');
          break;
        case 'caselog':
          startState.gotoState('inCaselog');
          break;
        case 'activity':
          startState.gotoState('inActivity');
          break;          
        default:
          throw new Error(
            "Lab.statechart.loggedIn.atLocation.startPage was set to an unexpected value, '%@'".fmt(this.startPage));
      }
    },
    
    gotoHomePage: function() {
      this.startPage = 'home';
      this.gotoRequestedSubstate();
    },
    
    gotoCaselog: function() {
      this.startPage = 'caselog';
      this.gotoRequestedSubstate();
    },
    
    gotoActivity: function() {
      this.startPage = 'activity';
      this.gotoRequestedSubstate();
    }

  }),
  
  showingBlogButton: Ki.State.plugin('Lab.showingBlogButton'),
  
  warningUserBeforeLeaving: Ki.State.plugin('Lab.warningUserBeforeLeaving'),
  
  logOut: function() { 
    SC.Request.postUrl(Lab.loginController.logoutUrl,null).header({'Accept': 'application/json'}).json()
      .notify(this, function(){
        Lab.statechart.gotoState('loggedOut');
        })
      .send();
    
    // rm cookies and blank user object
    Lab.loginController.logout();
  },
  
  exitState: function() { 
  }
  
});