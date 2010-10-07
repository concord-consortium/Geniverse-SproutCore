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
    var settings = [
    //0. Training screen - chromosomes with pulldown, currently at sproutcore/intro
      { 
        title:          "Training",
        page:           "trainingPage.mainPane"
      },
    //1. Experiment screen
      { 
        title:          "Experiment",
        page:           "experimentPage.mainPane"
      },
    //2. Individual challenge screen
      { 
        title:          "Individual Challenge",
        page:           "individualPage.mainPane"
      },
    //3. Group challenge screen
      { 
        title:          "Group Challenge",
        page:           "groupChallengePage.mainPane"
      }

    ];
    SC.ExceptionHandler.handleException = function (exception) {
      // Will do nothing because uncaught exception will show in console
      // for developers
    };
 
    //
    // HACK to support load activity using its title as DB Key: 
    //
    var setActivity = function(setting_no) {
      var config = settings[setting_no];
      var mainPane = Geniverse.getPath(config.page);
      mainPane.append();
      Geniverse.appController.set('mainPane', mainPane);
      Geniverse.activityController.set('activityTitle',config.title);
    };
    Geniverse.store.commitRecordsAutomatically = NO;
    setActivity(1);
    Geniverse.makeFirstResponder(Geniverse.START);
};

function main() { Geniverse.main(); }
