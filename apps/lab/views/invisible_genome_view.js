// ==========================================================================
// Project:   Lab - ChallengePoolView
// Copyright: 2010 Concord Consortium
// ==========================================================================
/*globals Lab */

Lab.InvisibleGenomeView = SC.View.extend({

  childViews: 'questionMark revealButton'.w(),

  sex: 0,

  questionMark: SC.ImageView.design({
    layout: {centerY: -120, centerX: 0, width: 235, height: 235 },
    value: sc_static("question_mark.png"),
    classNames: ['opaque']
  }),

  revealButton: SC.ButtonView.design({
    layout: { centerX: 0, centerY: 20, height: 24, width: 130 },
    title:  "Ready to Answer",
    target: "Lab.statechart",
    action: function() {
      if (this.getPath('parentView.sex') === 0) {
        return 'solveInvisibleMaleGenotype';
      } else {
        return 'solveInvisibleFemaleGenotype';
      }
    }.property('*parentView.sex')
   })

});
