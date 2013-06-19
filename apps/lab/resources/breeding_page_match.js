// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse, CC, CcChat, java, Lab */
Lab.marginSize = 15;

sc_require('views/lab_pane');
sc_require('views/challenge_pool_view');
sc_require('views/breeding_pen_view');
sc_require('views/stable_view');

Lab.breedingPageMatch = SC.Page.design({

  // used for the index page
  pagePath: 'Lab.breedingPageMatch',
  title: 'Breeding Page',

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: Lab.LabPane.design({

   layout: { left: 0, top: 000, width: 800, height: 1104 },
      
    mainAppView: SC.View.design({

      layout: { left: 0, top: 100, width: 800, height: 1004 },

      childViews: 'breedView mothersPoolView fathersPoolView challengeChromosomeToolView breedingPenView stableView marketplaceView matchView scoreView glowHintView offspringHintView stableHintView'.w(),

      // challenge pool to hold initial, system-created dragons
      mothersPoolView: Lab.ChallengePoolView.design({
        layout: { centerX: -90, top: 127-127, width:165, height: 173 },
        sex: "female"
      }),

      fathersPoolView: Lab.ChallengePoolView.design({
        layout: { centerX: 90, top: 127-127, width:165, height: 173 },
        sex: "male"
      }),

      breedView: Geniverse.BreedDragonView.design({
        layout: { top: 310-127 , left: 10, height: 530, right: 10 },
        showChildView: NO, // child as in baby dragon
        trackScore: YES,

        motherView: Geniverse.OrganismView.design({
          layout: {top: 0, centerX: -95, width: 180, height: 180},
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
          layout: {top: 0, centerX: 95, width: 180, height: 180},
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
          layout: { top: 190, centerX: 20, width: 100, height: 30 },
          target: 'Geniverse.breedDragonController',
          trackScore: NO,
          action: function() {
            Lab.statechart.sendAction('breedingPageMatchBreedingCompleted');
            return this.get('trackScore') ? "breedAndIncrementScore" : "breed";
          }.property('trackScore'),
          isBreedingBinding: 'Geniverse.breedDragonController.isBreeding',
          hasParentsBinding: 'Geniverse.breedDragonController.hasParents',
          isEnabled: function() {
            return (this.get('hasParents') && !this.get('isBreeding'));
          }.property('hasParents', 'isBreeding').cacheable(),

          title: function () {
            return this.get('isBreeding') ? 'Breeding...' :  'Breed';
          }.property('isBreeding').cacheable(),

          toolTip: "Press Breed to create a herd of baby dragons.",
          classNames: 'hint-available hint-target-rightMiddle hint-tooltip-leftMiddle'
        })

      }),

      challengeChromosomeToolView: Geniverse.ChromosomeToolView.design({
        layout: { centerX: -51, top: 500-127, width: 35, height: 30 },
        toolTip: "Click a dragon and then scope it with this button.  Does it have the right alleles to match the targets?",
        classNames: 'hint-available breeding-completed-hint'
      }),

      // Breeding pen with eggs
      breedingPenView: Lab.BreedingPenView.design({
        layout: { centerX: 0, top: 540-127, width: 406, height: 347 }
      }),

      scoreView: Geniverse.ScoreView.design({
        layout: { left: 20, top: 745, height: 49, width: 184 },
        showScore: YES,
        isVisibleBinding: SC.Binding.oneWay('Geniverse.activityController.isArgumentationChallenge').not(),
        showTargetScore: YES
      }),

      matchView: Geniverse.MatchView.design({
        layout: { centerX: 0, top: 897-127, width: 410, height: 117 },
        dragonSize: 96
      }),

      stableView: Lab.StableView.design({
        layout: { centerX: 0, top: 897, width: 520, height: 97 }
      }),

      marketplaceView: SC.ImageView.design({
        layout: { right: 35, top: 897, height: 90, width: 90 },
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
        },
        toolTip: "If your stable is full, drag dragons here to remove them!",
        classNames: "first-stable-hint hint-target-topMiddle hint-tooltip-bottomMiddle".w()
      }),

      // special views for extact-positioning of hints
      glowHintView: SC.View.design({
        layout: { top: 200, centerX: 65, width:165, height: 173 },
        toolTip: "Drag parents to the yellow spots.",
        classNames: "hint-available hint-target-topRight hint-tooltip-bottomLeft".w()
      }),

      offspringHintView: SC.View.design({
        layout: { top: 420, centerX: 100, width:10, height: 10 },
        toolTip: "Drag a matching baby dragon from the herd onto the target.",
        classNames: "breeding-completed-hint hint-tooltip-bottomLeft".w()
      }),

      stableHintView: SC.View.design({
        layout: { top: 900+100, centerX: 180-240, width:10, height: 10 },
        toolTip: "To save a baby dragon to use as a parent later, drag it here. If you can’t match the target, change the parents and try again!",
        classNames: "breeding-completed-hint hint-tooltip-topRight".w()
      })

    })
  })

});
