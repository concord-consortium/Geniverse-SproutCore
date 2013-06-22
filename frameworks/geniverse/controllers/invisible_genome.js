// ==========================================================================
// Project:   Geniverse.blogPostController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
sc_require('views/blog_post');

Geniverse.invisibleGenomeController = SC.ObjectController.create(
/** @scope Geniverse.chromosomeToolController.prototype */ {

  genomeSolutionView: null,

  allFields: null,

  timesAttempted: 0,

  showGenomePane: function() {
    if (!this.genomeSolutionView) {
      if (this.get('sex') === 0) {
        layout =  { width: 360, height: 490, centerX: 200, centerY: -220 }
      } else {
        layout = { width: 360, height: 490, centerX: -200, centerY: -220 }
      }
      this.genomeSolutionView = Geniverse.GenomeSolutionView.create({
        layout: layout
      });
    }
    this.genomeSolutionView.append();
  },

  hideGenomePane: function() {
    this.genomeSolutionView.remove();
  },

  activityObserver: function() {
    this.genomeSolutionView = null;
    this.timesAttempted = 0;
  }.observes('Geniverse.activityController.content'),

  allAlleles: null,

  _processAlleleString: function() {
      SC.RunLoop.begin();
      var dragon = this.get('content');

      if (dragon === null || typeof(dragon) == "undefined") {
        this.set('allAlleles', []);
        return;
      }

      var alleleString = this.get('alleles');
      var allAlleles = Geniverse.chromosomeController.processAlleleString(alleleString);
      this.set('allAlleles', allAlleles);

      SC.RunLoop.end();
  }.observes('content'),

  hiddenGenes: function() {
    return Geniverse.activityController.getHiddenOrStaticGenes('hiddenGenes', this.get('sex'));
  }.property(),

  staticGenes: function() {
    return Geniverse.activityController.getHiddenOrStaticGenes('staticGenes', this.get('sex'));
  }.property(),

  addField: function(field) {
    if (!this.allFields) {
      this.allFields = {};
    }
    this.allFields[field] = false;
  },

  setFieldCorrect: function(field, correct) {
    this.allFields[field] = correct;
  },

  isAllCorrect: function() {
    var fields = this.allFields,
        allCorrect = true;

    for (key in fields) {
      if (!fields.hasOwnProperty(key)) continue;
      if (!fields[key]) {
        allCorrect = false;
      }
    }
    return allCorrect;
  }

}) ;
