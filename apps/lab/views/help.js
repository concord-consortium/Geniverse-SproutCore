// ==========================================================================
// Project:   Lab - HelpView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */

/**
 *   @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
Lab.HelpView = SC.PickerPane.create({
  layout: { width: 440, height: 430, centerX: 0, centerY: 0 },
  isModal:NO,
  contentView: SC.View.extend({
    childViews: 'titleView helpView hideButton'.w(),

    titleView: SC.LabelView.design({
      layout: { centerY: 0, height: 24, left: 0, top:0, width: 440 },
      //valueBinding: this.get('titlePath'),
      value: 'Help',
      controlSize: "bity",
      fontWeight: SC.BOLD_WEIGHT,
      textAlign: SC.ALIGN_CENTER,
      classNames: "sc-pane sc-main sc-theme".w()
    }),

    hideButton: SC.ButtonView.extend({
      layout: { bottom: 5, right: 5, width: 100, height: 24 },
      title: "Close",
      action: "removeView",
      target: "Lab.helpController"
    }),

    // TODO: Solve Firefox bug: titleView lacks dark background, making title hard to read 
    helpView: SC.LabelView.design({
      layout: { left: 10, top: 24, width: 420, height: 375 },
      //valueBinding: "Lab.helpController.content"
      value: "please wait...",
      escapeHTML: NO,
      helpViewValueDidChange: function () {
        var helpViewValue = this.get('value');
        console.log('helpViewValueDidChange to:',helpViewValue);
//        console.log("setting helpController content");
//        Lab.helpController.set('content',helpViewValue);
      }.observes('value')
    })
  })
});