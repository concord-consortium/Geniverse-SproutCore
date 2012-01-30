// ==========================================================================
// Project:   Geniverse.matchController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse module test ok equals same stop start HashMap Drake NumberOfMoves NumberOfBreedMoves*/

module("Geniverse.matchController");

HashMap = function(hash) {
  this.hash = hash;
};

HashMap.prototype.get = function(key) {
  return this.hash[key];
};

Drake = function(characteristics, alleles, changeableAlleles) {
  this.characteristicMap = new HashMap(characteristics);
  this.alleles = alleles;
  this.changeableAlleles = changeableAlleles;
};

Drake.prototype.get = function(key) {
  return this[key];
};

NumberOfMoves = function(initDrake, targetDrake) {
  return Geniverse.matchController.numberOfAlleleChangesToReachPhenotype(
    initDrake.characteristicMap,
    targetDrake.characteristicMap,
    initDrake.alleles,
    Geniverse.Dragon.traitRules);
};

NumberOfBreedMoves = function(initMother, initFather, targetDrake) {
  return Geniverse.matchController.numberOfBreedingMovesToReachDrake(
    initMother,
    initFather,
    initMother.changeableAlleles,
    initFather.changeableAlleles,
    targetDrake);
};


test("NumberOfMoves should count simple dominant/recessive traits", function() {
  var initDrake = new Drake(
    {
      forelimbs: "Forelimbs"
    },
    "a:Fl,b:Fl");
  var targetDrake = new Drake(
    {
      forelimbs: "No forelimbs"
    }); 
    
  equals(NumberOfMoves(initDrake, targetDrake), 2, "Should take 2 moves to go from homo dominant to recessive");
  
  initDrake.alleles = "a:Fl,b:fl";
  equals(NumberOfMoves(initDrake, targetDrake), 1, "Should take 1 move to go from hetero to recessive");
  
  initDrake = new Drake(
    {
      forelimbs: "No forelimbs"
    },
    "a:fl,b:fl");
  targetDrake = new Drake(
    {
      forelimbs: "Forelimbs"
    });
  equals(NumberOfMoves(initDrake, targetDrake), 1, "Should take 1 move to go from recessive to dominant");
});

test("NumberOfMoves should ignore matching traits", function() {
  var initDrake = new Drake(
    {
      forelimbs: "Forelimbs",
      hindlimbs: "Hindlimbs"
    },
    "a:Fl,b:Fl,a:Hl,b:hl");
  var targetDrake = new Drake(
    {
      forelimbs: "Forelimbs",
      hindlimbs: "Hindlimbs"
    }); 
  equals(NumberOfMoves(initDrake, targetDrake), 0, "Should take 0 moves for identical drakes");
  
  targetDrake = new Drake(
    {
      forelimbs: "Forelimbs",
      hindlimbs: "No hindlimbs"
    });
  equals(NumberOfMoves(initDrake, targetDrake), 1, "Should take 1 move to go from hetero to recessive with other trait identical");
});

test("NumberOfMoves should understand three-allele genes", function() {
  var initDrake = new Drake(
    {
      tail: "Long tail"
    },
    "a:T,b:T");
  var targetDrake = new Drake(
    {
      tail: "Kinked tail"
    }); 
  equals(NumberOfMoves(initDrake, targetDrake), 2, "Should take 2 moves");
  
  initDrake.alleles = "a:T,b:Tk";
  equals(NumberOfMoves(initDrake, targetDrake), 1, "Should take 1 move");
  
  initDrake.alleles = "a:T,b:t";
  equals(NumberOfMoves(initDrake, targetDrake), 1, "Should take 1 move");
});

test("NumberOfMoves should understand multi-gene traits", function() {
  var initDrake = new Drake(
    {
      color: "Steel"
    },
    "a:M,b:M,a:B,b:B,a:D,b:D");
  var targetDrake = new Drake(
    {
      color: "Copper"
    }); 
  equals(NumberOfMoves(initDrake, targetDrake), 2, "Should take 2 moves");
  
  initDrake = new Drake(
    {
      color: "Steel"
    },
    "a:M,b:M,a:B,b:b,a:D,b:D");
  targetDrake = new Drake(
    {
      color: "Copper"
    }); 
  equals(NumberOfMoves(initDrake, targetDrake), 1, "Should take 1 moves");
  
  initDrake = new Drake(
    {
      color: "Steel"
    },
    "a:M,b:M,a:B,b:B,a:D,b:D");
  targetDrake = new Drake(
    {
      color: "Sand"
    }); 
  equals(NumberOfMoves(initDrake, targetDrake), 6, "Should take 6 moves");
  
  initDrake = new Drake(
    {
      color: "Steel"
    },
    "a:M,b:m,a:B,b:b,a:D,b:d");
  targetDrake = new Drake(
    {
      color: "Sand"
    }); 
  equals(NumberOfMoves(initDrake, targetDrake), 3, "Should take 3 moves");
});

test("NumberOfMoves should combine and add up multiple trait differences", function() {
  var initDrake = new Drake(
    {
      tail: "Long tail",
      color: "Steel"
    },
    "a:T,b:T,a:M,b:m,a:B,b:b,a:D,b:d");
  var targetDrake = new Drake(
    {
      tail: "Kinked tail",
      color: "Sand"
    }); 
  equals(NumberOfMoves(initDrake, targetDrake), 5, "Should take 5 moves");
  
});


