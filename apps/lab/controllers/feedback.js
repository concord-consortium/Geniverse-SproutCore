// ==========================================================================
// Project:   Lab
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse Ki */

/* The feedback controller allows us to describe in one place all the feedback logic and messages (i.e., what responses
   students see when completing a challenge, or part of a challenge, etc.)

  This is a "crosscutting concern": this controller knows a lot about different parts of the system, but on the other
  hand it puts the feedback logic in one place instead of scattering it about the system, allowing you to treat the
  set of feedback messages as a coherent whole.

  Work on this was begun 1/18/2012, and applied to the didSendBlogPost event triggered by the 'showingBlogButton'
  state, but it could be (and is intended eventually to be) extended to handle all feedback messages.
*/

Lab.feedbackController = SC.Object.create({

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // BEGIN EVENT HANDLERS
  //
  // These are to be called by outside code when an event of interest happens. The logic of each handler reveals
  // what feedback messages are shown to the user in response to those events.


  // NOTE!
  //
  // The unusually formatted and (optionally) somewhat redundant logic below is first cut at a "truth table"-like
  // format that should be used consistently in event handlers in this controller, so that one can quickly get a global
  // picture of the feedback messages and logic by glancing over this file (once you understand how it's formatted
  // and why.)


  didSendBlogPost: function(description, postURL) {

    var state = Lab.statechart.getState('argumentationChallenge'),

        argumentationChallengeStateIsCurrent     = state.get('isCurrentState'),
        argumentationChallengeIsNowComplete      = state.get('challengeComplete'),
        argumentationChallengeWasAlreadyComplete = state.get('challengeWasAlreadyComplete'),

        isLastChallenge = !Geniverse.activityController.getNextActivity();


    if (      argumentationChallengeStateIsCurrent
         &&   argumentationChallengeIsNowComplete
         && ! argumentationChallengeWasAlreadyComplete) {

        this._notifyPostedToBlogAndCompletedChallenge(description, postURL, isLastChallenge);
    }
    else {

      //    ! argumentationChallengeStateIsCurrent
      // || ! argumentationChallengeIsNowComplete
      // ||   argumentationChallengeWasAlreadyComplete

      this._notifyPostedToBlog(description, postURL);
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
  // go here. Each method should be named _notify<summary of notification> and should contain minimal logic.

  _notifyPostedToBlogAndCompletedChallenge: function(description, postURL, isLastChallenge) {
    this._notify(
      "Good work!",

      "<img src=\"" + static_url('quill-on-45x45.png') + "\" style=\"float: left; margin: 0.4em 1.0em;\"/>\n" +
      "You earned a quill! " +
      "You completed the challenge by posting to the journal. Find your post <a onclick=\"Lab.feedbackController.openInNewTabAndLog('" + postURL +
      "')\" href=\"javascript:void(0);\">here</a>.\n" +
      "You can continue to work on this challenge if you like, or you can " + (
        isLastChallenge ?
          "go back to the <a href=\"#caselog\">Case Log</a> to go to a new case." :
          "move on to the next challenge using the green arrow below.")
    );
  },

  _notifyPostedToBlog: function(description, postURL) {
    this._notify(
      "Journal post successfully created!",

      "Your post can be found and edited <a onclick=\"Lab.feedbackController.openInNewTabAndLog('" + postURL + "')\" href=\"javascript:void(0);\">here</a>. "+
      "(Link will open in a new tab.)<br/><br/>"+
      "When you are ready, move onto the next challenge."
    );
  },

  // END MESSAGES
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // private helpers

  _notify: function(message, description, caption) {
    this.HTMLEnabledAlertPane.plain(message, description, caption, 'OK');
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

  openInNewTabAndLog: function (url) {
    Lab.logController.logEvent(Lab.EVENT.GO_TO_JOURNAL_POST);
    window.open(url,'_blank');
  }

});
