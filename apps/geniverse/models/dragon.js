// ==========================================================================
// Project:   Geniverse.Dragon
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Geniverse.Dragon = SC.Record.extend(
/** @scope Geniverse.Dragon.prototype */ {
	gOrganism: SC.Record.attr(Object),
  name: SC.Record.attr(String),
	sex: SC.Record.attr(Number),
	alleles: SC.Record.attr(String),
	imageURL: SC.Record.attr(String),
	characteristics: SC.Record.attr(Array),
	metaInfo: SC.Record.attr(Object),
	mother: SC.Record.toOne(Geniverse.Dragon),
	father: SC.Record.toOne(Geniverse.Dragon),
	bred: SC.Record.attr(Boolean),
	
	setAttributes: function() {
		var gOrg = this.get('gOrganism');
		this.set('name', gOrg.name);
		this.set('sex', gOrg.sex);
		this.set('alleles', gOrg.alleles);
		this.set('imageURL', gOrg.imageURL);
		this.set('characteristics', gOrg.characteristics.array);
		this.set('metaInfo', gOrg.metaInfo);
		
		// alert('set organism attributes:' +
		//   ' name: ' + this.get('name') +
		//   ', sex: ' + this.get('sex') +
		//   ', alleles: ' + this.get('alleles') +
		//   ', imageURL: ' + this.get('imageURL') +
		//   ', characteristics: ' + this.get('characteristics') +
		//   ', metaInfo: ' + this.get('metaInfo')
		// );
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
	}.property('sexAsString','characteristicsAsString').cacheable()
}) ;
