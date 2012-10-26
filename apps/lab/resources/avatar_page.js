// ==========================================================================
// Project:   Lab - avatarPage
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse */

Lab.avatarPage = SC.Page.design({
  pagePath: 'Lab.avatarPage',
  title: 'Lab Avatar Page',

  mainPane: SC.MainPane.design({
    defaultResponder: Lab.statechart,

    childViews: 'pleaseWait welcome scarlett alexandre'.w(),

    pleaseWait: SC.LabelView.design({
      layout: { top: 40, width: 610, height: 40, centerX: 0 },
      classNames: ['avatar','title'],
      fontWeight: SC.BOLD_WEIGHT,
      value: "Please wait...",
      isVisibleBinding: 'Lab.avatarController.waiting'
    }),

    welcome: SC.LabelView.design({
      layout: { top: 40, width: 610, height: 40, centerX: 0 },
      classNames: ['avatar','title'],
      fontWeight: SC.BOLD_WEIGHT,
      value: "Select your avatar:",
      isVisibleBinding: SC.Binding.not('Lab.avatarController.waiting')
    }),

    scarlett: SC.LabelView.design({
      layout: {top: 110, width: 200, height: 100, centerX: -100},
      value: "Scarlett",
      isVisibleBinding: SC.Binding.not('Lab.avatarController.waiting'),
      click: function() {
        Lab.statechart.sendAction("choseScarlett");
        return YES;
      }
    }),

    alexandre: SC.LabelView.design({
      layout: {top: 110, width: 200, height: 100, centerX: 100},
      value: "Alexandre",
      isVisibleBinding: SC.Binding.not('Lab.avatarController.waiting'),
      click: function() {
        Lab.statechart.sendAction("choseAlexandre");
        return YES;
      }
    })
  })
});
