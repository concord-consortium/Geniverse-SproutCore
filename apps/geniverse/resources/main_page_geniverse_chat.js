// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse, CC, CcChat, java */
Geniverse.marginSize = 15;

sc_require('views/article');
sc_require('views/breed_dragon');
sc_require('views/dragon_bin');
sc_require('views/dragon_chat_compose');
sc_require('views/organism');
sc_require('views/published_articles');
sc_require('views/login');
sc_require('views/chromosome_tool');
sc_require('views/stats');

Geniverse.mainChatExamplePage = SC.Page.design({
  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'],
    childViews: 'backgroundView topBar appContainer'.w(),
      backgroundView: SC.ImageView.design({
        value: static_url('lab_background.png'),
        classNames: ['transparent','scalingimage']
      }),

    topBar: SC.ToolbarView.design({
      layout: { top: 0, left: 0, right: 0, height: 36 },
      classNames: ['brown'],
      childViews: 'geniverseLabelView welcomeLabelView logoutButton'.w(),
      anchorLocation: SC.ANCHOR_TOP,
      
      geniverseLabelView: SC.LabelView.design({
        layout: { centerY: 0, height: 24, left: 8, width: 200 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        valueBinding:   'Geniverse.activityController.title'
      }),
      
      welcomeLabelView: SC.LabelView.design({
        layout: { centerY: 0, height: 24, right: 130, width: 500},
        fontWeight: SC.BOLD_WEIGHT,
        textAlign: SC.ALIGN_RIGHT,
        valueBinding: 'Geniverse.appController.welcomeMessageDuplicate',
        isVisibleBinding: 'Geniverse.appController.userLoggedIn'
      }),

      logoutButton: SC.ButtonView.design({
        layout: { centerY: 0, height: 24, right: 12, width: 100 },
        layerId: 'logOutButton',
        title:  "Log out",
        target: 'Geniverse.appController',
        action: 'logout',
        isVisibleBinding: 'Geniverse.appController.userLoggedIn'
      })
    }),
    
    appContainer: SC.ContainerView.design({
      isContainerView: YES,
      layout: { top: 45, bottom: 0, left: 10, right: 0 },
      contentView: null,
    	
      loginView: Geniverse.LoginView.create({
        layout: {centerX: 0, top: Geniverse.marginSize, width: 500, height: 70},
        layerId: "chatLogin",
        classNames: 'brown'.w()
      }),
      mainAppView: SC.View.create({
        childViews: 'breedView statsView challengePoolView breedingPenView breedingChromosomeToolView stableTitle stableView marketplaceView chatView allArticlesView'.w(),
       
        breedView: Geniverse.BreedDragonView.design({
          layout: { top: Geniverse.marginSize, left: Geniverse.marginSize, height: 140, width: 450 },
          showChildView: NO
        }),
        
        // challenge pool to hold initial, system-created dragons
        challengePoolView: CC.AutoScrollView.design({
          hasHorizontalScroller: NO,
          layout: { left: Geniverse.marginSize - 15, top: 160, width: 80, height: 240 },
          backgroundColor: 'white',
          contentView: SC.GridView.design({
            contentBinding: 'Geniverse.challengePoolController.arrangedObjects',
            selectionBinding: 'Geniverse.challengePoolController.selection',
            rowHeight: 60,
            columnWidth: 60,
            canEditContent: NO,
            exampleView: Geniverse.OrganismView,
            isSelectable: YES,
            dragDataTypes: ['dragon']
          }),
          autoScrollTriggerBinding: 'Geniverse.challengePoolController.length'
        }),
        
        // Breeding pen with eggs
        breedingPenView: CC.AutoScrollView.design({
          hasHorizontalScroller: NO,
          layout: { left: Geniverse.marginSize + 75, top: 160, width: 300, height: 240 },
          backgroundColor: 'white',
          contentView: SC.GridView.design({
            contentBinding: 'Geniverse.eggsController.arrangedObjects',
            selectionBinding: 'Geniverse.eggsController.selection',
            rowHeight: 60,
            columnWidth: 60,
            canEditContent: NO,
            exampleView: Geniverse.OrganismView,
            isSelectable: YES,
            dragDataTypes: ['dragon']
          }),
          autoScrollTriggerBinding: 'Geniverse.eggsController.length'
        }),
        
        
        breedingChromosomeToolView: Geniverse.ChromosomeToolView.design({
          layout: { left: Geniverse.marginSize + 75 + 300 + 10, top: 160, width: 35, height: 40 },
          selectionBinding: 'Geniverse.eggsController.selection'
        }),
        
        statsView: Geniverse.StatsView.design({
          layout: { left: Geniverse.marginSize + 75 + 300 + 10, top: 210, width: 100, height: 70 }
        }),
        
        stableTitle: SC.LabelView.design({
          layout: { left: Geniverse.marginSize+100, bottom: 235, height: 25, width: 450 },
          fontWeight: SC.BOLD_WEIGHT,
          woo: function() {
            // SC.Logger.log("woo");
            this.propertyDidChange('value');
          }.observes("Geniverse.stableOrganismsController.arrangedObjects.[]"),
          value:  function() {
            var numDragons = Geniverse.stableOrganismsController.get('length');
            var spaces = 50 - numDragons;
            // SC.Logger.log("recalculating");
            return "Your Stable      -   " + spaces + " spaces remaining";
          }.property('Geniverse.stableOrganismsController.arrangedObjects.[]')
        }),

        stableView: CC.AutoScrollView.design({
      	  hasHorizontalScroller: NO,
      		layout: { left: Geniverse.marginSize, bottom: 10, height: 220, width: 450 },
          backgroundColor: 'white',
          contentView: SC.GridView.design({
      			contentBinding: 'Geniverse.stableOrganismsController.arrangedObjects',
      			selectionBinding: 'Geniverse.stableOrganismsController.selection',
      			rowHeight: 60,
      			columnWidth: 60,
      			canEditContent: NO,
      			exampleView: Geniverse.OrganismView,
      			isSelectable: YES,
      			dragDataTypes: ['dragon']
          }),

          autoScrollTriggerBinding: 'Geniverse.stableOrganismsController.length',

          isDropTarget: YES,

          dragonNum: 0,
          acceptDragOperation: function(drag, op) {
            var self = this;
            function acceptDragon(dragon){
              if (!dragon){
                return;
              }
              var dragonNum = self.get('dragonNum');

              // check if there are existing dragons
              var allStableDragons = Geniverse.stableOrganismsController.get('arrangedObjects');
              var count = Geniverse.stableOrganismsController.get('length');
              if (count >= 50){
                alert("Your stable is full");
                return;
              }
              if (count > 0){
                var lastDragon = allStableDragons.objectAt(length-1);
                var lastStableOrder = lastDragon.get('stableOrder');
                if (!!lastStableOrder && lastStableOrder > count){
                  dragonNum = lastStableOrder + 1;
                } else {
                  dragonNum = count + 1;
                }
                self.set('dragonNum', dragonNum);
              }
              
              SC.RunLoop.begin();
                dragon.set('isEgg', false);
                dragon.set('stableOrder', dragonNum);
              SC.RunLoop.end();
              
              ++self.dragonNum;
            }
            
            
            if ((""+drag.get('source').constructor === 'Geniverse.OrganismView')){
              var dragon = drag.get('source').get('organism');
              acceptDragon(dragon);
            } else {
              var selection = drag.get('source').get('selection').clone();
              // NB: This works, while the forEach method below only removes half of them.
              // This is because each time acceptDragon is called, the dragon gets removed from
              // the list, and the other dragons shift indices.
              for (var i = 0; i < selection.get('length'); i++){
                acceptDragon(selection.firstObject());
              }
              // selection.forEach(function (dragon){
              //  SC.Logger.log("selection.length = "+selection.get('length'));
              //  acceptDragon(dragon);
              //  });
            }

            this.invokeLast(function () {
              // this is quite specific to the eggsController. We should really be checking the source
              SC.RunLoop.begin();
              Geniverse.eggsController.set('selection', null);
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
        
        marketplaceView: SC.ImageView.design({
      		layout: { left: 500, bottom: 135, height: 90, width: 90 },
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
        
        allArticlesView: SC.TabView.design({ 
          layout: { top: 5, right: Geniverse.marginSize, height: 250, width: 510},
          items: [ 
            {title: "Your paper", value: "Geniverse.mainChatExamplePage.yourArticleView" },
            {title: "Published papers", value: "Geniverse.mainChatExamplePage.publishedArticlesView" }
          ], 
          itemTitleKey: 'title', 
          itemValueKey: 'value',
          nowShowingBinding: 'Geniverse.articleController.nowShowing' // hack for defining the startup tab 
          
        }),
        
        chatView: SC.StackedView.design({
          layout: { right: Geniverse.marginSize, bottom: 0, width: 500, height: 330 },

      		childViews: 'chatListView chatComposeView userListView userListLabel'.w(),

        	chatListView: CC.AutoScrollView.design({
        	  layerId: 'chatList',
      		  hasHorizontalScroller: NO,
            layout: { left: 0, top: 65, height: 180, width: 300 },
            backgroundColor: 'white',
            contentView: SC.StackedView.design({
              layerId: 'chatListContent',
      				contentBinding: 'CcChat.chatListController.arrangedObjects',
      				selectionBinding: 'CcChat.chatListController.selection',
      				rowHeight: 30,
      				canEditContent: NO,
      				hasContentIcon: YES,
      				contentValueKey: 'message',
      				isSelectable: YES,
      				showAlternatingRows: YES,
      				exampleView: CcChat.ChatMessageView
            }),
            autoScrollTriggerBinding:  'CcChat.chatListController.length'
          }),
      		
      		chatComposeView: Geniverse.DragonChatComposeView.design({
            layout: { left: 0, top: 260, height: 200, width: 300 },
            layerId: "chatCompose"
      		}),
      		
      		userListLabel: SC.LabelView.design({
      		  layout: {top: 65, right: 20, width: 100},
      		  value: "Users in room"
      		}),
      		
      		userListView: CcChat.UserListView.design({
            layout: {top: 85, right: 0, width: 150, height: 200}
          })
        })
    	})
    })
  }),
  
  yourArticleView: Geniverse.ArticleView.design({
    layout: { left: 5, top: 10, height: 220}
  }),
  
  publishedArticlesView: Geniverse.PublishedArticlesView.design({
    layout: { left: 5, top: 10, height: 220}
  })
  
});
