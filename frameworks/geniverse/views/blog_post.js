// ==========================================================================
// Project:   Geniverse - NotepadView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/**
 *   @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */

sc_require('mixins/simple_button');

Geniverse.BlogPostView = SC.PalettePane.design({
  layout: { width: 440, height: 547, centerX: 0, centerY: 0 },
  isModal:NO,


  defaultResponder: 'Lab.statechart',


  contentView: SC.View.extend({
    childViews: 'titleView blogTitleView blogPostView1 blogPostView2 blogPostView3 blogPostView4 cancelButton postButton'.w(),
		classNames: 'parchment'.w(),

    titleView: SC.LabelView.design({
      layout: { centerY: 0, height: 24, left: 0, top:5, width: 440 },
      //valueBinding: this.get('titlePath'),
      value: 'Post to the Journal',
      controlSize: "info-title",
      fontWeight: SC.BOLD_WEIGHT,
      textAlign: SC.ALIGN_CENTER,
//      classNames: "sc-pane sc-main sc-theme".w()
    }),

    blogTitleView: SC.LabelView.design({
      layout: { left: 10, top: 29, width: 420, height: 42 },
      controlSize: "info-title",
      fontWeight: SC.BOLD_WEIGHT,
      textAlign: SC.ALIGN_CENTER,
      valueBinding: "Geniverse.blogPostController.title"
    }),

    cancelButton: SC.ImageView.extend(Geniverse.SimpleButton, {
      layout: { bottom: 5, right: 128, width: 118, height: 27 },
      isEnabled: YES,
      hasHover: YES,
      classNames: 'cancelButton'.w(),
      alt: 'Cancel',
      title: "Cancel",
      action: "closePanel"
    }),

    postButton: SC.ImageView.extend(Geniverse.SimpleButton, {
      layout: { bottom: 5, right: 5, width: 118, height: 27 },
      isEnabled: YES,
      hasHover: YES,
      classNames: 'postButton'.w(),
      alt: 'Post to blog',
      title: "Post",
      action: "post"
    }),

    // TODO: Solve Firefox bug: titleView lacks dark background, making title hard to read
    blogPostView1: SC.TextFieldView.design({
      layout: { left: 10, top: 72, width: 420, height: 35 },
      hint: "Type your CLAIM here",
      fontWeight: SC.BOLD_WEIGHT,
      isEditable: YES,
      isTextArea: NO,
      valueBinding: "Geniverse.blogPostController.content1"
    }),

    blogPostView2: SC.TextFieldView.design({
      layout: { left: 10, top: 112, width: 420, height: 174 },
      hint: "Type your EVIDENCE here",
      isEditable: YES,
      isTextArea: YES,
      valueBinding: "Geniverse.blogPostController.content2"
    }),

    blogPostView3: SC.TextFieldView.design({
      layout: { left: 10, top: 287, width: 420, height: 28 },
      hint: "Evidence URL",
      isEditable: YES,
      isTextArea: NO,
      valueBinding: "Geniverse.blogPostController.content3"
    }),

    blogPostView4: SC.TextFieldView.design({
      layout: { left: 10, top: 322, width: 420, height: 190 },
      hint: "Type your REASONING here",
      isEditable: YES,
      isTextArea: YES,
      valueBinding: "Geniverse.blogPostController.content4"
    })
  })
});