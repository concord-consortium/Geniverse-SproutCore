// ==========================================================================
// Project:   Geniverse Lab - Caselog page
// Copyright: ©2012 Concord Consortium
// ==========================================================================
/*globals Geniverse Lab*/

sc_require('views/top_bar_view');
sc_require('views/bottom_bar_view');

Lab.caselogPage = SC.Page.design({

  // used for the index page
  pagePath: 'Lab.caselogPage',
  title: 'Caselog Page',

  mainPane: SC.MainPane.design({

    layout: { minWidth: 1056, minHeight: 820 },
    childViews: ['caselogView', 'topBar'],
    classNames: ['mainPane'],

    caselogView: Lab.TouchEnabledView.design({

      layout: { top: 57 },
      classNames: ['caselog-view','mainPane'],

      currentLevelBinding:     'Lab.caselogController.currentLevel',
      currentLevelNameBinding: 'Lab.caselogController.currentLevelName',
      levelsBinding:           'Lab.caselogController.levels',

      displayProperties: ['currentLevel', 'levels'],

      render: function (context, isFirstTime) {

        var currentLevel     = this.get('currentLevel'),
            currentLevelName = this.get('currentLevelName'),
            levels           = this.get('levels'),
            cases, i, max_i,
            challenges, j, max_j,
            starClassFor,
            levelNames, extraClassNames;

        // Note that if you go to the caselog route on the initial app load, then currentLevel is undefined
        // because the binding hasn't had time to sync. If so, schedule a render for the next runloop, when the binding
        // will have synced.

        // Also, if isFirstTime == false (we're being asked to re-render the view because currentLevel changed)
        // render from scratch instead of trying to modify the view's DOM to match the required output. In order to
        // do that and not confuse SC.View, schedule a render for the next runloop.

        if ( !isFirstTime || typeof levels === 'undefined' || typeof currentLevel === 'undefined' || typeof currentLevelName === 'undefined') {
          this.invokeLast(this.replaceLayer);
          return;
        }

        // Okay, render up some fresh HTML.

        cases = levels[currentLevel].cases;

        context.push('<div id="caselog-wrap">');
        context.push('<div id="caselog-book">');

        context.push('<div id="col1">');

        context.push('<div id="title">');
        context.push('<div class="title">Case Log</div>');
        context.push('<div class="section">' + currentLevelName.capitalize() + '</div>');
        context.push('</div>');


        starClassFor = function(starInfo) {
          starInfo = starInfo || {};

          if (starInfo.useQuill) {
            return starInfo.stars > 0 ? 'quill-on' : 'quill-off';
          }

          switch (starInfo.stars) {
            case 1:
              return 'one-star';
            case 2:
              return 'two-star';
            case 3:
              return 'three-star';
          }
          return 'no-star';
        };

        for (i = 0, max_i = cases.length; i < max_i; i++) {
          var extra = "";
          if (cases[i].hidden && !Geniverse.userController.isAccelerated() && !Geniverse.userController.isUnlocked(currentLevelName, cases[i].title)) {
            extra = ' style="display: none;"';
          }
          context.push('<div class="case caselog-active case' + i + '"' + extra + '>');
          context.push('<div class="title"><div>' + cases[i].title + '</div></div>');
          context.push('<ul>');

          challenges = cases[i].challenges;
          for (j = 0, max_j = challenges.length; j < max_j; j++) {
            context.push('<li class="' + starClassFor(challenges[j].starInfo) + '"><a href="' + challenges[j].href + '">' + challenges[j].title + '</a></li>');
          }
          context.push('</ul>');
          context.push('</div>');

          if (i === 1) {
            // push the third and subsequent cases into the second column
            context.push('</div>');
            context.push('<div id="col2">');
          }
        }

        context.push('</div>');     // #col1/#col2
        context.push('</div>');     // #caselog

        context.push('<div id="caselog-nav">');
        context.push('<ul>');

        levelNames  = Lab.caselogController.levelNames;

        for (i = 0, max_i = levelNames.length; i < max_i; i++) {
          extraClassNames = i <= currentLevel ? 'caselog-active' : '';
          context.push('<li id="' + levelNames[i] + '" class="' + extraClassNames + '"><a href="#caselog/' + levelNames[i] + '"><div></div></a></li>');
        }

        context.push('</ul>');
        context.push('</div>');
        context.push('</div>');

        return context;
      }
    }),

    topBar: Lab.TopBarView.design({
      classNames: ['brown']
    })

  })

});
