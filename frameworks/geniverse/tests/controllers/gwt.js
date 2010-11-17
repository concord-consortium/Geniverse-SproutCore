// ==========================================================================
// Project:   Geniverse.gwt Unit Test
// Copyright: ©2010 Concord Consortium
// ==========================================================================


/*globals Geniverse module test ok equals same stop start afterPropertyChange pushStop popStart GenGWT */

sc_require ('debug/test_helper');

module("Geniverse.gwt");

test("basic gwt test", function () {
  SC.Logger.log('starting basic test2');
  afterPropertyChange(Geniverse.gwtController, 'isReady', YES, function () {
    Geniverse.set('isLoaded', YES);
    pushStop(5000);
    GenGWT.generateDragon(function (org) {
      ok(true, "gwt dragon generated");
      popStart();
    });
  });
});

