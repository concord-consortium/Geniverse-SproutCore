// ==========================================================================
// Project:   Geniverse.articleController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse CcChat sc_super */

/** @class

  FIXME: This controller needs refactoring. It was written before the Geniverse.Article model
  was incorporated and activities were being loaded in. This should be focused more around
  the content model object.

  @extends SC.ObjectController
*/
Geniverse.articleController = SC.ObjectController.create(
/** @scope Geniverse.articleController.prototype */ {

  // content: null,      // array of owned Geniverse.Article

  article: null,

  isStaticVisible: YES,

  isEditingVisible: NO,

  isDraftDirty: NO,             // article edited by user since a draft was sent?

  isDraftChanged: NO,           // article updated from last published state?

  loadTimer: null,

  articleDraftChannel: null,

  articlePublishingChannel: null,

  claimValue: "<i>Write your thoughts here.</i>",

  evidenceValue: '',

  reasoningValue: '',

  combinedArticle: function () {
    var claim = this._htmlize(this.get('claimValue'));
    var evidence = this._htmlize(this.get('evidenceValue'));
    var reasoning = this._htmlize(this.get('reasoningValue'));

    if (claim !== null && claim.length > 0) {
      claim = "<div class='claim'>" + claim + "</div>";
    }

    if (evidence !== null && evidence.length > 0) {
      evidence = "<div class='evidence'>" + evidence + "</div>";
    }

    if (reasoning !== null && reasoning.length > 0) {
      reasoning = "<div class='reasoning'>" + reasoning + "</div>";
    }

    var article = "<div id='article'>" + claim + evidence + reasoning + "</div>";
    return article;

  }.property('claimValue', 'evidenceValue', 'reasoningValue').cacheable(),

  currentArticle: null,         // state of article before editing, stringized TEXT

  publishedArticle: null,       // last published text

  nowShowing: 'Geniverse.yourArticleView',      // hack for defining start-up tab

  started: NO,

  initArticle: function(){
    var myArticles = this.get('content');
    if (!this.get('started') && !!myArticles && myArticles.get('length') > 0){
      var article = myArticles.lastObject();
      this.set('article', article);
      if (!!article.get('text')){
        this.setClaimAndEvidence(article.get('text'));
      }
      //
      Geniverse.articleController.set('isDraftDirty', NO);
      Geniverse.articleController.set('isDraftChanged', (article !== Geniverse.articleController.get('publishedArticle')));
      this.set('started', YES);
    } else {
      if (!this.get('started')) {
        this.set('claimValue', "<i>Write your thoughts here.</i>");
        this.set('evidenceValue', "");
        this.set('reasoningValue', "");
        this.set('started', YES);
      }
    }

  }.observes('content'),

  newPaperAction: function() {
    var user = Geniverse.userController.get('content');
    var article = Geniverse.store.createRecord(Geniverse.Article, {
        group: user.get('groupId'), activity: Geniverse.activityController.getPath('content.id')
      });

    SC.RunLoop.begin();
    this.set('article', article);
    this.set('claimValue', "<i>Write your thoughts here.</i>");
    this.set('evidenceValue', "");
    this.set('reasoningValue', "");
    SC.RunLoop.end();
    this.editAction();
  },

  editAction: function() {
    var article = this.get('combinedArticle');
    SC.Logger.log("editing, comb = "+article);
    this.set('combinedArticle', article);
    this.set('currentArticle', article);

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

    pattern = /<div class='reasoning'>(.*?)<\/div>/;
    matches = article.match(pattern);
    var reasoning = matches !== null ? matches[1] : "";

    this.set('claimValue', this._stringize(claim));
    this.set('evidenceValue', this._stringize(evidence));
    this.set('reasoningValue', this._stringize(reasoning));
  },

  previewDraftAction: function() {
    var editedArticle = this.get('combinedArticle');
    var textChanged = true; //for now   //editedArticle !== this.get('currentArticle');
    if (textChanged){
       this.set('isDraftDirty', YES);
    }

    var htmlizedArticle = this._htmlize(editedArticle);
    this.set('isDraftChanged', (YES || htmlizedArticle !== this.get('publishedArticle')));

    this.set('combinedArticle', htmlizedArticle);
    this.set('isStaticVisible', YES);
    this.set('isEditingVisible', NO);
  },

  sendDraftAction: function(notify) {
    var user = Geniverse.userController.get('content');
    var articleText = this._htmlize(this.get('combinedArticle'));
    var now = new Date().getTime();

    var article = this.get('article');
    if (!article){
      article = Geniverse.store.createRecord(Geniverse.Article, {
        group: user.get('groupId'), activity: Geniverse.activityController.getPath('content.id')
      });
      this.set('article', article);
    }
    article.set('text', articleText);
    article.set('time', now);
    article.set('submitted', NO);
    article.set('accepted', NO);


		Geniverse.store.commitRecords();


    var articleDraftChannel = this.get('articleDraftChannel');
    SC.Logger.log("Article Draft Channel = "+articleDraftChannel);
    if (articleDraftChannel !== null){
      var username = CcChat.chatController.get('username');
      var message = {article: articleText, author: username};
      CcChat.chatController.post(articleDraftChannel, message);

      // if (!!notify){
        var chatChannel = CcChat.chatRoomController.get('channel');
        var infoMessage = {message: '<i>'+username+" has just updated the draft paper.</i>"};
        CcChat.chatController.post(chatChannel, infoMessage);
      // }
    }
  },

  publishAction: function() {
    // this.sendDraftAction(false);
    var user = Geniverse.userController.get('content');
    var articleText = this._htmlize(this.get('combinedArticle'));
    var now = new Date().getTime();

    var article = this.get('article');
    if (!article){
      article = Geniverse.store.createRecord(Geniverse.Article, {
        group: user.get('groupId'), activity: Geniverse.activityController.getPath('content.id')
      });
      this.set('article', article);
    }
    article.set('text', articleText);
    article.set('time', now);
    article.set('submitted', YES);
    article.set('accepted', YES);

    Geniverse.store.commitRecords();

    var articleDraftChannel = this.get('articlePublishingChannel');
    if (articleDraftChannel !== null){
      var groupName = "Group "+ user.get('groupId');
      var message = {article: articleText, author: groupName, group: user.get('groupId')};
      CcChat.chatController.post(articleDraftChannel, message);

      this.set('publishedArticle', articleText);
    }
  },

  _subscribeToArticleChannels: function() {
    if (CcChat.chatController.chatHasInitialized && CcChat.chatRoomController.get('channel').length > 0){
      var articleDraftChannel = CcChat.chatRoomController.get('channel') + "/articles";
      this.set('articleDraftChannel', articleDraftChannel);
      CcChat.chatController.subscribeToChannel(articleDraftChannel, this.receiveDraftArticle, this);
    }
  }.observes('CcChat.chatRoomController.channel'),

  receiveDraftArticle: function(message) {
    var article = message.article;

    Geniverse.articleController.setClaimAndEvidence(article);

    Geniverse.articleController.set('isDraftDirty', NO);
    Geniverse.articleController.set('isDraftChanged', (article !== Geniverse.articleController.get('publishedArticle')));
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
    if (this.length != arr.length) { return false ; }
    for (var i = 0; i < arr.length; i++) {
        if (this[i].compareArrays) { //likely nested array
            if (!this[i].compareArrays(arr[i]))  {
              return false;
            }
            else {
              continue;
            }
        }
        if (this[i] != arr[i]) { return false; }
    }
    return true;
} ;
