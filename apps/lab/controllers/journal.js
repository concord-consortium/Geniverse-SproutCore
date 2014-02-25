// ==========================================================================
// Project:   Lab.journalController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */

/** @class

  Shows and manages content for separate browser window showing the journal page

  @extends SC.Controller
  @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
*/
Lab.journalController = SC.Controller.create(
/** @scope Lab.journalController.prototype */ {
  content: null,
  // NOTE: use the same domain, protocol, and port as this WebApp to avoid "Unsafe JavaScript attempt to access frame with URL" error
  journalBaseURL: "/journal/",

  /**
   * Opens the journal's web page
   * for the class the user is using.
   */
  openWindow: function() {
    //SC.Logger.log("Lab.journalController.openWindow() called");
    var className = Geniverse.userController.get('className');
    if(!className){
      className = "";
    }
    //SC.Logger.log("className:",className);
    var journalBaseURL = this.get('journalBaseURL');
    if(!journalBaseURL){
      journalBaseURL = "";
    }
    Lab.logController.logEvent(Lab.EVENT.GO_TO_JOURNAL);
    //SC.Logger.log("journalBaseURL:",journalBaseURL);
    var journalWindow = window.open(journalBaseURL.toString() + className.toString());
    //SC.Logger.log("journalWindow:",journalWindow);
    this.set('content',journalWindow);
  }

}) ;
