// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse, CC, CcChat, java sc_static static_url */
Geniverse.marginSize = 15;

sc_require('views/article');
sc_require('views/breed');
sc_require('views/dragon_bin');
sc_require('views/dragon_chat_compose');
sc_require('views/organism');
sc_require('views/published_articles');
sc_require('views/login');
sc_require('views/chromosome_tool');
sc_require('views/stats');
sc_require('views/stable');
sc_require('views/chat_message');
sc_require('views/challenge_pool');
Geniverse.groupChallengePage = SC.Page.design({
  
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
        //valueBinding:   'Geniverse.activityController.title'
        value: "Group Challenge"
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
    
    appContainer: SC.ContainerView.design({
      isContainerView: YES,
      layout: { top: 45, bottom: 0, left: 10, right: 0 },
      contentView: null,
    	
      loginView: Geniverse.LoginView.create({
        layout: {centerX: 0, top: Geniverse.marginSize, width: 500, height: 100},
        layerId: "chatLogin",
        classNames: 'brown'.w()
      }),
      mainAppView: SC.View.create({
        childViews: 'breedView statsView challengePoolView stableView marketplaceView chatView allArticlesView'.w(),
       
        challengePoolView: Geniverse.ChallengePoolView.design({
          layout: { left: 20, top: 40, width:70, height: 330 },
          classNames: 'transparent '.w()
        }),

        breedView: Geniverse.BreedDragonView.design({
          layout: { top: 70 , left: 100, height: 300, width: 150 }
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
        
        stableView: Geniverse.StableView.design({
          layout: { left: 680, top: 40, height: 330, width: 240 },
          classNames: 'transparent '.w()
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
        
        chatView: SC.View.design ({
          layout: { bottom: 10, left: 20, width: 385, height: 215 },
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
  })
});
