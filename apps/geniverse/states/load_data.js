// ==========================================================================
// Project:   Geniverse.LOAD_DATA
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse CcChat */

/** @class

  The load data state. 

  @extends SC.Responder
  @version 0.1
*/
Geniverse.LOAD_DATA = SC.Responder.create(
/** @scope Geniverse.LOGIN.prototype */ {

  nextResponder: null,
  
  // 
  didBecomeFirstResponder: function() {
    SC.Logger.log("LOAD");
    var user = Geniverse.userController.get('content');
    
    var stableQuery = SC.Query.local(Geniverse.Dragon, {
        conditions: 'bred = true AND isEgg = false AND user = {user}',
        user: user,
        orderBy: 'stableOrder'
        /*,
        orderBy: 'storeKey'*/
    });
    var stableOrganisms = Geniverse.store.find(stableQuery);
    Geniverse.bredOrganismsController.set('content', stableOrganisms);
    
    Geniverse.EGGS_QUERY = SC.Query.local('Geniverse.Dragon', {
        conditions: 'bred = true AND isEgg = true AND user = {user}',
        user: user,
        orderBy: 'storeKey'
    });
    
    var eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
    Geniverse.eggsController.set('content', eggs);
    
    var chatQuery = SC.Query.local(CcChat.ChatMessage, {
        orderBy: 'time'
    });
    var chats = CcChat.store.find(chatQuery);
    CcChat.chatListController.set('content', chats);

    var articlesQuery = SC.Query.local(Geniverse.Article, {
        orderBy: 'time'
    });
    var articles = Geniverse.store.find(articlesQuery);
    Geniverse.publishedArticlesController.set('content', articles);
  }
  
}) ;


Geniverse.EGGS_QUERY = null;