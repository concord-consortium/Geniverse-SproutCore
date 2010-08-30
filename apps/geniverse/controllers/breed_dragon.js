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

  initParentsImmediately: YES,
  gwtReadyBinding: 'Geniverse.gwtController.isReady',
  isBreeding: NO,

  mother: null,
  father: null,
  child: null,
  
  breedButtonTitle: function () {
    return (this.get('isBreeding') ? 'Breed' : 'Breeding...');
  }.property('isBreeding').cacheable(),
  
  parentsAreSet: function () {
    return !!(this.get('mother') && this.get('father'));
  }.property('mother', 'father').cacheable(),
  
  initParents: function () {
    var self = this;
    
    // set mother, father to null in we are re-initing initParents() (we don't want stale parents to confuse us)
    this.set('mother', null);
    this.set('father', null);
    
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
    this.set('isBreeding', YES);
    Geniverse.eggsController.removeAllEggs(); // clear the breeding pen
    
    function didCreateChild(child) {
      SC.RunLoop.begin();
      child.set('isEgg', true);
      self.set('child', child);
      nEggs++;
      if (nEggs == 20) {
        self.set('isBreeding', NO);
      }
      else if (nEggs > 20) {
        throw "Oops; GWT called back one too many times!";
      }
      SC.RunLoop.end();
    }
    
    // FIXME: what if you hit 'Breed' twice? How do you cancel the old callbacks?
    console.log('calling breedOrganisms()');
    Geniverse.gwtController.breedOrganisms(20, this.get('mother'), this.get('father'), didCreateChild);
    console.log('breedOrganisms() called.');
  }
  
});
