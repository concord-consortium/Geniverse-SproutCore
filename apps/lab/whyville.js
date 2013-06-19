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

Lab.screenMixin = {
	render: function(context){
		sc_super();

		if (window.parent && window.parent!=parent && window.parent.Element)
		{
			var thisTop = this.get('frame').y;
			var iFrameOffsetTop = window.parent.Element.cumulativeOffset(window.parent.$('iframe')).top;
			var minTop = iFrameOffsetTop+thisTop; //how far from the top of the document this item sits (including iframe offset)

			//ignore the first several pixels of scroll, since that is taken up by whyvlle headers
			var top=Math.max(0, window.parent.document.body.scrollTop-minTop);
		
			if(top!=0)
			{
				top += thisTop;

				//cause a delay so this layer has time to be created
				setTimeout(function(){
					var layer = jQuery("#"+context._id);

					//TODO:when dragging the dialog box around it still jumps by back to where it would have started
					//.dialog() must be caching its start location.  need to figure how to refresh that cache...
					layer.animate({'top':top});
				}, 1);
			}
		}
	},
}
