// ==========================================================================
// Project:   Lab - HelpView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */

/**
 *   @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
Lab.HelpView = SC.PalettePane.create({
  layout: { width: 600, height: 600, centerX: 0, centerY: 0 },
  isModal:NO,
  contentView: SC.View.extend({
    childViews: 'titleView helpView hideButton helpIcon'.w(),
		classNames: 'parchment'.w(),

		helpIcon: SC.ImageView.design({
			layout: { top: 0, left: 4, width: 25, height: 25 },
			value: static_url('stampedHelp.png')
		}),

    titleView: SC.LabelView.design({
      layout: { centerY: 0, height: 24, left: 0, top:0, width: 600 },
      //valueBinding: this.get('titlePath'),
      value: 'Help',
      controlSize: "info-title",
      fontWeight: SC.BOLD_WEIGHT,
      textAlign: SC.ALIGN_CENTER
    }),

    hideButton: SC.ButtonView.extend({
      layout: { bottom: 5, right: 5, width: 100, height: 24 },
      title: "Close",
      action: "removeView",
      target: "Lab.helpController"
    }),

    // TODO: Solve Firefox bug: titleView lacks dark background, making title hard to read 
    helpView: SC.LabelView.design({
      layout: { left: 10, top: 30, width: 580, height: 539 },
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