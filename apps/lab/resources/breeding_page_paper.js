// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 My Company, Inc.
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
sc_require('views/stats');

Lab.breedingPagePaper = SC.Page.design({
  
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

    topBar: SC.ToolbarView.design({
      layout: { top: 0, left: 0, right: 0, height: 36 },
      classNames: ['brown'],
      childViews: 'geniverseLabelView welcomeLabelView logoutButton'.w(),
      anchorLocation: SC.ANCHOR_TOP,
      
      geniverseLabelView: SC.LabelView.design({
        layout: { centerY: 0, height: 24, left: 8, width: 200 },
        controlSize: SC.LARGE_CONTROL_SIZE,
        fontWeight: SC.BOLD_WEIGHT,
        //valueBinding:   'Geniverse.activityController.title'
        value: "Individual Challenge"
      }),
      
      welcomeLabelView: SC.LabelView.design({
        layout: { centerY: 0, height: 24, right: 130, width: 500},
        fontWeight: SC.BOLD_WEIGHT,
        textAlign: SC.ALIGN_RIGHT,
        valueBinding: 'Geniverse.loginController.welcomeMessage',
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
    
    mainAppView: SC.View.create({
      
      layout: { top: 45, bottom: 0, left: 10, right: 0 },
      
      childViews: 'breedView statsView challengePoolView breedingPenView stableView marketplaceView chatView allArticlesView'.w(),
     
      challengePoolView: SC.View.design({
        className: 'transparent'.w(),
        childViews: "titleView dragonsView".w(),
        layout: { left: 20, top: 70, width:70, height: 300 },
        titleView: SC.LabelView.design({
          layout: { centerY: 0, height: 20, left: 0, top:0, width: 70 },
          value: "Parent Pool",
          controlSize: "bity",
          fontWeight: SC.BOLD_WEIGHT,
          textAlign: SC.ALIGN_CENTER,
          classNames: "container_label".w()
        }),
        dragonsView: CC.AutoScrollView.design({
          hasHorizontalScroller: NO,
          layout: { left: 0, top: 20, width: 70, height: 280},
          backgroundColor: 'white',
          contentView: SC.GridView.design({
            contentBinding: 'Geniverse.challengePoolController.arrangedObjects',
            selectionBinding: 'Geniverse.challengePoolController.selection',
            rowHeight: 70,
            columnWidth: 70,
            canEditContent: NO,
            exampleView: Geniverse.OrganismView,
            isSelectable: YES,
            dragDataTypes: ['dragon']
          }),
          autoScrollTriggerBinding: 'Geniverse.challengePoolController.length'
        })
      }),
      
      breedView: Geniverse.BreedDragonView.design({
        layout: { top: 70 , left: 100, height: 300, width: 150 },
        showChildView: NO // child as in baby dragon
      }),
      
      // Breeding pen with eggs
      breedingPenView: SC.View.design ({
        childViews: "titleView penView".w(),
        layout: { left: 265, top: 70, width: 300, height: 300 },
        classNames: ('transparent').w(),
        titleView: SC.LabelView.design({
          layout: { centerY: 0, height: 20, left: 0, top:0, width: 300 },
          value: "Breeding Pen",
          controlSize: "bity",
          textAlign: SC.ALIGN_CENTER,
          fontWeight: SC.BOLD_WEIGHT,
          classNames: "container_label".w()
        }),

        penView: CC.AutoScrollView.design({
          hasHorizontalScroller: NO,
          layout: { left: 0, top: 20, width: 300, height: 280 },
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
        })
      }),
      
      
      breedingChromosomeToolView: Geniverse.ChromosomeToolView.design({
        layout: { left: 570, top: 70, width: 35, height: 40 },
        selectionBinding: 'Geniverse.eggsController.selection'
      }),
      
      marketplaceView: SC.ImageView.design({
        layout: { left: 570, top: 150, height: 90, width: 90 },
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
        layout: { left: 565, top: 70 + (300 - 80), width: 60, height: 80 }
      }),
      

      stableView: SC.View.design({
        layout: { left: 680, top: 70, height: 300, width: 240 },
        childViews: 'title stable'.w(),
        title: SC.LabelView.design({
          classNames: 'container_label'.w(),
          layout: { centerX: 0, top:0, height: 20, width: 240 },
          controlSize: "bity",
          textAlign: SC.ALIGN_CENTER,
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

        stable: CC.AutoScrollView.design({
          hasHorizontalScroller: NO,
          layout: { left: 0, bottom: 0, height: 280, width: 240 },
          backgroundColor: 'white',
          classNames: 'transparent'.w(),
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
        })
      }), 

      allArticlesView: SC.TabView.design({ 
        layout: { bottom: 10, right: 30, width: 450, height: 235},
        items: [ 
          {title: "Your paper", value: "Geniverse.yourArticleView" },
          {title: "Published papers", value: "Geniverse.publishedArticlesView" }
        ], 
        itemTitleKey: 'title', 
        itemValueKey: 'value',
        nowShowingBinding: 'Geniverse.articleController.nowShowing' // hack for defining the startup tab 
      }),
      
      chatView: SC.StackedView.design ({
        layout: { bottom: 10, left: 20, width: 385, height: 215 },
        classNames: "transparent".w(),
        isVisible: false, // dont show chat for indv. challenge.
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
            exampleView: CcChat.ChatMessageView
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
