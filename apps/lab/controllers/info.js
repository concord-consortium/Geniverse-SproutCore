// ==========================================================================
// Project:   Lab.infoController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */
sc_require('views/info');
sc_require('views/info_button');

/** @class

  Shows and manages content for a pop-up info view

  @extends SC.ObjectController
  @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
*/
Lab.infoController = SC.ObjectController.create(
/** @scope Lab.infoController.prototype */ {
  pane: null,
  content: "",
  isVisible: NO,
  infoButton: null,
  onClose: null,
  iframe: SC.WebView.create({                //This is an empty iFrame used to make sure the InfoView will be on top of applets
    layoutBinding: 'Lab.InfoView.layout',
    value: static_url('empty.html')}),

  /**
   * Makes the infoButton visible and sets the info view
   * content to the message input if it exists
   * @param message (optional)
   */
  displayButtonOnly: function (message) {
    // Replace the old change sex button image with the new change sex button image in instructions.
    // Slip in scaling attributes along with changing the src URL.
    var oldImagePath = '"https://geniverse-resources.concord.org/resources/icons/change-sex-buttons.png"',
        imgAttrs = ' width="' + Geniverse.ChangeSexButton.WIDTH_SMALL + '"' +
                  ' height="' + Geniverse.ChangeSexButton.HEIGHT_SMALL + '"',
        newImagePath = '"' + static_url('change-sex-button-female.png') + '"' + imgAttrs;
    this.set('isVisible', YES);
    if(message){
      message = message.replace(oldImagePath, newImagePath);
      this.set('content',message);
    }
  },

  /**
   * Makes the infoButton visible, sets the info view
   * content to the message input if it exists, and
   * pops-up the info view.
   * @param message (optional)
   */
  display: function (message, onClose){
    this.displayButtonOnly(message);
    this.showPane(this.infoButton, true);
    this.set("onClose", onClose);
  },

  showPane: function(callingView, muteLogging) {
    //this.set('infoButton', callingView);
    var infoView = Lab.InfoView;//.create();
    this.set('pane',infoView);
    var _pane = this.get('pane');
    if (!_pane.get('isVisibleInWindow')){
      _pane.append();
      if (_pane.get('isVisibleInWindow') && Geniverse.activityController.get('pageContainsApplet')) {
        Geniverse.activityController.get('iframeLayerToAppend').appendChild(this.get('iframe'));
      }
      this.updateView(this.get('content'));
      if (!muteLogging) {
        Lab.logController.logEvent(Lab.EVENT.OPENED_INFO);
      }
    }
  },

  contentDidChange: function () {
    var _content = this.get('content');
    this.updateView(_content);
  }.observes('content'),

  removeView: function (callingView){
    var _pane = this.get('pane');
    if (this.get('pane')) {
      if (_pane.get('isVisibleInWindow') && Geniverse.activityController.get('pageContainsApplet')) {
        this.get('iframe').parentView.removeChild(this.get('iframe'));
      }
      this.get('pane').remove();
      if (callingView) {
        Lab.logController.logEvent(Lab.EVENT.CLOSED_INFO);
      }
    }
    if (onClose = this.get("onClose")) {
      onClose();
    }
  },

  updateView: function (newValue) {
    if (this.get('pane')) {
      this.pane.contentView.infoView.set('value', newValue);
    }
  }

}) ;
