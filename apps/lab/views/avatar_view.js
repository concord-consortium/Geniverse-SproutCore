// avatarview
Lab.AvatarView = SC.View.extend(
/** @scope Lab.AvatarView.prototype */ {
  touchStart: function(evt){
    evt.allowDefault();
    return YES;
  },
  touchEnd: function(evt){
    evt.allowDefault();
    this.click();
    return YES;
  }
});