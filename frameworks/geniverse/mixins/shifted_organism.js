// ==========================================================================
// Project:   Geniverse.ShiftedOrganism
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your View Here)

  intended to be used with Geniverse.OrganismView
*/

Geniverse.ShiftedOrganism = {
  originalTop: null,

  initMixin: function(arg1, arg2, arg3) {
    this.addObserver('clippingFrame', this, 'adjustLayout');
  },

  adjustLayout: function() {
    if (this.get('isVisible')) {
      var top = this.get('layout').top;
      var originalTop = this.get('originalTop');
      if (originalTop === null) {
        originalTop = top;
        this.set('originalTop', top);
      }

      var shiftSize = Math.round(this.get('clippingFrame').height/8.0);
      var newTop = originalTop - shiftSize;
      var self = this;
      this.invokeLast(function() {
        self.adjust('top', newTop);
      });
    }
  }

};
