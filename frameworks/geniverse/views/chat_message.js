// ==========================================================================
// Geniverse.ChatMessageView
// ==========================================================================

/*globals Geniverse*/
sc_require('core');

/**
  @class
  @extends SC.View
  @author knowuh
  @version ALPHA
*/

Geniverse.ChatMessageView = CcChat.ChatMessageView.extend({
  mouseDown: function(eventID) {
    var self = this;
    var message = this.get('content').get('message');
    var item = this.get('content').get('item');
    SC.Logger.dir(message);
    SC.Logger.dir(item);
    var dragTypes = ['dragonChat'];
    var isType = function(typeName) {
      return (dragTypes.indexOf(typeName) > -1);
    }
    var dragOpts = {
      event: eventID,
      source: self.get('parentView'),
      dragView: self,
      ghost: NO,
      slideBack: NO,
      data: item,
      dataTypes: dragTypes,
      hasDataType: function(typeName) {
        SC.Logger.warn("Type asked for: %s",typeName);
        return isType(typeName);
      },
      dataForType: function(typeName) {
        SC.Logger.warn("Type asked for: %s",typeName);
        if (isType(typeName)) {
          return dragon;
        }
        return null;
      }
    };
    SC.Drag.start(dragOpts);
    SC.Logger.warn("started drag");
  }
});
