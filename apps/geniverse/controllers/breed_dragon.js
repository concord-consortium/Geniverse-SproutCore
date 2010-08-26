// ==========================================================================
// Project:   Geniverse.breedDragonController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse generateDragonWithSex*/

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.breedDragonController = SC.Controller.create(
/** @scope Geniverse.breedDragonController.prototype */ {

  latestChild: null,
  
  mother: null,
  
  father: null,
  
  child: null,
  
  loadTimer: null,
  
  breedButtonTitle: 'Breed',
  
  initParentsImmediately: YES,
  
  gwtReadyBinding: 'Geniverse.gwtController.isReady',
  
  initParents: function() {
    var self = this;
    
    function setMother(dragon){
        SC.RunLoop.begin();
        self.set('mother', dragon);
        SC.RunLoop.end();
    }
    
    function setFather(dragon){
        SC.RunLoop.begin();
        self.set('father', dragon);
        SC.RunLoop.end();
    }
    if (this.get('gwtReady') == YES && this.get('initParentsImmediately') == YES) {
      SC.Logger.log('gwt ready. initializing parents');
      var allelesF = Geniverse.activityController.getInitialAlleles('f');
      if (allelesF !== undefined && allelesF !== null){
        Geniverse.gwtController.generateDragonWithAlleles(allelesF, 1, 'Mother', setMother);
      } else {
        Geniverse.gwtController.generateDragon(1, 'Mother', setMother);
      }
      
      var allelesM = Geniverse.activityController.getInitialAlleles('m');
      if (allelesM !== undefined && allelesM !== null){
        Geniverse.gwtController.generateDragonWithAlleles(allelesM, 0, 'Father', setFather);
      } else {
        Geniverse.gwtController.generateDragon(0, 'Father', setFather);
      }
      
    }
  }.observes('gwtReady'),
  
  breed: function() {
    var self = this;
    this.set('breedButtonTitle', 'Generating...');
    Geniverse.eggsController.removeAllEggs(); //clear the breeding pen
    var handleChild = function(child) {
      SC.RunLoop.begin();
      child.set('isEgg', true);
      self.set('child', child);
      if (self.get('breedButtonTitle') !== 'Breed') {
        self.set('breedButtonTitle', 'Breed');
      }
      SC.RunLoop.end();
    };
    for (var i = 0; i < 20; ++i) {
      Geniverse.gwtController.breedOrganism(this.get('mother'), this.get('father'), handleChild);
    }
  }
});
