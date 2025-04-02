//strict mode applies to entire scripts or to individual functions. It doesn't apply to block statements enclosed in {} braces.
//Strict mode makes several changes to normal JavaScript semantics:
//1. Eliminates some JavaScript silent errors by changing them to throw errors.
//2. Fixes mistakes that make it difficult for JavaScript engines to perform optimizations: strict mode code can sometimes be made to run faster than identical code that's not strict mode.
//3. Prohibits some syntax likely to be defined in future versions of ECMAScript.
"use strict";
const v = "Hi! I'm a strict mode script.";


//Strict mode for functions
function myStrictFunction() {
    // Function-level strict mode syntax
    "use strict";
    function nested() {
        return "And so am I!";
    }
    return `Hi! I'm a strict mode function! ${nested()}`;
}
function myNotStrictFunction() {
    return "I'm not strict.";
}

//Strict mode for modules
// The entire contents of JavaScript modules are automatically in strict mode, with no statement needed to initiate it

//Strict mode for classes
class C1 {
    // All code here is evaluated in strict mode
    test() {
      delete Object.prototype;
    }
  }
  new C1().test(); // TypeError, because test() is in strict mode

  const C2 = class {
    // All code here is evaluated in strict mode
  };
  
// Code here may not be in strict mode
delete Object.prototype; // Will not throw error