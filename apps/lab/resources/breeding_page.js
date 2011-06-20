// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse, CC, CcChat, java, Lab */
Lab.marginSize = 15;

sc_require('views/article');
sc_require('views/breed_dragon');
sc_require('views/dragon_bin');
sc_require('views/dragon_chat_compose');
sc_require('views/organism');
sc_require('views/published_articles');
sc_require('views/login');
sc_require('views/chromosome_tool');
sc_require('views/chromosome_tool2');
sc_require('views/stats');
sc_require('views/top_bar_view');
sc_require('views/challenge_pool_view');
sc_require('views/breeding_pen_view');

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
    childViews: 'backgroundView topBar bottomBar mainAppView'.w(),
      backgroundView: SC.ImageView.design({
        value: static_url('lab_background.png'),
        classNames: ['transparent','scalingimage']
      }),

    topBar: Lab.TopBarView.design({
      classNames: ['brown']
    }),
    bottomBar: Lab.BottomBarView.design({
      classNames: ['brown']
    }),
    
    mainAppView: SC.View.design({
      
      layout: { top: 25, bottom: 0, left: 10, right: 0 },
      
      childViews: 'breedView challengePoolView challengeChromosomeToolView breedingPenView stableView marketplaceView matchView'.w(),
     
      // challenge pool to hold initial, system-created dragons
      challengePoolView: Lab.ChallengePoolView.design({
        layout: { left: 0, top: 50, width:80, height: 320 }
      }),
      
      challengeChromosomeToolView: Geniverse.ChromosomeToolView.design({
        layout: { left: 45, top: 20, width: 35, height: 30 },
        selectionBinding: 'Geniverse.challengePoolController.selection',
        selection1Binding: 'Geniverse.eggsController.selection',
        selection2Binding: 'Geniverse.stableOrganismsController.selection'
      }),
      
      breedView: Geniverse.BreedDragonView.design({
        layout: { top: 20 , left: 90, height: 330, width: 150 },
        showChildView: NO // child as in baby dragon
      }),
      
      // Breeding pen with eggs
      breedingPenView: Lab.BreedingPenView.design({
        layout: { left: 250, top: 28, width: 325, height: 426 }
      }),

      stableView: Lab.StableView.design({
        layout: { left: 585, top: 28, width: 380, height: 395 }
      }),
      
      matchView: Geniverse.MatchView.design({
        layout: { left: 250, top: 455, height: 170, width: 620 },
        dragonSize: 150
      }),
      
      marketplaceView: SC.ImageView.design({
        layout: { left: 875, top: 455, height: 90, width: 90 },
        value: sc_static('sell-to-market.jpg'),
        canLoadInBackground: NO,
        useImageCache: NO,
        isDropTarget: YES,
        acceptDragOperation: function(drag, op) {
          function sellDragon(dragon){
            SC.RunLoop.begin();
            if (!!dragon){
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
      })
    })
  })
  
});
