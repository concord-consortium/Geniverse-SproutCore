// ==========================================================================
// Project:   Geniverse - NotepadView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/**
 *   @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
Geniverse.BlogPostView = SC.PalettePane.design({
  layout: { width: 440, height: 505, centerX: 0, centerY: 0 },
  isModal:NO,
  
  
  defaultResponder: 'Lab.statechart',
  
  
  contentView: SC.View.extend({
    childViews: 'titleView blogTitleView blogPostView1 blogPostView2 blogPostView3 cancelButton postButton'.w(),

    titleView: SC.LabelView.design({
      layout: { centerY: 0, height: 24, left: 0, top:0, width: 440 },
      //valueBinding: this.get('titlePath'),
      value: 'Post to the Journal',
      controlSize: "bity",
      fontWeight: SC.BOLD_WEIGHT,
      controlSize: SC.LARGE_CONTROL_SIZE,
      textAlign: SC.ALIGN_CENTER,
      classNames: "sc-pane sc-main sc-theme".w()
    }),

    cancelButton: SC.ButtonView.extend({
      layout: { bottom: 5, right: 210, width: 150, height: 24 },
      title: "Cancel",
      action: "closePanel"
    }),

    postButton: SC.ButtonView.extend({
      layout: { bottom: 5, right: 5, width: 200, height: 24 },
      title: "Post",
      action: "post"
    }),
    
    blogTitleView: SC.TextFieldView.design({
      layout: { left: 10, top: 29, width: 420, height: 35 },
      hint: "Type your CLAIM here",
      fontWeight: SC.BOLD_WEIGHT,
      isEditable: YES,
      isTextArea: NO,
      valueBinding: "Geniverse.blogPostController.title"
    }),

    // TODO: Solve Firefox bug: titleView lacks dark background, making title hard to read 
    blogPostView1: SC.TextFieldView.design({
      layout: { left: 10, top: 69, width: 420, height: 174 },
      hint: "Type your EVIDENCE here",
      isEditable: YES,
      isTextArea: YES,
      valueBinding: "Geniverse.blogPostController.content1"
    }),
    
    blogPostView2: SC.TextFieldView.design({
      layout: { left: 10, top: 244, width: 420, height: 28 },
      hint: "Evidence URL",
      isEditable: YES,
      isTextArea: NO,
      valueBinding: "Geniverse.blogPostController.content2"
    }),
    
    blogPostView3: SC.TextFieldView.design({
      layout: { left: 10, top: 279, width: 420, height: 190 },
      hint: "Type your REASONING here",
      isEditable: YES,
      isTextArea: YES,
      valueBinding: "Geniverse.blogPostController.content3"
    })
  })
});