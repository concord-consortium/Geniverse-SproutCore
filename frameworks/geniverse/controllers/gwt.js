// ==========================================================================
// Project:   Geniverse.gwtController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse CcChat GenGWT*/

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.gwtController = SC.Controller.create(
/** @scope Geniverse.gwtController.prototype */
{
  bredOrganisms: [],
  
  isReady: NO,
  
  loadTimer: null,
  
  setupTimer: function() {
	  if (this.get('loadTimer') !== null) {
	    this.get('loadTimer').invalidate();
    }
    
    this.set('loadTimer', SC.Timer.schedule({
      target: this,
      action: function() { 
        if (typeof(GenGWT) != "undefined" && GenGWT.isLoaded()) {
          this.set('isReady', YES);
          this.get('loadTimer').invalidate();
        }
      },
      interval: 200,
      repeats: YES
    }));
	},
	
  init: function() {
		sc_super();
		
		if (typeof(GenGWT) == "undefined" || ! GenGWT.isLoaded()) {
		  this.setupTimer();
		}
	},

  breedOrganism: function(mother, father, handleChildFunction) {
    var self = this;
    if (mother !== null && mother.get('gOrganism') !== null && father !== null && father.get('gOrganism') !== null) {
      var onSuccess = function(organism) {
        var child = Geniverse.store.createRecord(Geniverse.Dragon, {
					bred: YES, mother: mother.get("id"), father: father.get("id"), activity: Geniverse.activityController.getPath('content.id'), 
					user: Geniverse.userController.get('content').get('id'), isInMarketplace: NO, isEgg: YES
				});
				child.set('user', Geniverse.userController.get('content'));
        child.set('gOrganism', organism);
      
        handleChildFunction(child);
        Geniverse.store.commitRecords();
      };
      GenGWT.breedDragon(mother.get('gOrganism'), father.get('gOrganism'), onSuccess);
    }
  },
  
  breedOrganisms: function(number, mother, father, handleChildFunction) {
    var self = this;
    SC.Logger.info("Breeding " + number + " dragons");
    if (mother !== null && mother.get('gOrganism') !== null && father !== null && father.get('gOrganism') !== null) {
      var onSuccess = function(organisms) {
        window.DragonSet = organisms;
        var organism = null;
        var orgs = organisms.array;
        for (var i = 0; i < number; i++) {
          organism = orgs[i];
          var child = Geniverse.store.createRecord(Geniverse.Dragon, {
  					bred: YES, mother: mother.get("id"), father: father.get("id"), activity: Geniverse.activityController.getPath('content.id'), 
  					user: Geniverse.userController.get('content').get('id'), isInMarketplace: NO, isEgg: YES
  				});
          child.set('gOrganism', organism);
      
          handleChildFunction(child);
        }
        Geniverse.store.commitRecords();
      };
      GenGWT.breedDragons(number, mother.get('gOrganism'), father.get('gOrganism'), onSuccess);
    }
  },
  
  generateRandomDragon: function(callback) {
    // alert('generating dragon');
    var self = this;
    var handleGOrg = function(gOrg) {
      var org = Geniverse.store.createRecord(Geniverse.Dragon, {bred: NO});
      org.set('activity', Geniverse.activityController.get('content'));
      org.set('user', Geniverse.userController.get('content'));
      org.set('gOrganism', gOrg);
      callback(org);
      Geniverse.store.commitRecords();
    };
    GenGWT.generateDragon(handleGOrg);
  },

  generateDragon: function(sex, name, callback) {
    // alert('generating dragon');
    var self = this;
    var handleGOrg = function(gOrg) {
      var org = Geniverse.store.createRecord(Geniverse.Dragon, {bred: NO});
      org.set('activity', Geniverse.activityController.get('content'));
      org.set('user', Geniverse.userController.get('content'));
      org.set('name', name);
      org.set('gOrganism', gOrg);
      callback(org);
      Geniverse.store.commitRecords();
    };
    GenGWT.generateDragonWithSex(sex, handleGOrg);
  },
  
  generateDragonWithAlleles: function(alleles, sex, name, callback) {
    // SC.Logger.log("Generating dragon with "+alleles);
    // alert('generating dragon');
    var self = this;
    var handleGOrg = function(gOrg) {
      var org = Geniverse.store.createRecord(Geniverse.Dragon, {bred: NO});
      org.set('activity', Geniverse.activityController.get('content'));
      org.set('user', Geniverse.userController.get('content'));
      org.set('name', name);
      org.set('gOrganism', gOrg);
      callback(org);
      Geniverse.store.commitRecords();
    };
    GenGWT.generateDragonWithAlleleStringAndSex(alleles, sex, handleGOrg);
  },
  
  generateGOrganismWithAlleles: function(alleles, sex, callback) {
    // SC.Logger.log("Generating gOrg with "+alleles);
    GenGWT.generateDragonWithAlleleStringAndSex(alleles, sex, callback);
  }

});
