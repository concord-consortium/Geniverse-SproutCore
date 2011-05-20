// ==========================================================================
// Project:   Geniverse.ArticleView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */
sc_require('views/dragon_bin');

/** @class

  // TODO: (Document Your View Here)

  @extends SC.View
*/
Geniverse.ArticleView = SC.View.extend(SC.StaticLayout,
/** @scope Geniverse.ArticleView.prototype */ {
  
  childViews: 'staticView editingView'.w(),
  
  staticView: SC.View.extend(SC.StaticLayout, {

      childViews: 'textView newButtonView editButtonView sendDraftButtonView'.w(),
      
      textView: SC.ScrollView.design({
        hasHorizontalScroller: NO,
        classNames: ['article_text'],
        layout: { left: 0, top: 0, right: 0, height: 170 },
        contentView: SC.LabelView.design({
          layout: { left: 0, top: 0, right: 0, bottom: 0 },
    		  isEditable: NO,
    		  isTextSelectable: YES,
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

          destroy: function() {
            Geniverse.articleController.removeObserver('isStaticVisible', this, this.checkIfHeightChanged);
            sc_super();
          },

          changeHeight: function() {
            var articleElement = document.getElementById('article');
            if (articleElement) {
              var height = articleElement.offsetHeight;
              if ((height) && (height > 0)) {
                this.adjust('height', height);
              }
            }
          }
        })
      }),
      
      newButtonView: SC.ButtonView.design({
        layout: { bottom: 15, height: 24, left: 0, width: 95 },
        title:  "New paper",
        target: 'Geniverse.articleController',
        action: 'newPaperAction',
        isEnabledBinding: SC.Binding.not('Geniverse.articleController.isDraftChanged')
      }),

      editButtonView: SC.ButtonView.design({
        layout: { bottom: 15, height: 24, left: 100, width: 80 },
        title:  "Edit",
        target: 'Geniverse.articleController',
        action: 'editAction',
        isEnabledBinding: 'Geniverse.articleController.isDraftChanged'
      }),
      
      sendDraftButtonView: SC.ButtonView.design({
        layout: { bottom: 15, height: 24, left: 190, width: 150 },
        title:  "Send draft to group",
        target: 'Geniverse.articleController',
        action: 'sendDraftAction',
        isEnabledBinding: 'Geniverse.articleController.isDraftDirty'
      }),
      
      isVisibleBinding: 'Geniverse.articleController.isStaticVisible'
    }),
    
    editingView: SC.View.extend(SC.StaticLayout, {

      childViews: 'entryView previewButtonView'.w(),
      
      entryView: SC.View.design({
        childViews: 'claimLabel inputClaimView evidenceLabel inputEvidenceView reasoningLabel inputReasoningView'.w(),
        
        layout: {left: 0, top: 0, right: 0, height: 170 },
        
        classNames: ['article_text'],
        
        claimLabel: SC.LabelView.design({
            layout: {left: 0, top: 0, right: 0, height: 16 },
            value: "Claim:"
        }),

        inputClaimView: SC.TextFieldView.design({
          layout: {left: 0, top: 17, right: 0, height: 20 },
          isTextArea: YES,
          valueBinding: 'Geniverse.articleController.claimValue'
      	}),

      	evidenceLabel: SC.LabelView.design({
            layout: {left: 0, top: 40, right: 0, height: 18 },
            value: "Evidence:"
        }),

        inputEvidenceView: SC.TextFieldView.design({
          layout: {left: 0, top: 59, right: 0, height: 37 },
          isTextArea: YES,
          valueBinding: 'Geniverse.articleController.evidenceValue'
      	}),
      	
        reasoningLabel: SC.LabelView.design({
            layout: {left: 0, top: 97, right: 0, height: 18 },
            value: "Reasoning:"
        }),
        
        inputReasoningView: SC.TextFieldView.design({
          layout: {left: 0, top: 115, right: 0, height: 50 },
          isTextArea: YES,
          valueBinding: 'Geniverse.articleController.reasoningValue'
      	})
      }),

      previewButtonView: SC.ButtonView.design({
        layout: { bottom: 15, height: 24, right: 15, width: 80 },
        title:  "Preview",
        target: 'Geniverse.articleController',
        action: 'previewDraftAction'
      }),
      
      isVisibleBinding: 'Geniverse.articleController.isEditingVisible'
    })
  
	
  
});
