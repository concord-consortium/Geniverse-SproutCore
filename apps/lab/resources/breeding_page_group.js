// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse, CC, CcChat, java */
Lab.marginSize = 15;

sc_require('views/top_bar_view');
sc_require('views/challenge_pool_view');
sc_require('views/breeding_pen_view');
sc_require('views/stable_view');
sc_require('views/bottom_bar_view');

Lab.breedingPageGroup = SC.Page.design({
  
  pagePath: 'Lab.breedingPageGroup',
  title: 'Breeding Page Group',
  
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
      
      childViews: 'breedView challengePoolView breedingPenView challengeChromosomeToolView stableView matchView marketplaceView chatView allArticlesView'.w(),

      challengePoolView: Lab.ChallengePoolView.design({
        layout: { left: 0, top: 50, width:80, height: 320 }
      }),
      
      challengeChromosomeToolView: Geniverse.ChromosomeToolView.design({
        layout: { left:45, top: 20, width: 35, height: 30 },
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
        layout: { left: 895, top: 28, height: 340, width: 82 },
        dragonSize: 80
      }),
      
      marketplaceView: SC.ImageView.design({
        layout: { left: 975, top: 435, height: 90, width: 90 },
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

      allArticlesView: SC.View.design ({
        childViews: 'articleLabel article'.w(),
        
        layout: { top: 435, left: 430, width: 450, height: 235},
        
        articleLabel: SC.LabelView.design({
          layout: {top: 0, left: 0, right: 0, height: 20},
          value: "Article draft",
          classNames: "container_label",
          controlSize: "bity",
          textAlign: SC.ALIGN_CENTER,
          fontWeight: SC.BOLD_WEIGHT
        }),
        
        article: Geniverse.ArticleView.design({ 
          layout: { top: 20, left: 0, right: 0, bottom: 0}
        })
      }),
      
      chatView: SC.View.design ({
        layout: { top: 435, left: 20, width: 385, height: 215 },
        classNames: "transparent".w(),
        childViews: 'userListLabel userListView chatListView chatComposeView '.w(),
        
        userListLabel: SC.LabelView.design({
          layout: {top: 0, left: 0, width: 125, height: 20},
          value: "Users in room",
          classNames: "container_label",
          controlSize: "bity",
          textAlign: SC.ALIGN_CENTER,
          fontWeight: SC.BOLD_WEIGHT
        }),

        userListView: CcChat.UserListView.design({
          layout: {top: 20, left: 0, width: 125, height: 210}
        }),
        
        chatListView: CC.AutoScrollView.design({
          layerId: 'chatList',
          hasHorizontalScroller: NO,
          layout: { left: 135, top: 20, height: 150, width: 250 },
          backgroundColor: 'white',
          contentView: SC.StackedView.design({
            layerId: 'chatListContent',
            contentBinding: 'Geniverse.chatListController.arrangedObjects',
            selectionBinding: 'Geniverse.chatListController.selection',
            rowHeight: 30,
            canEditContent: NO,
            hasContentIcon: YES,
            contentValueKey: 'message',
            isSelectable: YES,
            showAlternatingRows: YES,
            exampleView: Geniverse.ChatMessageView
          }),
          autoScrollTriggerBinding:  'Geniverse.chatListController.length'
        }),
    		
        chatComposeView: Geniverse.DragonChatComposeView.design({
          layout: { left: 135, top: 180, height: 100, width: 250 },
          layerId: "chatCompose"
        })

      })
    })
  })
});