test("NumberOfBreedMoves should work in the simplest case", function() {
  var initMother = new Drake(
    {
      tail: "Long tail"
    },
    "a:T,b:t",
    ["t"]);
  var initFather = new Drake(
    {
      tail: "Short tail"
    },
    "a:T,b:t",
    []);
  var targetDrake = new Drake(
    {
      tail: "Short tail"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), 1, "Should take 1 moves to just breed");
  
  initMother = new Drake(
    {
      tail: "Long tail"
    },
    "a:T,b:T",
    ["t"]);
  initFather = new Drake(
    {
      tail: "Short tail"
    },
    "a:t,b:t",
    []);
  targetDrake = new Drake(
    {
      tail: "Short tail"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), 2, "Should take 2 moves");
  
  initMother = new Drake(
    {
      tail: "Long tail"
    },
    "a:T,b:T",
    ["t"]);
  initFather = new Drake(
    {
      tail: "Long tail"
    },
    "a:T,b:t",
    []);
  targetDrake = new Drake(
    {
      tail: "Short tail"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), 2, "Should take 2 moves");
  
  initMother = new Drake(
    {
      tail: "Long tail"
    },
    "a:t,b:T",
    ["t"]);
  initFather = new Drake(
    {
      tail: "Long tail"
    },
    "a:T,b:T",
    ["t"]);
  targetDrake = new Drake(
    {
      tail: "Short tail"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), 2, "Should take 2 moves");
  
  initMother = new Drake(
    {
      tail: "Long tail"
    },
    "a:T,b:T",
    ["t"]);
  initFather = new Drake(
    {
      tail: "Long tail"
    },
    "a:T,b:T",
    ["t"]);
  targetDrake = new Drake(
    {
      tail: "Short tail"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), 3, "Should take 3 moves");
  
});

test("NumberOfBreedMoves should be infinity in an impossible case", function() {
  var initMother = new Drake(
    {
      tail: "Long tail"
    },
    "a:T,b:T",
    ["t"]);
  var initFather = new Drake(
    {
      tail: "Short tail"
    },
    "a:T,b:T",
    []);
  var targetDrake = new Drake(
    {
      tail: "Short tail"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), Infinity, "Can't change drake2, so should be Infinity");
});

test("NumberOfBreedMoves work in two trait cases", function() {
  var initMother = new Drake(
    {
      tail: "Long tail",
      horns: "Horns"
    },
    "a:T,b:T,a:h,b:h",
    ["t","h"]);
  var initFather = new Drake(
    {
      tail: "Short tail",
      horns: "Horns"
    },
    "a:t,b:t,a:h,b:h",
    []);
  var targetDrake = new Drake(
    {
      tail: "Short tail",
      horns: "Hornless"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), 3, "Should take 3 moves");
  
  initMother = new Drake(
    {
      tail: "Long tail",
      horns: "Hornless"
    },
    "a:t,b:T,a:h,b:H",
    ["t","h"]);
  initFather = new Drake(
    {
      tail: "Short tail",
      horns: "Horns"
    },
    "a:t,b:t,a:h,b:h",
    []);
  targetDrake = new Drake(
    {
      tail: "Short tail",
      horns: "Horns"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), 1, "Should take 1 moves");
  
  initMother = new Drake(
    {
      tail: "Long tail",
      horns: "Hornless"
    },
    "a:T,b:T,a:H,b:H",
    ["t","h"]);
  initFather = new Drake(
    {
      tail: "Short tail",
      horns: "Horns"
    },
    "a:T,b:T,a:H,b:H",
    ["t", "h"]);
  targetDrake = new Drake(
    {
      tail: "Short tail",
      horns: "Horns"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), 5, "Should take 5 moves");
});

test("NumberOfBreedMoves work in multi-gene cases", function() {
  var initMother = new Drake(
    {
      color: "Steel"
    },
    "a:M,b:M,a:B,b:B,a:D,b:D",
    ["m","b","d"]);
  var initFather = new Drake(
    {
      color: "Steel"
    },
    "a:M,b:M,a:B,b:B,a:D,b:D",
    ["m","b","d"]);
  var targetDrake = new Drake(
    {
      color: "Copper"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), 3, "Should take 3 moves");
  
  initMother = new Drake(
    {
      color: "Steel"
    },
    "a:M,b:M,a:B,b:B,a:D,b:D",
    ["m","b","d"]);
  initFather = new Drake(
    {
      color: "Steel"
    },
    "a:M,b:M,a:B,b:B,a:D,b:D",
    ["m","b","d"]);
  targetDrake = new Drake(
    {
      color: "Sand"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), 7, "Should take 7 moves");
  
  initMother = new Drake(
    {
      color: "Sand"
    },
    "a:m,b:m,a:b,b:b,a:d,b:d",
    ["m","b","d"]);
  initFather = new Drake(
    {
      color: "Sand"
    },
    "a:m,b:m,a:b,b:b,a:d,b:d",
    ["m","b","d"]);
  targetDrake = new Drake(
    {
      color: "Steel"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), 4, "Should take 4 moves");
  
  initMother = new Drake(
    {
      color: "Sand"
    },
    "a:m,b:m,a:B,b:B,a:d,b:d",
    ["m","b","d"]);
  initFather = new Drake(
    {
      color: "Sand"
    },
    "a:M,b:M,a:b,b:b,a:d,b:d",
    ["m","b","d"]);
  targetDrake = new Drake(
    {
      color: "Sand"
    }); 
  equals(NumberOfBreedMoves(initMother, initFather, targetDrake), 3, "Should take 3 moves");
});