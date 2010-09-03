// ==========================================================================
// Project:   Geniverse.dragonGenomeController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse module test ok equals same stop start */

module("Geniverse.dragonGenomeController");

// TODO: Replace with real unit test for Geniverse.dragonGenomeController
test("test description", function() {
  var dragon;
  SC.run(function() {
    dragon = Geniverse.store.createRecord(Geniverse.Dragon, {
      alleles: "a:h,b:H,a:L,b:l,a:t,b:T,a:a"
    });
  });
  
  Geniverse.dragonGenomeController.set('content', dragon);
  
  var alleles = Geniverse.dragonGenomeController.get('alleles');
  equals(alleles[1]['A'], 'h', "Allele on chromosome 1A should be 'h'");
  equals(alleles[1]['B'], 'H', "Allele on chromosome 1B should be 'H'");
  equals(alleles[2]['A'], 'L,t', "Allele on chromosome 2A should be 'L,t'");
  equals(alleles[2]['B'], 'l,T', "Allele on chromosome 2B should be 'l,T'");
  equals(alleles['X']['A'], 'a', "Allele on chromosome XA should be 'a'");
  
});

