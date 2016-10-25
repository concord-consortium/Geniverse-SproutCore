// ==========================================================================
// Project:   Lab.backdoorController
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Lab */

Lab.backdoorController = SC.Object.create(
/** @scope Lab.avatarController.prototype */ {
  pane: SC.PanelPane.create({
    layout: {width: 200, height: 100, centerX: 0, centerY: 0},
    isModal: YES,
    contentView: SC.View.design({
      classNames: 'overflowVis',
      childViews: 'prompt code submit close'.w(),
      prompt: SC.LabelView.design({
        layout: { top: 5, left: 5, width: 190, height: 24 },
        value: "Enter code:"
      }),
      code: SC.TextFieldView.design({
        layout: { top: 29, left: 5, width: 190, height: 24 },
        valueBinding: 'Lab.backdoorController.code'
      }),
      submit: SC.ButtonView.design({
        layout: { top: 63, right: 5, width: 95, height: 24 },
        title: "process &raquo;",
        target: 'Lab.backdoorController',
        action: 'executeBackdoor'
      }),
      close: SC.ImageView.design({
        layout: { right: -8, top: -8, width: 24, height: 24 },
        value: 'sc-icon-cancel-24',
        click: function() {
          Lab.backdoorController.removePane();
        }
      })
    })
  }),

  code: '',
  executeBackdoor: function() {
    switch(this.get('code')) {
      case "vroom":
        Geniverse.userController.setAccelerated(true);
        Geniverse.unlockablesController.unlockAllLocked();
        break;
      case "starz":
        if (Geniverse.userController.get('isTeacher')) {
          // open the starz report in a new tab
          var encoded = this._encodeClasses();
          try {
            window.open(Geniverse.railsBackendBase + '/starsReport/' + encoded, "_blank");
          } catch (e) { }
        }
        break;
      case "":
        break;
      default:
        console.log("unrecognized backdoor code: " + this.get('code'));
    }
    this.removePane();
  },

  _encodeClasses: function(class_names) {
    var encoded;
    if (typeof(class_names) === 'undefined' || class_names === null) {
      var all_classes = Geniverse.userController.get('allClassNames');
      class_names = all_classes[0];
      for (var i = 1; i < all_classes.length; i++) {
        class_names += ',' + all_classes[i];
      }
    }
    encoded = window.btoa(class_names);
    encoded = encoded.replace(/\//g,'_').replace(/\+/g,'-').replace(/=/g,'%3D');
    return encoded;
  },

  showPane: function() {
    var _pane = this.get('pane');
    if (_pane && !_pane.get('isVisibleInWindow')){
      _pane.append();
    }
  },

  removePane: function() {
    this.set('code',"");
    var _pane = this.get('pane');
    if (_pane && _pane.get('isVisibleInWindow')){
      this.get('pane').remove();
    }
  }
}) ;
