// ==========================================================================
// Project:   Geniverse.breedDragonController
// Copyright: ©2010 The Concord Consortium
// ==========================================================================
/*globals Geniverse generateDragonWithSex*/

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Geniverse.statsController = SC.Controller.create(
/** @scope Geniverse.breedDragonController.prototype */ {
  red: 0,
  green: 0,
  yellow: 0,
  purple: 0,
  brown: 0,

  redLabel: function()   { return this.label('red');  }.property('red').cacheable(),
  greenLabel: function() { return this.label('green'); }.property('green').cacheable(),
  yellowLabel: function() { return this.label('yellow'); }.property('yellow').cacheable(),
  purpleLabel: function() { return this.label('purple'); }.property('purple').cacheable(),
  brownLabel: function() { return this.label('brown'); }.property('brown').cacheable(),

  total: 0,
  
  label: function(name) {
    return (this.get(name) + " -" + this.percent(this.get(name)) + "%");
  },

  // http://www.pivotaltracker.com/story/show/5298197
  // rest parents and breeding pool.
  reset: function() {
    this.set('red',0);
    this.set('green',0);
    this.set('yellow',0);
    this.set('purple',0);
    this.set('brown',0);
    this.set('total',0);
  }.observes('Geniverse.breedDragonController.resetCount'),
  
  newChildObserver: function()  {
    this.updateStats(Geniverse.breedDragonController.get('newChild'));
  }.observes('Geniverse.breedDragonController.newChild'),

  updateStats: function(new_dragon) {
    if (new_dragon) {
      var color = new_dragon.get('color').toLowerCase();
      var value = this.get(color) + 1;
      var total = this.total + 1;
      this.set('total',total);
      this.set(color,value);
    }
  },

  percent: function(number) {
    var total = this.get('total');
    if (total === 0) {
      return 0;
    }
    SC.Logger.log('percent called');
    return (((number / total) * 100) + ' ').substring(0,3);
  }
  
});
