// ==========================================================================
// Project:   Geniverse.gwtController Unit Test
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse module test ok equals same stop start */

module("Geniverse.gwtController");

// TODO: Replace with real unit test for Geniverse.gwtController
test("arrays can be copied", function() {
  var array = [];
  array[1] = "a";
  array[2] = "b";
  array['X'] = "c";
  
  equals(array.length, 3, "Original array should have 3 items");
  
  copy = array.copy();
  
  
  equals(copy.length, 3, "Copied array should have 3 items");
  equals(array[1], copy[1], "Item 1 of copied array should be there");
  equals(array['X'], copy['X'], "Item X of copied array should be there");
});

test("arrays can be iterated through", function() {
  var array = [];
  array[1] = "a";
  array[2] = "b";
  array['X'] = "c";
  
  var count = 0;
  array.forEach(function(item){
    count++;
  });
  equals(count, 3, "We should be able to iterate through all three items using forEach()");
  
  var count2 = 0;
  for(var i in array){
    count2++;
  }
  equals(count2, 3, "We should be able to iterate through all three items using for-in loop");
});

