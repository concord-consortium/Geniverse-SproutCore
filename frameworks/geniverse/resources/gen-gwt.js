sc_require('resources/lib/biologica.js');

var drake = BioLogica.Species.Drake;

GenGWT = {

    // 'callback' should be a function that takes a dragon (GOrganism)
    generateDragon: function(callback) {
      org = BioLogica.Organism.createOrganism(drake);
      callback(org);
    },

    generateDragonWithSex: function(sex, callback) {
      org = BioLogica.Organism.createOrganism(drake, "", sex);
      callback(org);
    },

    generateDragonWithAlleleString: function(alleles, callback) {
      if (!alleles) {
        if (!!console) { console.error("Need to define alleles!"); } // console.trace(); }
      } else {
        org = BioLogica.Organism.createOrganism(drake, alleles);
        callback(org);
      }
    },

    generateDragonWithAlleleStringAndSex: function(alleles, sex, callback) {
      if (!alleles) {
        if (!!console) { console.error("Need to define alleles!"); } // console.trace(); }
      } else {
        org = BioLogica.Organism.createOrganism(drake, alleles, sex);
        callback(org);
      }
    },

    breedDragon: function(mother, father, callback) {
      org = BioLogica.breed(mother, father, true);
      callback(org);
    },

    breedDragons: function(number, mother, father, crossover, callback) {
      var organisms = {array: []};
      while (number--) {
        organisms.array.push(BioLogica.breed(mother, father, crossover));
      }
      callback(organisms);
    },

    isAlive: function(dragon) {
        return this.hasCharacteristic(dragon, "Alive");
    },

    setAlleles: function(string) {
        var allelesArray = string.split("|");
        if (allelesArray.length == 1) {
            this.currentAlleleStringF = allelesArray[0];
            this.currentAlleleStringM = allelesArray[0];
        } else if (allelesArray.length == 2) {
            this.currentAlleleStringF = allelesArray[0];
            this.currentAlleleStringM = allelesArray[1];
        }
    },

    currentAlleleStringM: "",

    currentAlleleStringF: "",

    hasCharacteristic: function(dragon, characteristic) {
        function contains(arrayList, obj) {
            var array = arrayList.array;
            var i = array.length;
            while (i--) {
                if (array[i] == obj) {
                    return true;
                }
            }
            return false;
        }

        return contains(dragon.characteristics, characteristic);
    },

    createDragon: function(jsonDragon) {
        return createGOrganismFromJSONString(JSON.stringify(jsonDragon));
    },

    getCharacteristics: function(dragon, callback) {
        getDragonCharacteristics(dragon, callback, this.failure);
    },

    wrapCallback: function(callback) {
      function wrappedCallback(gOrg){
        if (GenGWT.orgIsValid(gOrg)){
          callback(gOrg);
        } else {
          console.log("WARN: Organism generated was not valid");
          console.log(gOrg);
          SC.AlertPane.error("", "The application created an invalid Drake. Please reload the page and try again.");
        }
      }
      return wrappedCallback;
    },

    orgIsValid: function(gOrg) {
      if (!!gOrg.size){
        var allAreValid = true;
        for (var i = 0; i < gOrg.size; i++) {
          if (!GenGWT.orgIsValid(gOrg.array[i])) {
            allAreValid = false;
          }
        }
        return allAreValid;
      }
      return (!!gOrg.alleles && (!!gOrg.sex || gOrg.sex == 0) && !!gOrg.imageURL);
    },

    failure: function(errorMsg) {
        SC.Logger.error("failure on GWT callback");
        SC.Logger.error(errorMsg);
        SC.Logger.trace();
    }
};
