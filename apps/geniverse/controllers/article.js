// ==========================================================================
// Project:   Geniverse.articleController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse CcChat GenGWT */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.articleController = SC.ObjectController.create(
/** @scope Geniverse.articleController.prototype */ {
  
  isStaticVisible: YES,
  
  isEditingVisible: NO,
  
  isDraftDirty: NO,             // article edited by user since a draft was sent?
  
  isDraftChanged: NO,           // article updated from last published state?
  
  loadTimer: null,
  
  articleDraftChannel: null,
  
  articlePublishingChannel: null,

  claimValue: "<i>Write your thoughts here.</i>",
  
  evidenceValue: '',
  
  combinedArticle: function() {
    var claim = this._htmlize(this.get('claimValue'));
    var evidence = this._htmlize(this.get('evidenceValue'));
    
    if (claim !== null && claim.length > 0){
      claim = "<div class='claim'>"+claim+"</div>";
    }
    
    if (evidence !== null && evidence.length > 0){
      evidence = "<div class='evidence'>"+evidence+"</div>";
    }
    
    var article = "<div id='article'>"+claim + evidence+"</div>";
    return article;
    
  }.property('claimValue', 'evidenceValue').cacheable(),
  
  currentArticle: null,         // state of article before editing, stringized
  
  currentDragons: [],           // dragons before editing
  
  publishedArticle: null,       // last published text
  
  publishedDragons: [],
  
  nowShowing: 'Geniverse.yourArticleView',      // hack for defining start-up tab
  
  init: function(){
    this.set('loadTimer', SC.Timer.schedule({
			target: this,
			action: '_subscribeToArticleChannels',
			interval: 500,
			repeats: YES
		}));
		
    this.set('publishedArticle', this.get('combinedArticle'));
    
		sc_super();
  },
  
  newPaperAction: function() {
    this.set('claimValue', "<i>Write your thoughts here.</i>");
    this.set('evidenceValue', "");
    Geniverse.dragonBinController.clearDragons();
    this.editAction();
  },
  
  editAction: function() {
    var article = this.get('combinedArticle');
    SC.Logger.log("editing, comb = "+article);
    this.set('combinedArticle', article);
    this.set('currentArticle', article);
    this.set('currentDragons', Geniverse.dragonBinController.get('content').slice(0));  // clone array
    
    this.setClaimAndEvidence(article);
      
    this.set('isStaticVisible', NO);
    this.set('isEditingVisible', YES);
  },
  
  setClaimAndEvidence: function(article){
    var pattern = /<div class='claim'>(.*?)<\/div>/;
    var matches = article.match(pattern);
    var claim = matches !== null ? matches[1] : "";
    
    pattern = /<div class='evidence'>(.*?)<\/div>/;
    matches = article.match(pattern);
    var evidence = matches !== null ? matches[1] : "";

    this.set('claimValue', this._stringize(claim));
    this.set('evidenceValue', this._stringize(evidence));
  },
  
  previewDraftAction: function() {
    var editedArticle = this.get('combinedArticle');
    var textChanged = editedArticle !== this.get('currentArticle');
    var dragonsChanged = !Geniverse.dragonBinController.get('content').compareArrays(this.get('currentDragons'));
    if (textChanged || dragonsChanged){
       this.set('isDraftDirty', YES);
    }
    
    var htmlizedArticle = this._htmlize(editedArticle);
    var publishedDragonsChanged = !Geniverse.dragonBinController.get('content').compareArrays(this.get('publishedDragons'));
    this.set('isDraftChanged', (htmlizedArticle !== this.get('publishedArticle') || publishedDragonsChanged));
    
    this.set('combinedArticle', htmlizedArticle);
    this.set('isStaticVisible', YES);
    this.set('isEditingVisible', NO);
  },
  
  sendDraftAction: function(notify) {
    var article = this._htmlize(this.get('combinedArticle'));
    
    var articleDraftChannel = this.get('articleDraftChannel');
    if (articleDraftChannel !== null){
      var username = CcChat.chatController.get('username');
      var dragons = this._getGOrganismArray(Geniverse.dragonBinController.get('content'));
      var message = {article: article, dragons: dragons, author: username};
      CcChat.chatController.post(articleDraftChannel, message);
      
      if (notify === undefined || notify){
        var chatChannel = CcChat.chatRoomController.get('channel');
        var infoMessage = {message: '<i>'+username+" has just updated the draft paper.</i>"};
        CcChat.chatController.post(chatChannel, infoMessage);
      }
    }
  },
  
  publishAction: function() {
    this.sendDraftAction(false);
    
    var article = this._htmlize(this.get('combinedArticle'));
    
    var articleDraftChannel = this.get('articlePublishingChannel');
    if (articleDraftChannel !== null){
      var groupName = "Group "+ (parseInt(CcChat.chatRoomController.get('channelIndex'), 10) + 1);
      var dragons = this._getGOrganismArray(Geniverse.dragonBinController.get('content'));
      var message = {article: article, dragons: dragons, author: groupName};
      CcChat.chatController.post(articleDraftChannel, message);
      
      this.set('publishedArticle', article);
      this.set('publishedDragons', Geniverse.dragonBinController.get('content'));
    }
  },
  
  _getGOrganismArray: function(dragonArray) {
    var gOrganismArray = [];
    for (var i = 0; i < dragonArray.length; i++){
      gOrganismArray.push(dragonArray[i].get('gOrganism'));
    }
    return gOrganismArray;
  },
  
  _subscribeToArticleChannels: function() {
    if (CcChat.chatController.chatHasInitialized && CcChat.chatRoomController.get('channel').length > 0){
      
      var articleDraftChannel = CcChat.chatRoomController.get('channel') + "/articles";
      this.set('articleDraftChannel', articleDraftChannel);
      CcChat.chatController.subscribeToChannel(articleDraftChannel, this.receiveDraftArticle);
      
      var articlePublishingChannel = CcChat.chatRoomController.get('baseChannelName') + "/articles";
      this.set('articlePublishingChannel', articlePublishingChannel);
      CcChat.chatController.subscribeToChannel(articlePublishingChannel, this.receivePublishedArticle);
      
      this.get('loadTimer').invalidate();
    }
  },
  
  receiveDraftArticle: function(message) {
    var article = message.article;
    
    Geniverse.articleController.setClaimAndEvidence(article);
    Geniverse.articleController.receiveDragons(message.dragons);
    
    Geniverse.articleController.set('isDraftDirty', NO);
    Geniverse.articleController.set('isDraftChanged', (article !== Geniverse.articleController.get('publishedArticle')));
  },
  
  receivePublishedArticle: function(message) {
    var article = message.article;
    var now = new Date().getTime();
    var dragons = Geniverse.articleController.createDragonArray(message.dragons);
    
    var publishedArticle = Geniverse.store.createRecord(Geniverse.Article, {
      text: message.article, authors: message.author, dragons: dragons, time: now
    });
    
    CcChat.chatController.addMessage({message: "<i><b>A new paper has been published by "+message.author+"</b></i>"});
  },
  
  receiveDragons: function(gOrganismArray) {
    var dragonArray = this.createDragonArray(gOrganismArray);
    SC.RunLoop.begin();
    Geniverse.dragonBinController.set('content', dragonArray);
    Geniverse.dragonBinController.propertyDidChange('isEmpty');
    Geniverse.dragonBinController.propertyDidChange('dragons');
    SC.RunLoop.end();
  },
  
  createDragonArray: function(gOrganismArray){
    var dragonArray = [];
    for (var i = 0; i < gOrganismArray.length; i++){
      var dragon = this._createNewDragonFromArticle(gOrganismArray[i]);
      dragonArray.push(dragon);
    }
    return dragonArray;
  },
  
  _createNewDragonFromArticle: function(jsonDragon) {
    var dragon = Geniverse.store.createRecord(Geniverse.Dragon, {
      bred: NO, sent: NO
    });
    var gOrg = GenGWT.createDragon(jsonDragon);
    dragon.set('gOrganism', gOrg);
    return dragon;
  },
  
  _htmlize: function(text) {
    if (!text){
      return "";
    }
    text = text.replace(/\n/g, "<br>");
    return text;
  },
  
  _stringize: function(text) {
    if (!text){
      return "";
    }
    text = text.replace(/<br>/g, "\n");
    return text;
  }

}) ;

Array.prototype.compareArrays = function(arr) {
    if (this.length != arr.length) return false;
    for (var i = 0; i < arr.length; i++) {
        if (this[i].compareArrays) { //likely nested array
            if (!this[i].compareArrays(arr[i])) return false;
            else continue;
        }
        if (this[i] != arr[i]) return false;
    }
    return true;
}
