// ==========================================================================
// Project:   Geniverse.ChangeSexButton
// Copyright: ©2016 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  intended to work with Geniverse.SimpleButton
*/

Geniverse.ChangeSexButton = {
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
        femaleRight = 67,
        maleLeft = 140;
    // click on "male" has no effect if sex is already male
    if ((clickOffset > maleLeft) && (currentSex === 0)) return;
    // click on "female" has no effect if sex is already female
    if ((clickOffset < femaleRight) && (currentSex !== 0)) return;
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
