/*globals Lab Geniverse */

Lab.debugDragons = function() {
  var names = ['firstDragon', 'secondDragon', 'thirdDragon'],
      str = [],
      dragon, i, len;
      
  for (i = 0, len = names.length; i < len; i++) {
    str.push(names[i] + ":\n");
    
    dragon = Geniverse.dragonGenomeController.get(names[i]);
    if (typeof dragon === 'undefined') dragon = '(undefined)';
    if (dragon === null) dragon = '(null)';
    
    str.push(dragon + "\n\n");
  }
  
  return str.join('');
};

Lab.dragonObserver = function() {
  console.log("****************** Dragon changed ******************");
  console.log(Lab.debugDragons());
  if (Lab.debugIt) debugger;
};

Lab.observeDragon = function(which) {
  which = which || 'secondDragon';
  Geniverse.dragonGenomeController.addObserver(which, this, Lab.dragonObserver);
};

// Lab.debugIt = false;
// Lab.observeDragon();
