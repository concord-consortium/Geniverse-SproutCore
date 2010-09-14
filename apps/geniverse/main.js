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
  
    Geniverse.getPath('mainChatExamplePage.mainPane').append();

    Geniverse.store.commitRecordsAutomatically = NO;
    
    function checkGWTReadiness() {
        SC.Logger.log("checkGWTReadiness");
        if (Geniverse.gwtController.get('isReady')) {
            Geniverse.gwtController.removeObserver('isReady', checkGWTReadiness);
            
            Geniverse.set('isLoaded', YES);
            
            // kick off application
            Geniverse.makeFirstResponder(Geniverse.START);
        }
    }
    
    
    Geniverse.gwtController.addObserver('isReady', checkGWTReadiness);
    checkGWTReadiness();

};

function main() { Geniverse.main(); }
