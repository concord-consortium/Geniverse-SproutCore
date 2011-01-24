// ==========================================================================
// Project:   Geniverse.Dragon
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals SC Geniverse GenGWT YES NO*/

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Geniverse.Dragon = SC.Record.extend(
/** @scope Geniverse.Dragon.prototype */ {
  
  // All the attributes that we want to be sure to persist
  name: SC.Record.attr(String),
  
  sex: SC.Record.attr(Number),
  
  alleles: SC.Record.attr(String),
  
  imageURL: SC.Record.attr(String),
  
  mother: SC.Record.toOne("Geniverse.Dragon"),
  
  father: SC.Record.toOne("Geniverse.Dragon"),
  
  bred: SC.Record.attr(Boolean),
  
  user: SC.Record.toOne("Geniverse.User"),
  
  breeder: SC.Record.toOne("Geniverse.User"),
  
  breedTime: SC.Record.attr(Number),
  
  stableOrder: SC.Record.attr(Number),
  
  isEgg: SC.Record.attr(Boolean),
  
  isInMarketplace: SC.Record.attr(Boolean),
  
  isMatchDragon: SC.Record.attr(Boolean,  { defaultValue: NO }),
  
  activity: SC.Record.toOne('Geniverse.Activity'),        // which activity the dragon belogs to. Can only be in one
  
  articles: SC.Record.toMany('Geniverse.Articles', {          // any papers the dragon has been cited in
    inverse: 'dragons', isMaster: NO 
  }),
  
  // attributes that don't want to be persisted
  gOrganism: null,
  characteristics: null,
  metaInfo: null,
  characteristicMap: null,
  
  gOrganismDefined: function() {
    var gOrg = this.get('gOrganism');
    var defined = (gOrg !== null && (typeof gOrg != 'undefined') && (typeof gOrg.alleles != 'undefined')) ? YES : NO;
    return defined;
  }.property('gOrganism').cacheable(),
 
  color: function() {
    return this.characteristicValue('color').toLowerCase();
  }.property('alleles').cacheable(),

  init: function() {
    var self = this;
    this.invokeLast(function() {
      if (self.get('gOrganismDefined') == NO) {
        Geniverse.gwtController.generateGOrganismWithAlleles(self.get('alleles'), self.get('sex'), function(gOrg) {
          self.set('gOrganism', gOrg);
        });
      }// else {
        // SC.Logger.info('gOrganism already defined. must be a session-generated dragon.');
        // SC.Logger.dir(self);
      // }
    });
  },
  
  setAttributes: function() {
    if (this.get('status') & SC.Record.DESTROYED) {
      return;
    }
    var gOrg = this.get('gOrganism');
    if (this.get('gOrganismDefined')) {
      // this.set('name', gOrg.name);  // GWT doesn't create meaningful names, so no sense in overriding an existing name
      this.set('sex', gOrg.sex);
      this.set('alleles', gOrg.alleles);
      this.set('imageURL', gOrg.imageURL);
      if (gOrg.characteristics !== null){
        this.set('characteristics', gOrg.characteristics.array);
      } else {
        var self = this;
        GenGWT.getCharacteristics(gOrg, function(characteristics){
          gOrg.characteristics = characteristics;
          self.set('characteristics', gOrg.characteristics.array);
        });
      }
      this.set('characteristicMap', gOrg.characteristicMap);
      this.set('metaInfo', gOrg.metaInfo);
    }
  }.observes('gOrganism'),
  
  // some computed properties
  sexAsString: function() {
    var sex = this.get('sex');
    if (sex === 0) {
      return "Male";
    } else if (sex === 1) {
      return "Female";
    } else if (sex === -1) {
      return "Random";
    } else {
      return "Unknown";
    }
  }.property('sex').cacheable(),
  
  characteristicsAsString: function() {
    var out = '';
    var chars = this.get('characteristics');
    for (var i = 0; i < chars.length; i++) {
      if (i === 0) {
        out += chars[i];
      } else {
        out += ", " + chars[i];
      }
    }
    return out;
  }.property('characteristics').cacheable(),
  
  info: function() {
    return this.get('sexAsString') + ' -- ' + this.get('characteristicsAsString');
  }.property('sexAsString','characteristicsAsString').cacheable(),

  characteristicValue: function(name) {
    if (name !== null && typeof name != 'undefined') {
      return this.get('characteristicMap').get(name.toLowerCase());
    }
    return "";
  }

});

Geniverse.Dragon.modelName = "dragon";
Geniverse.Dragon.modelsName = "dragons";
Geniverse.railsBackedTypes.push(Geniverse.Dragon.modelName);

