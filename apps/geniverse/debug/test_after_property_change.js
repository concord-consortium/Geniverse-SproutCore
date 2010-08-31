/** some globals needed by testAfterPropertyChange() */

var nStops = 0;

function pushStop(t) {  
  if (nStops === 0) stop(t);
  nStops++;
}

function popStart() {
  if (nStops < 1) throw 'popped too many starts';
  nStops--;
  if (nStops === 0) start();
}

function testAfterPropertyChange(target, property, value, testFn) {
  if (target && target.addObserver) { 
    // give a healthy 10s timeout to discourage anyone from depending on a timeout to signal failure
    pushStop(10000);  
  }
  else {
    ok(false, 'testAfterPropertyChange: target is empty or does not have addObserver property.');
    throw 'testAfterPropertyChange: target is empty or does not have addObserver property';
  }
  
  if (testFn === undefined) {
    testFn = value;
    value = undefined;
  }
  if (!testFn) ok(false, 'testAfterPropertyChange: testFn is undefined.');
  
  function observer() {
    // if the property does not have the specified value yet, nothing to do
    if (value !== undefined && target.get(property) !== value) return;
    
    target.removeObserver(property, observer);
    try {
      testFn();
    }
    catch (e) {
      CoreTest.plan.error('Error during testAfterPropertyChange! See console log for details.', e);
      console.error(e);
      popStart();
      // it is better not to throw the exception here
      // exceptions thrown in observers cause hard to find problems, the observed object won't send out
      // future notifications because its notification code will be left in a bad state. 
      // (see the 'level' variable used in observable)
      return;
    }
    popStart();
  }
  target.addObserver(property, observer);
  
  // check if the property already has the specified value
  if (value !== undefined) observer();
}