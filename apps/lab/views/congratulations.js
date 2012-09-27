// ==========================================================================
// Project:   Lab - CongratulationsView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */

Lab.CongratulationsView = SC.PalettePane.create({
  layout: { width: 440, height: 430, centerX: 0, centerY: 0 },
  isModal:NO,
  contentView: SC.View.extend({
    childViews: 'titleView congratulationsView hideButton instIcon'.w(),
    classNames: 'parchment'.w(),

    instIcon: SC.ImageView.design({
      layout: { top: 0, left: 4, width: 25, height: 25 },
      value: static_url('stampedInstructions.png')
    }),

    titleView: SC.LabelView.design({
      layout: { centerY: 0, height: 24, left: 0, top:0, width: 440 },
      //valueBinding: this.get('titlePath'),
      value: 'Congratulations',
      controlSize: "info-title",
      fontWeight: SC.BOLD_WEIGHT,
      textAlign: SC.ALIGN_CENTER
    }),

    hideButton: SC.ImageView.extend(Geniverse.SimpleButton, {
      layout: { bottom: 8, right: 8, width: 118, height: 27 },
      isEnabled: YES,
      hasHover: YES,
      classNames: 'closeButton'.w(),
      alt: 'Close',
      title: "Close",
      action: "removeView",
      target: "Lab.congratulationsController"
    }),

    // TODO: Solve Firefox bug: titleView lacks dark background, making title hard to read 
    congratulationsView: SC.LabelView.design({
      layout: { left: 10, top: 24, width: 420, height: 375 },
      value: "please wait...",
      escapeHTML: NO
    })
  })
});
