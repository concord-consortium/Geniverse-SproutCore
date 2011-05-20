// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
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

Geniverse.experimentPage = SC.Page.design({
  
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
        value: "Experiment"
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
        childViews: 'breedView statsView challengePoolView challengeChromosomeToolView breedingPenView breedingChromosomeToolView stableView stableChromosomeToolView marketplaceView '.w(),
       
        
        // challenge pool to hold initial, system-created dragons
        challengePoolView: SC.View.design({
          className: 'transparent'.w(),
          childViews: "titleView dragonsView".w(),
          layout: { left: 20, top: 150, width:70, height: 300 },
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
        challengeChromosomeToolView: Geniverse.ChromosomeToolView.design({
        layout: { left:55, top: 120, width: 35, height: 30 },
          selectionBinding: 'Geniverse.challengePoolController.selection'
        }),
        
        breedView: Geniverse.BreedDragonView.design({
          layout: { top: 150 , left: 100, height: 300, width: 150 },
          showChildView: NO // child as in baby dragon
        }),
        
        // Breeding pen with eggs
        breedingPenView: SC.View.design ({
          childViews: "titleView penView".w(),
          layout: { left: 265, top: 150, width: 300, height: 300 },
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
          layout: { left: 265 + 300 - 35, top: 120, width: 35, height: 40 },
          selectionBinding: 'Geniverse.eggsController.selection'
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
        
        statsView: Geniverse.StatsView.design({
          layout: { left: 565, top: 150 + (300 - 80), width: 60, height: 80 }
        }),
        
        stableChromosomeToolView: Geniverse.ChromosomeToolView.design({
        layout: { left:680 + 240 - 35, top: 120, width: 35, height: 30 },
          selectionBinding: 'Geniverse.stableOrganismsController.selection'
        }),

        stableView: SC.View.design({
          layout: { left: 680, top: 150, height: 300, width: 240 },
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
            }.property('Geniverse.stableOrganismsController.arrangedObjects.[]'),
            destroy: function() {
              Geniverse.stableOrganismsController.removeObserver("arrangedObjects", this, this.woo);
              Geniverse.stableOrganismsController.removeObserver("[]", this, this.woo);
              sc_super();
            }
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
                var dragon = drag.get('source').get('content');
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
        }),
      })
    })
  }),
  
});
