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

Geniverse.main = function main() {
  
    SC.ExceptionHandler.handleException = function (exception) {
      // Will do nothing because uncaught exception will show in console
      // for developers
    };
  
    Geniverse.getPath('mainChatExamplePage.mainPane').append();
    // Geniverse.getPath('trainingPage.mainPane').append();

    Geniverse.store.commitRecordsAutomatically = NO;
    
    Geniverse.makeFirstResponder(Geniverse.START);
};

function main() { Geniverse.main(); }
