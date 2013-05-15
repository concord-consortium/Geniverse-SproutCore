// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/** @namespace

  Manages routes for the Lab application.

  @extends SC.Object
*/
Lab.whyville = SC.Object.create({

  reportChallenge: function(success)
  {
    var c = Geniverse.activityController.caseTitle();
    var a = Geniverse.activityController.actTitle();
    
    var cdi = Geniverse.matchController.get('currentDragonIdx');
    
    SC.Request.postUrl("/smmk/nii/challengeComplete?case="+ c +"&act="+ a + "&cdi=" + cdi+ "&win=" + (success?"1":"0") , "" ).send();
  }
});
