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

    childViews: 'pleaseWait welcome scarlett strider scarlettLabel striderLabel'.w(),

    pleaseWait: SC.LabelView.design({
      layout: { top: 30, width: 660, height: 60, centerX: 0 },
      classNames: ['avatar','title'],
      value: "<div>Please wait...</div>",
      escapeHTML: NO,
      isVisibleBinding: 'Lab.avatarController.waiting'
    }),

    welcome: SC.LabelView.design({
      layout: { top: 30, width: 660, height: 80, centerX: 0 },
      classNames: ['avatar','title'],
      value: "<div>A grand adventure awaits...<br/>Choose a character and begin your journey!</div>",
      escapeHTML: NO,
      isVisibleBinding: SC.Binding.not('Lab.avatarController.waiting')
    }),

    scarlett: Lab.AvatarView.design({
      layerId: 'scarlett',
      layout: {top: 110, width: 340, height: 545, centerX: -170},
      isVisibleBinding: SC.Binding.not('Lab.avatarController.waiting'),
      click: function() {
        Lab.statechart.sendAction("choseScarlett");
        return YES;
      }
    }),

    scarlettLabel: SC.LabelView.design({
      layout: { top: 660, width: 340, height: 60, centerX: -190 },
      classNames: ['avatar','title'],
      value: "<div>SCARLETT</div>",
      escapeHTML: NO,
      isVisibleBinding: SC.Binding.not('Lab.avatarController.waiting'),
      click: function() {
        Lab.statechart.sendAction("choseScarlett");
        return YES;
      }
    }),

    strider: Lab.AvatarView.design({
      layerId: 'strider',
      layout: {top: 120, width: 340, height: 540, centerX: 170},
      isVisibleBinding: SC.Binding.not('Lab.avatarController.waiting'),
      click: function() {
        Lab.statechart.sendAction("choseStrider");
        return YES;
      }
    }),

    striderLabel: SC.LabelView.design({
      layout: { top: 660, width: 340, height: 60, centerX: 190 },
      classNames: ['avatar','title'],
      value: "<div>STRIDER</div>",
      escapeHTML: NO,
      isVisibleBinding: SC.Binding.not('Lab.avatarController.waiting'),
      click: function() {
        Lab.statechart.sendAction("choseStrider");
        return YES;
      }
    })

  })
});
