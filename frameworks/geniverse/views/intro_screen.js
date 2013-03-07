// ==========================================================================
// Project:   Geniverse - NotepadView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

Geniverse.IntroScreenView = SC.PanelPane.design({
  layout: {top: 5, left: 5, bottom: 5, right: 5 },
  isModal: YES,

  defaultResponder: 'Lab.statechart',

  contentView: SC.View.extend({
    childViews: 'background imageView hideButton'.w(),
    // separate parallel background so we don't make the rest of the childViews see-through
    background: SC.View.design({
      layout: {top: 0, left: 0, right: 0, bottom: 0},
      classNames: ['genome-view-intro']
    }),

    hideButton: SC.ButtonView.extend({
      layout: { bottom: 5, right: 5, width: 200, height: 24 },
      title: "Continue",
      action: "closePanel"
    }),

    imageView: SC.View.design({
      layout: { left: 5, top: 5, right: 5, bottom: 34 },
      classNames: ['intro-image-wrapper'],
      displayProperties: ['value'],
      valueBinding: "Geniverse.introScreenController.imageUrl",
      render: function(context, firstTime) {
        if (this.get('value')) {
          context.push('<image src="' + this.get('value') + '" />');
        }
      }
    })

  })
});
