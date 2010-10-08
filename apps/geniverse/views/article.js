// ==========================================================================
// Project:   Geniverse.ArticleView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('views/dragon_bin');
Geniverse.ArticleView = SC.View.extend(SC.StaticLayout,
/** @scope Geniverse.ArticleView.prototype */ {
  
  childViews: 'staticView editingView'.w(),
  
  staticView: SC.View.extend(SC.StaticLayout, {

      childViews: 'textView dragonBinView newButtonView editButtonView sendDraftButtonView publishButtonView'.w(),
      
      textView: SC.ScrollView.design({
        hasHorizontalScroller: NO,
        layout: { left: 0, top: 0, right: 0, height: 140 },
        contentView: SC.LabelView.design({
          layout: { left: 0, top: 0, right: 0, bottom: 0 },
    		  isEditable: NO,
          escapeHTML: NO,
          valueBinding: 'Geniverse.articleController.combinedArticle',
          
          checkIfHeightChanged: function() {
            if (Geniverse.articleController.get('isStaticVisible')){
              var timer = SC.Timer.schedule({
        			  target: this,
        			  action: 'changeHeight',
        			  interval: 200,
        			  repeats: NO
        		  });
      		  }
          }.observes('Geniverse.articleController.isStaticVisible'),
          
          changeHeight: function() {
            var height = document.getElementById('article').offsetHeight;
            if (height > 0){
              this.adjust('height', height);
            }
          }
        })
      }),
      
      dragonBinView: Geniverse.DragonBinView.design({
        layout: { top: 145, height: 40, left: 20, width: 240 },
        isDropTarget: NO,
        dragonsBinding: 'Geniverse.dragonBinController'        
      }),
      
      newButtonView: SC.ButtonView.design({
        layout: { top: 160, height: 24, left: 0, width: 95 },
        title:  "New paper",
        target: 'Geniverse.articleController',
        action: 'newPaperAction',
        isEnabledBinding: SC.Binding.not('Geniverse.articleController.isDraftChanged')
      }),

      editButtonView: SC.ButtonView.design({
        layout: { top: 160, height: 24, left: 100, width: 80 },
        title:  "Edit",
        target: 'Geniverse.articleController',
        action: 'editAction',
        isEnabledBinding: 'Geniverse.articleController.isDraftChanged'
      }),
      
      sendDraftButtonView: SC.ButtonView.design({
        layout: { top: 160, height: 24, left: 190, width: 90 },
        title:  "Send draft",
        target: 'Geniverse.articleController',
        action: 'sendDraftAction',
        isEnabledBinding: 'Geniverse.articleController.isDraftDirty'
      }),
      
      publishButtonView: SC.ButtonView.design({
        layout: { top: 160, height: 24, left: 290, width: 90 },
        title:  "Publish",
        target: 'Geniverse.articleController',
        action: 'publishAction',
        isEnabledBinding: 'Geniverse.articleController.isDraftChanged'
      }),
      
      isVisibleBinding: 'Geniverse.articleController.isStaticVisible'
    }),
    
    editingView: SC.View.extend(SC.StaticLayout, {

      childViews: 'claimLabel inputClaimView evidenceLabel inputEvidenceView dragonBinView clearDragonsButton previewButtonView'.w(),
      
      claimLabel: SC.LabelView.design({
          layout: {left: 0, top: 0, right: 0, height: 24 },
          value: "Claim:"
      }),
      
      inputClaimView: SC.TextFieldView.design({
        layout: {left: 0, top: 25, right: 0, height: 20 },
        isTextArea: YES,
        valueBinding: 'Geniverse.articleController.claimValue'
    	}),
    	
    	evidenceLabel: SC.LabelView.design({
          layout: {left: 0, top: 55, right: 0, height: 24 },
          value: "Evidence:"
      }),
      
      inputEvidenceView: SC.TextFieldView.design({
        layout: {left: 0, top: 80, right: 0, height: 50 },
        isTextArea: YES,
        valueBinding: 'Geniverse.articleController.evidenceValue'
    	}),
      
      dragonBinView: Geniverse.DragonBinView.design({
        layout: { top: 145, height: 40, left: 5, width: 240 },
        dragonsBinding: 'Geniverse.dragonBinController'
      }),
      
      clearDragonsButton: SC.ButtonView.design({
        layout: { top: 160, height: 24, left: 260, width: 80 },
        title:  "Clear",
        target: 'Geniverse.dragonBinController',
        action: 'clearDragons'
      }),

      previewButtonView: SC.ButtonView.design({
        layout: { top: 160, height: 24, right: 15, width: 80 },
        title:  "Preview",
        target: 'Geniverse.articleController',
        action: 'previewDraftAction'
      }),
      
      isVisibleBinding: 'Geniverse.articleController.isEditingVisible'
    })
  
	
  
});
