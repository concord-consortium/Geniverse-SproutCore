// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse, CC, CcChat, java */
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
    childViews: 'backgroundView topBar mainAppView'.w(),
      backgroundView: SC.ImageView.design({
        value: static_url('lab_background.png'),
        classNames: ['transparent','scalingimage']
      }),

    topBar: Lab.TopBarView.design({
      classNames: ['brown']
    }),
    
    mainAppView: SC.View.design({
      
      layout: { top: 45, bottom: 0, left: 10, right: 0 },
      
      childViews: 'breedView statsView challengePoolView challengeChromosomeToolView breedingPenView stableView marketplaceView '.w(),
     
      // challenge pool to hold initial, system-created dragons
      challengePoolView: Lab.ChallengePoolView.design({
        layout: { left: 20, top: 150, width:70, height: 300 }
      }),
      
      challengeChromosomeToolView: Geniverse.ChromosomeToolView.design({
      layout: { left:55, top: 120, width: 35, height: 30 },
        selectionBinding: 'Geniverse.challengePoolController.selection',
        selection1Binding: 'Geniverse.eggsController.selection',
        selection2Binding: 'Geniverse.stableOrganismsController.selection'
      }),
      
      breedView: Geniverse.BreedDragonView.design({
        layout: { top: 150 , left: 100, height: 300, width: 150 },
        showChildView: NO // child as in baby dragon
      }),
      
      // Breeding pen with eggs
      breedingPenView: Lab.BreedingPenView.design({
        layout: { left: 265, top: 150, width: 300, height: 300 }
      }),
      
      marketplaceView: SC.ImageView.design({
        layout: { left: 570, top: 200, height: 90, width: 90 },
        value: sc_static('sell-to-market.jpg'),
        canLoadInBackground: NO,
        useImageCache: NO,
        isDropTarget: YES,
        acceptDragOperation: function(drag, op) {
          function sellDragon(dragon){
            SC.RunLoop.begin();
            if (!!dragon){
              dragon.set('isInMarketplace', YES);
            }
            SC.RunLoop.end();
          }
          
          if ((""+drag.get('source').constructor === 'Geniverse.OrganismView')){
            var dragon = drag.get('source').get('organism');
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
      
      statsView: Geniverse.StatsView.design({
        layout: { left: 565, top: 150 + (300 - 80), width: 60, height: 80 }
      }),

      stableView: Lab.StableView.design({
        layout: { left: 680, top: 150, height: 300, width: 240 }
      })
      
    })
  })
  
});
