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
sc_require('models/dragon');
Geniverse.main = function main() {
  
    SC.ExceptionHandler.handleException = function (exception) {
      // Will do nothing because uncaught exception will show in console
      // for developers
    };
 
    // resources:
    //1. Training screen - chromosomes with pulldown, currently at sproutcore/intro
    //2. Experiment screen
    //3. Individual challenge screen
    //4. Group challenge screen

    //var mainPane = Geniverse.getPath('trainingPage.mainPane');
    // var mainPane = Geniverse.getPath('experimentPage.mainPane');
    // var mainPane = Geniverse.getPath('individualPage.mainPane');
    var mainPane = Geniverse.getPath('groupChallengePage.mainPane');
    mainPane.append();
    Geniverse.appController.set('mainPane', mainPane);
    //Geniverse.getPath('individualPage.mainPane').append();
    //Geniverse.getPath('groupChallengePage.mainPane').append();

    Geniverse.store.commitRecordsAutomatically = NO;
    
    Geniverse.makeFirstResponder(Geniverse.START);
};

function main() { Geniverse.main(); }
