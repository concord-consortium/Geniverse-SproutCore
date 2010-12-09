// ==========================================================================
// Project:   Lab - InfoButtonView
// Copyright: 2010 Concord Consortium
// ==========================================================================
/**
 * Button that pops down an informational message pane.
 * This is a composite view component.
 * Some code cribbed from http://www.itsgotwhatplantscrave.com/2009/07/29/composite-views/
 * We've broken Rule #3 by setting defaults for DRYness sake. Be sure to set the xPaths to something
 * else if the defaults do not fit your needs. You might also want to use a class in /resources that
 * extends this view.
 * Rule #3: View Bindings must only be set up in the instances in /resources
 * http://www.itsgotwhatplantscrave.com/2009/06/20/bindings-unleashed/
 * @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
/*globals Lab */

Lab.InfoButtonView = SC.ButtonView.design(
/** @scope Lab.InfoButtonView.prototype */ {
  /**
   * Necessary configuration xPath elements to set up binding inside the composite view instances
   */
  //contentPath: '', // Binding Path for the content of the xSubView
  /**
   * Binding Path for the target property of the infoButton
   */
  //infoButtonViewTargetPath: 'Lab.infoController',
  /**
   * Binding Path for the value of the geniverseLabelView
   */
  layout: { centerX: 0, centerY: 0, height: 24, left: 408, width: 44 },
  // TODO: Make the icon centered on the button
  icon: 'sc-icon-info-16',
  titleMinWidth: 44,
  layerId: 'infoButton',
  toolTip:  "Information Button",
  target: 'Lab.infoController',
  action: 'showPane',
  isVisibleBinding: 'Lab.infoController.isVisible', 
  didTriggerAction: function(){
    console.log("infoButton.didTriggerAction() called");
    console.log("infoButton.isActive:",this.get('isActive'));
    console.log("infoButton.isSelected:",this.get('isSelected'));
  }
});