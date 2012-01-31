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
    
    childViews: ['caselogView'],
    
    caselogView: SC.View.design({
      
      classNames: ['caselog-view'],
      
      render: function (context, isFirstTime) {
        var  cases = Lab.caselogController.levels[Lab.LEVEL_TRAINING].cases,
             i, max_i, challenges, j, max_j;
        
        if (isFirstTime) {
          context.push('<div id="caselog-wrap">');
          context.push('<div id="caselog">');
          
          // TODO. handle col1/col2 correctly
          context.push('<div id="col1">');
          
          context.push('<div id="title">');
          context.push('<h1 class="tk-scrivano">Case Log</h1>');
          context.push('<h2 class="tk-scrivano">Training</h2>');
          context.push('</div>');
          
          for (i = 0, max_i = cases.length; i < max_i; i++) {
            context.push('<div class="case active">');
            context.push('<h3 class="tk-scrivano">' + cases[i].title + '</h3>');
            context.push('<ul>');
            
            challenges = cases[i].challenges;
            
            for (j = 0, max_j = challenges.length; j < max_j; j++) {           
              context.push('<li><a href="' + challenges[j].href + '">' + challenges[j].title + '</a></li>');
            }
            context.push('</ul>');
            context.push('</div>');
            
            if (i === 1) {
              context.push('</div>');
              context.push('<div id="col2">');
            }
          }

          context.push('</div>');     // #col1/#col2
          context.push('</div>');     // #caselog
          context.push('</div>');     // #caselog-wrap
        }
        
        context.push('<div id="nav">');
        context.push('<ul>');
        context.push('<li id="training" class="tk-scrivano active"><a href="#caselog/training">Training</a></li>');
        context.push('<li id="apprentice" class="tk-scrivano"><a href="#caselog/apprentice">Apprentice</a></li>');
        context.push('<li id="journeyman" class="tk-scrivano"><a href="#caselog/journeyman">Journeyman</a></li>');
        context.push('<li id="master" class="tk-scrivano"><a href="#caselog/master">Master</a></li>');
        context.push('<li id="meiosis" class="tk-scrivano"><a href="#caselog">Meiosis</a></li>');
        context.push('<li id="dna" class="tk-scrivano"><a href="#caselog">DNA to<br>Trait</a></li>');
        context.push('</ul>');
        context.push('</div>');
        
        return context;
      }
    })
  })
  
});
