// ==========================================================================
// Project:   Geniverse
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse CcChat*/

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
sc_require('resources/main_page_applet_demo');
sc_require('resources/main_page_geniverse_chat');
sc_require('models/dragon');

Geniverse.EGGS_QUERY = SC.Query.local('Geniverse.Dragon', {
    conditions: 'bred = true AND isEgg = true',
    orderBy: 'storeKey'
});

Geniverse.main = function main() {

    // Step 1: Instantiate Your Views
    // The default code here will make the mainPane for your application visible
    // on screen.  If you app gets any level of complexity, you will probably 
    // create multiple pages and panes.  
    Geniverse.getPath('mainChatExamplePage.mainPane').append();

    // Step 2. Set the content property on your primary controller.
    // This will make your app come alive!
    Geniverse.store.commitRecordsAutomatically = YES;

    var fetchDragons = null;

    fetchDragons = function() {
        if (Geniverse.loginController.get('loggedIn')) {
            var user = Geniverse.userController.get('content');
            var query = SC.Query.local(Geniverse.Dragon, {
                conditions: 'bred = true AND isEgg = false AND user = {user}',
                user: user,
                orderBy: 'stableOrder'
                /*,
                orderBy: 'storeKey'*/
            });
            var bred_organisms = Geniverse.store.find(query);
            Geniverse.bredOrganismsController.set('content', bred_organisms);
            Geniverse.loginController.removeObserver('loggedIn', fetchDragons);
        }
    };
    // wait until after the login so we can load just the current user's organisms
    Geniverse.loginController.addObserver('loggedIn', fetchDragons);

    var eggs = Geniverse.store.find(Geniverse.EGGS_QUERY);
    Geniverse.eggsController.set('content', eggs);

    var allDragonsQuery = SC.Query.local(Geniverse.Dragon, {
        conditions: 'sent = true',
        orderBy: 'storeKey'
    });
    var all_organisms = Geniverse.store.find(allDragonsQuery);
    Geniverse.allBredOrganismsController.set('content', all_organisms);

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

    var activityQuery = Geniverse.ACTIVITIES_QUERY;
    var activities = Geniverse.store.find(activityQuery);

    var setActivity = null;

    setActivity = function() {
		// using objectAt because "lastObject" seems missing from SC.Enumerable mixin
        Geniverse.activityController.set('content', activities.objectAt(activities.get('length') - 1)); 
        // log in automatically if UserDefaults found, or wait for user to log in
        Geniverse.appController.checkLoginState();
        activities.removeObserver('status', setActivity);
    };

    // if activities status is immediately READY_CLEAN, then we are loading from fixtures,
    // so we can begin immediately. Otherwise, wait for activities to be loaded from
    // remote data source
    if (activities.get('status') === SC.Record.READY_CLEAN) {
        setActivity();
    } else {
        activities.addObserver('status', setActivity);
    }

    // Geniverse.makeFirstResponder(Geniverse.DEFAULTACTIONS);
};

Geniverse.checkGWTReadiness = function() {
    if (Geniverse.gwtController.get('isReady')) {
        Geniverse.gwtController.removeObserver('isReady', Geniverse, Geniverse.checkGWTReadiness);
        Geniverse.main();
        Geniverse.set('isLoaded', YES);
    }
};

function main() {
    Geniverse.gwtController.addObserver('isReady', Geniverse, Geniverse.checkGWTReadiness);
    Geniverse.checkGWTReadiness();
}
