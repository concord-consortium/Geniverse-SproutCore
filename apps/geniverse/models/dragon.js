// ==========================================================================
// Project:   Geniverse.Dragon
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse GenGWT */

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
  stableOrder: SC.Record.attr(Number),
  isEgg: SC.Record.attr(Boolean),
  isInMarketplace: SC.Record.attr(Boolean),
  activity: SC.Record.toOne('Geniverse.Activity'),
  
  // attributes that don't want to be persisted
  gOrganism: null,
  characteristics: null,
  metaInfo: null,
  
  gOrganismDefined: function() {
    var gOrg = this.get('gOrganism');
    var defined = (gOrg !== null && (typeof gOrg != 'undefined') && (typeof gOrg.alleles != 'undefined')) ? YES : NO;
    // SC.Logger.info('gOrganism is defined: ' + defined);
    // SC.Logger.dir(this);
    return defined;
  }.property('gOrganism').cacheable(),
 
  color: function() {
    SC.Logger.info('access to dragon color -- function run: %s',this.get('alleles'));
    return (this.characteristicValue('color').toLowerCase());
  }.property('alleles').cacheable(),

  init: function() {
    var self = this;
    this.invokeLast(function() {
      // SC.Logger.group('Dragon init');
      // SC.Logger.info('gOrganism: ', typeof self.get('gOrganism'));
      if (self.get('gOrganismDefined') == NO) {
        // SC.Logger.info('gOrganism not defined. asking GWT for gOrganism');
        Geniverse.gwtController.generateGOrganismWithAlleles(self.get('alleles'), self.get('sex'), function(gOrg) {
          // SC.Logger.info('created gOrg for loaded Dragon');
          self.set('gOrganism', gOrg);
        });
      } else {
        // SC.Logger.info('gOrganism already defined. must be a session-generated dragon.');
        // SC.Logger.dir(self);
      }
      // SC.Logger.groupEnd();
    });
  },
  
  setAttributes: function() {
    var gOrg = this.get('gOrganism');
    // SC.Logger.info('gOrganism changed: ', typeof gOrg);
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
    return (this.get('characteristics')[this.characteristicIndex(name)]);
  },

  characteristicName: function(index) {
    return Geniverse.Dragon.CHARACTERISTICS[index]; 
  },

  characteristicIndex: function(name) {
    var i     = 0;
    for (i = 0; i  < Geniverse.Dragon.CHARACTERISTICS.length; i++) {
      if (name.toLowerCase() == (this.characteristicName(i).toLowerCase())) {
        return i;
      }
    }
    return -1; // boo
  }

});

Geniverse.Dragon.modelName = "dragon";
Geniverse.Dragon.modelsName = "dragons";
Geniverse.Dragon.CHARACTERISTICS = "horns wings legs tail fire color alive scales plates".w();
Geniverse.railsBackedTypes.push(Geniverse.Dragon.modelName);

