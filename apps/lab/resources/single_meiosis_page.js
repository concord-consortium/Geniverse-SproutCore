// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CC, CcChat, java static_url sc_static sc_require */
Lab.marginSize = 15;

sc_require('views/top_bar_view');
sc_require('views/challenge_pool_view');
sc_require('views/bottom_bar_view');

Lab.singleMeiosisPage = SC.Page.design({

  pagePath: 'Lab.singleMeiosisPage',
  title: 'Simple Meiosis Page',

  // challengeType: 'matchOneAtATimeChallenge',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    childViews: 'mainAppView'.w(),

    mainAppView: SC.View.design({

      childViews: 'genomePanel'.w(),

      genomePanel: SC.View.design({
        layout: {top: 0, bottom: 10, left: 10, right: 10 },
        childViews: 'challengePoolView parentTitle drakeParentView meiosisView nextButton'.w(),

		  // using horizontal Challenge Pool at top with 120-px drakes inside
		  // this will necessitate moving everything down ~130px
		  // In actuality, moving them down about 6px more to avoid cutting off label
        challengePoolView: Lab.ChallengePoolView.design({
          layout: { left: 5, top: 10, width:410, height: 120 },
          dragonSize: 100
        }),

        parentTitle: SC.LabelView.design({
          layout: {top: 133, left: 152, height: 25, width: 200 },
          controlSize: SC.LARGE_CONTROL_SIZE,
          value: "Parent Drake"
        }),

				drakeParentView: Geniverse.OrganismView.design({
					layout: {top: 157, left: 160, height: 100, width: 100 },
					contentBinding: 'Geniverse.meiosisAnimationController.mother',
					isDropTarget: YES,
					}),

        // geneMap can be json object or url to file containing json object - dan
				meiosisView: Geniverse.AnimationView.design({
					layout: {top: 271, left: 55, height: 360, width: 325 },
					mode: 'parent',
					swapping: false,
					meiosisOwner: 'mother',
					dragonBinding: 'Geniverse.meiosisAnimationController.mother',
					gameteJsonBinding: 'Geniverse.meiosisAnimationController.motherGameteJson'
        }),

        nextButton: SC.ImageView.design(Geniverse.SimpleButton, {
          layout: {left: 435, top: 58, width: 118, height: 27},
          isEnabled: YES,
          hasHover: YES,
          classNames: 'bringItButton'.w(),
          alt: 'Bring it on!',
          title: 'Bring it on!',
          toolTip: 'Click when ready for the challenge.',
          target: 'Lab.statechart',
          action: 'gotoNextActivity'
        })
      })
  	})
	})
});
