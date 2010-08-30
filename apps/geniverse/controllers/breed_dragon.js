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

  breedButtonTitle: 'Breed',
  initParentsImmediately: YES,
  gwtReadyBinding: 'Geniverse.gwtController.isReady',
  
  mother: null,
  father: null,
  child: null,
  
  initParents: function () {
    var self = this;
    
    function setMother(dragon) {
      SC.RunLoop.begin();
      self.set('mother', dragon);
      SC.RunLoop.end();
    }
    
    function setFather(dragon) {
      SC.RunLoop.begin();
      self.set('father', dragon);
      SC.RunLoop.end();
    }
    
    if (this.get('gwtReady') == YES && this.get('initParentsImmediately') == YES) {
      SC.Logger.log('gwt ready. initializing parents');
      
      var alleles = Geniverse.activityController.getInitialAlleles('f');
      if (typeof(alleles) === 'string') {
        Geniverse.gwtController.generateDragonWithAlleles(alleles, 1, 'Mother', setMother);
      } 
      else {
        Geniverse.gwtController.generateDragon(1, 'Mother', setMother);
      }
      
      alleles = Geniverse.activityController.getInitialAlleles('m');
      if (typeof(alleles) === 'string') {
        Geniverse.gwtController.generateDragonWithAlleles(alleles, 0, 'Father', setFather);
      } 
      else {
        Geniverse.gwtController.generateDragon(0, 'Father', setFather);
      }
    }
  }.observes('gwtReady'),
 
  
  breed: function () {
    var self = this;
    var nEggs = 0;
    this.set('breedButtonTitle', 'Breeding...');
    Geniverse.eggsController.removeAllEggs(); // clear the breeding pen
    
    function didCreateChild(child) {
      SC.RunLoop.begin();
      child.set('isEgg', true);
      self.set('child', child);
      if (++nEggs >= 20) self.set('breedButtonTitle', 'Breed');
      SC.RunLoop.end();
    }
    
    Geniverse.gwtController.breedOrganisms(20, this.get('mother'), this.get('father'), didCreateChild);
  }
  
});
