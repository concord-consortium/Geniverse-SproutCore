/*globals module test ok equals same testAfterPropertyChange*/

var obj;

module("testAfterPropertyChange", { 
  setup: function () {
    obj = SC.Object.create({testProp: 0}); 
  }
});


test('testAfterPropertyChange should call the test function once after setting the test property to a new value.', function () {
  expect(1);    // expect 1 assertion, i.e., fail the test unless the testAfterPropertyChange really does call ok()

  setTimeout(function () {
    obj.set('testProp', 1);
  }, 100);

  testAfterPropertyChange(obj, 'testProp', function () {
    ok(true, 'testAfterPropertyChange called the test function');    
  });
});


test("testAfterPropertyChange should indicate the error when the callback throws an exception", function () {
  expect(1);
  var oldError = CoreTest.plan.error;
  var errorWasCalled = false;
  
  CoreTest.plan.error = function () {
    errorWasCalled = true;
  };
  
  testAfterPropertyChange(obj, 'testProp', function () {
    null.get("this won't work!");
  });
  
  setTimeout(function () {
    obj.set('testProp', 1);
    CoreTest.plan.error = oldError;
    ok(errorWasCalled, "The error in the testAfterPropertyChange resulted in a call CoreTest.plan.error()");
  }, 100);
});


test("testAfterPropertyChange should handle testAfterPropertyChange calls nested within the test callback", function () {
  expect(4);
  
  setTimeout(function () {
    ok(true, 'testAfterPropertyChange called the first test function');
    obj.set('testProp', 1);
  }, 100);
  
  testAfterPropertyChange(obj, 'testProp', function () {
    ok(true, 'the test function called the nested testAfterPropertyChange definition');

    setTimeout(function () {
      ok(true, 'the nested testAfterPropertyChange timeout fired');
      obj.set('testProp', 2);
    }, 100);

    testAfterPropertyChange(obj, 'testProp', function () {
      ok(true, 'the nested testAfterPropertyChange test function was called');
    });
  });  
});


test("testAfterPropertyChange should handle exceptions without failing to call nested testAfterPropertyChange", function () {
  expect(7);
  
  var oldError, errorWasCalled;
  
  var getNumObservers = function () {
    return obj._kvo_observers_testProp ? obj._kvo_observers_testProp.getMembers().length : 0;
  };
  var nObservers = getNumObservers();

  setTimeout(function () {
    ok(true, 'outer timeout was called');       // 1
    obj.set('testProp', 1);
    
    CoreTest.plan.error = oldError;
        
    ok(errorWasCalled,                          // 2
      "The fake exception in the callback of the outer testAfterPropertyChange should result in a call to " +
      "CoreTest.plan.error()");
  }, 100);
  
  testAfterPropertyChange(obj, 'testProp', function () {
    ok(true, 'outer testAfterPropertyChange callback was called');          // 3
    
    // the nested testAfterPropertyChange follows:
    setTimeout(function () {
      ok(true, 'inner timeout was called');     // 4
      obj.set('testProp', 2);
      
      equals(getNumObservers(), nObservers,     // 5
        "after the inner testAfterPropertyChange callback, 'obj' should have no net change in the number of " +
        "observers (even though the outer callback threw an exception)");
    }, 100);

    testAfterPropertyChange(obj, 'testProp', function () {
      ok(true,                                  // 6
        'inner testAfterPropertyChange callback was called despite exception in outer testAfterPropertyChange callback');
    });

    // once the nested callbacks are defined, throw an exception to see how testAfterPropertyChange handles it
    throw 'fake exception for testing purposes';
  });
  
  // remember that the following executes before the callbacks above:
  equals(getNumObservers(), nObservers + 1,     // 7
    "'obj' should have one more observer immediately after the outer testAfterPropertyChange() is called to set " +
    "the callback");

  oldError = CoreTest.plan.error;
  errorWasCalled = false;
  CoreTest.plan.error = function () {     // you really want to rewrite this LAST
    errorWasCalled = true;
  };
});


test('testAfterPropertyChange should not call the test function after the first time it is called', function () {
  expect(1);    // expect 1 assertion, i.e., fail the test unless the testAfterPropertyChange really does call ok()

  setTimeout(function () {
    obj.set('testProp', 1);
    obj.notifyPropertyChange('testProp');
  }, 100);

  testAfterPropertyChange(obj, 'testProp', function () {
    ok(true, 'testAfterPropertyChange called the test function');    
  });
});


test('testAfterPropertyChange should not call the test function until the specified value is reached', function () {
  expect(1);

  obj.set('testProp', 0);
  setTimeout(function () {
    obj.set('testProp', 1);
    setTimeout(function () {
      obj.set('testProp', 2);
    }, 100);
  }, 100);

  testAfterPropertyChange(obj, 'testProp', 2, function () {
    equals(obj.get('testProp'), 2, 'testAfterPropertyChange called the test function when the testProp == 2');    
  });
});


test('testAfterPropertyChange should call the test function immediately if the property already has the specified value', function () {
  obj.set('testProp', 3);
  
  testAfterPropertyChange(obj, 'testProp', 3, function () {
    ok(true, 'testAfterPropertyChange called the test function without waiting');    
  });
});
