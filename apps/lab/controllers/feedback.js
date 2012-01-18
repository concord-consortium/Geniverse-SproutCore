// ==========================================================================
// Project:   Lab
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse Ki */

/* The feedback controller allows us to describe feedback and messages in one place 

  This is a "crosscutting concern": this controller knows a lot about different parts of the system, but on the other
  hand it puts the feedback logic in one place instead of scattering it about the system
*/

Lab.feedbackController = SC.Object.create({

  // NOTE
  
  // The unusually formatted and intentionally somewhat redundant logic below is first cut at a "truth table"-like
  // format that should be used consistently between methods in this controller, so that you can quickly get a global
  // picture of the feedback messages and logic by glancing over this file (once you understand how it's formatted
  // and why.)
  
  // NOTE
  

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // BEGIN EVENT HANDLERS 
  //
  // These are to be called by outside code when an event of interest happens. The logic of each handler reveals
  // what feedback messages are shown to the user in response to those events. 
  
  didSendBlogPost: function(description, postURL) {

    var state = Lab.statechart.getState('argumentationChallenge'),
    
        argumentationChallengeStateIsCurrent     = state.get('isCurrentState'),
        argumentationChallengeIsNowComplete      = state.get('challengeComplete'),
        argumentationChallengeWasAlreadyComplete = state.get('challengeWasAlreadyComplete'),
        
        isLastChallenge = !Geniverse.activityController.getNextActivity();


    if (        ! argumentationChallengeStateIsCurrent) {

      this._notifyPostedToBlog(description, postURL);
    }

    else if (     argumentationChallengeStateIsCurrent 
             &&   argumentationChallengeWasAlreadyComplete ) {
      
        this._notifyPostedToBlog(description, postURL);
    }
    
    else if (     argumentationChallengeStateIsCurrent 
             && ! argumentationChallengeWasAlreadyComplete
             &&   argumentationChallengeIsNowComplete ) {
      
        this._notifyPostedToBlogAndCompletedChallenge(description, postURL, isLastChallenge);
    }
  },

  // END EVENT HANDLERS
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // BEGIN MESSAGES
  //
  // Private methods (to be called by event handlers, above) that contain the text of the various feedback messages
  // go here. Each method should be named _notify(summary of notification) and should contain minimal logic.
  
  _notifyPostedToBlogAndCompletedChallenge: function(description, postURL, isLastChallenge) {   

    this._notify(
      "Good work!",
      
      "You have successfully completed the challenge by <a target=\"_blank\" href=\"" + postURL + 
      "\">posting to the journal</a>.\n" +
      "You can continue to work on this challenge if you like, or you can " + (
        isLastChallenge ?
          "go back to the case log to go to a new case." :
          "move on to the next challenge using the green arrow below.")
    );

  },
  
  _notifyPostedToBlog: function(description, postURL) {  

    this._notify(
      "Journal post successfully created", 

      "Your post can be found <a target=\"_blank' href=\"" + postURL+"\">here</a>. (Link will open in a new tab.)"
    );
  },
  
  HTMLEnabledAlertPane: SC.AlertPane.extend({
    layout: { top: 0, centerX: 0, width: 360, height: 100 },
    displayDescription: function() {
      var desc = this.get('description');
      if (!desc || desc.length === 0) return desc;
      // Commented out to override SC.AlertPane's HTML escape: // desc = SC.RenderContext.escapeHTML(desc); // remove HTML
      return '<p class="description">' + desc.split('\n').join('</p><p class="description">') + '</p>';
    }.property('description').cacheable()
  }),
  
  // END MESSAGES
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  

  // private helper methods
 
  _notify: function(message, description, caption) {  
    this.HTMLEnabledAlertPane.plain(message, description, caption, 'OK');
  }

});
