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

  redLabel: '--',
  greenLabel: '--',
  yellowLabel: '--',
  purpleLabel: '--',
  brownLabel: '--',
  labelNames: 'red green yellow purple brown'.w(),
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
    this.updateLabels();
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
      this.updateLabels();
    }
  },

  updateLabels: function() {    
    var labelNames = this.get('labelNames');
    var i = 0;
    for (i = 0; i < labelNames.length; i++) {
      colorName = labelNames[i];
      var propertyName = colorName + 'Label';
      SC.Logger.info("setting %s", propertyName);
      this.set(propertyName, this.label(colorName));
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
