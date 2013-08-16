// generic touch enabled view
Lab.TouchEnabledView = SC.View.extend(
/** @scope Lab.TouchEnabledView.prototype */ {
      touchStart: function(evt){
        evt.allowDefault();
        return YES;
      },

      touchEnd: function(evt){
        evt.allowDefault();
        return YES;
      }
});

