// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse, CC, CcChat, java, Lab */
Lab.marginSize = 15;

sc_require('views/top_bar_view');
sc_require('views/challenge_pool_view');
sc_require('views/breeding_pen_view');
sc_require('views/stable_view');
sc_require('views/bottom_bar_view');

Lab.breedingPage = SC.Page.design({

  // used for the index page
  pagePath: 'Lab.breedingPage',
  title: 'Breeding Page',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'],
    childViews: 'mainAppView'.w(),

    mainAppView: SC.View.design({

      layout: { centerX: 0, top: 0, width: 840, height: 545 },

      childViews: 'background breedView mothersPoolView fathersPoolView challengeChromosomeToolView breedingPenView stableView marketplaceView scoreView'.w(),

      // separate parallel background so we don't make the rest of the childViews see-through
      background: SC.View.design({
        layout: {top: 0, left: 0, right: 0, bottom: 0},
        classNames: ['genome-view-intro']
      }),

      // challenge pool to hold initial, system-created dragons
      mothersPoolView: Lab.ChallengePoolView.design({
        layout: { left: 20, top: 21, width:165, height: 173 },
        sex: "female"
      }),

      fathersPoolView: Lab.ChallengePoolView.design({
        layout: { right: 20, top: 21, width:165, height: 173 },
        sex: "male"
      }),

      challengeChromosomeToolView: Geniverse.ChromosomeToolView.design({
        layout: { centerX: -51, top: 30, width: 35, height: 30 }
      }),

      breedView: Geniverse.BreedDragonView.design({
        layout: { top: 20 , left: 30, height: 430, right: 30 },
        showChildView: NO, // child as in baby dragon
        trackScore: YES,

        motherView: Geniverse.OrganismView.design({
          layout: {top: 184, left: 0, width: 180, height: 180},
          classNames: "sc-theme motherView opaque".w(),
          contentBinding: "*parentView.mother",
          parent: "mother",
          label: "Mother",
          showLabel: true,
          sex: 1,
          isDropTarget: YES,
          glow: YES,
          trackScoreBinding: "*parentView.trackScore"
        }),


        fatherView: Geniverse.OrganismView.design({
          layout: {top: 184, right: 0, width: 180, height: 180},
          classNames: "fatherView opaque".w(),
          contentBinding: "*parentView.father",
          parent: "father",
          label: "Father",
          showLabel: true,
          sex: 0,
          isDropTarget: YES,
          glow: YES,
          trackScoreBinding: "*parentView.trackScore"
        }),

        breedButtonView: SC.ButtonView.design({
          layout: { top: 10, centerX: 20, width: 100, height: 24 },
          target: 'Geniverse.breedDragonController',
          trackScoreBinding: '*parentView.trackScore',
          action: function() {
            return this.get('trackScore') ? "breedAndIncrementScore" : "breed";
          }.property('trackScore'),
          isBreedingBinding: 'Geniverse.breedDragonController.isBreeding',
          hasParentsBinding: 'Geniverse.breedDragonController.hasParents',
          isEnabled: function() {
            return (this.get('hasParents') && !this.get('isBreeding'));
          }.property('hasParents', 'isBreeding').cacheable(),

          title: function () {
            return this.get('isBreeding') ? 'Breeding...' :  'Breed';
          }.property('isBreeding').cacheable()
        })

      }),

      // Breeding pen with eggs
      breedingPenView: Lab.BreedingPenView.design({
        layout: { centerX: 0, top: 66, width: 406, height: 347 }
      }),

      stableView: Lab.StableView.design({
        layout: { centerX: 0, top: 428, width: 520, height: 100 }
      }),

      marketplaceView: SC.ImageView.design({
        layout: { right: 35, top: 428, height: 90, width: 90 },
        value: sc_static('sell-to-market.jpg'),
        canLoadInBackground: NO,
        useImageCache: NO,
        isDropTarget: YES,
        acceptDragOperation: function(drag, op) {
          function sellDragon(dragon){
            SC.RunLoop.begin();
            if (dragon && dragon.get('bred')){
              dragon.set('isInMarketplace', YES);
              Geniverse.eggsController.removeObject(dragon);
            }
            SC.RunLoop.end();
          }

          if ((""+drag.get('source').constructor === 'Geniverse.OrganismView')){
            var dragon = drag.get('source').get('content');
            sellDragon(dragon);
          } else {
            var selection = drag.get('source').get('selection');
            for (var i = 0; i < selection.get('length'); i++){
              sellDragon(selection.firstObject());
            }
          }

          this.invokeLast(function () {
            SC.RunLoop.begin();
            Geniverse.eggsController.set('selection', null);
            Geniverse.stableOrganismsController.set('selection', null);
            SC.RunLoop.end();
          });
          return op ;
        },
        computeDragOperations: function(drag, evt) {
          return SC.DRAG_ANY ;
        },
        dragEntered: function(drag, evt) {
          this.$().addClass('drop-target') ;
        },
        dragExited: function(drag, evt) {
          this.$().removeClass('drop-target') ;
        }
      }),

      scoreView: Geniverse.ScoreView.design({
        layout: { left: 20, top: 376, height: 49, width: 184 },
        showScore: YES,
        showTargetScore: YES
      })
    })
  })

});
