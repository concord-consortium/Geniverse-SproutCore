// ==========================================================================
// Project:   Geniverse.ChangeSexButton
// Copyright: ©2016 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  intended to work with Geniverse.SimpleButton
*/

Geniverse.ChangeSexButton = (function() {

  var BUTTON_WIDTH = 164,
      BUTTON_HEIGHT = 32,
      FEMALE_LABEL_WIDTH = 60,
      MALE_LABEL_WIDTH = 42,
      // different image used in instructions
      BUTTON_WIDTH_INSTR_RSRC = 174,
      BUTTON_HEIGHT_INSTR_RSRC = 32,
      BUTTON_WIDTH_INSTR = BUTTON_WIDTH_INSTR_RSRC * 3 / 4,
      BUTTON_HEIGHT_INSTR = BUTTON_HEIGHT_INSTR_RSRC * 3 / 4;

  return {
    WIDTH: BUTTON_WIDTH,
    HEIGHT: BUTTON_HEIGHT,
    WIDTH_INSTR: BUTTON_WIDTH_INSTR,
    HEIGHT_INSTR: BUTTON_HEIGHT_INSTR,
    
    isEnabled: YES,
    hasHover: YES,
    classNames: "switchsex switch-female".w(),
    alt: 'Switch Sex',
    title: 'Switch Sex',
    toolTip: 'Click to switch the sex of the drake',
    sexBinding: '*parentView.genomeView.sex',
    mouseUp: function(evt) {
      var currentSex = this.getPath('parentView.genomeView.sex'),
          parent = this.get('parentView'),
          buttonFrame = this.get('frame'),
          buttonFrameInPage = parent
                                ? parent.convertFrameToView(buttonFrame, null)
                                : buttonFrame;
          clickOffset = evt.pageX - buttonFrameInPage.x,
          femaleLimit = FEMALE_LABEL_WIDTH,
          maleLimit = BUTTON_WIDTH - MALE_LABEL_WIDTH;
      // click on "male" has no effect if sex is already male
      if ((clickOffset >= maleLimit) && (currentSex === 0)) return;
      // click on "female" has no effect if sex is already female
      if ((clickOffset <= femaleLimit) && (currentSex !== 0)) return;
      // in all other cases, let the default handler have it
      sc_super();
    },
    target: 'parentView.genomeView',
    action: 'switchSex',
    _setClassNames: function(){
      classNames = this.get('classNames');
      classNames.removeObject("switch-female");
      classNames.removeObject("switch-male");

      classNames.push( this.getPath('parentView.genomeView.sex') === 0 ? "switch-male" : "switch-female");
      this.set('classNames', classNames);
      this.displayDidChange();
    }.observes('sex')
  };
}());
