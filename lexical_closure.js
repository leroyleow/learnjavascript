  /*
  The term 'lexical' simply means 'source code' or in other words, 'relating to the text of a program'.

In lexical scoping system, in order to resolve a name inside a function, it's first searched in the local environment of the function
and then in its lexical environment.
The lexical environment for a function f simply refers to the environment enclosing that function's definition in the source code.


"Lexically-scoped" refers to a method of variable scoping in programming languages where the scope of a variable is determined by its
position in the source code (i.e., its lexical context). This means that a variable's accessibility is based on its location within
the code blocks, functions, or modules during the time of writing, rather than at runtime.

In lexically-scoped languages (like JavaScript, Python, and Ruby), a variable defined inside a function is not accessible from outside
that function, while variables defined in an outer scope can be accessed by inner scopes. This contrasts with dynamically-scoped languages,
where the scope is determined at runtime based on the call stack.
  */
var a = 'static';

function f1() {
   console.log(a); //lexically-scoped
}

function f2() {
   var a = 'dynamic';
   f1();
}

f2();


//another lexical example
function init() {
  var name = "Mozilla"; // name is a local variable created by init
  function displayName() {
    // displayName() is the inner function, that forms a closure
    console.log(name); // use variable declared in the parent function
  }
  displayName();
}
init();

//another lexical example
function outerFunction() {
  let outerVariable = "I'm outside!";

  function innerFunction() {
      console.log(outerVariable); // Accessible: output: "I'm outside!"
  }

  innerFunction();
}

outerFunction();
console.log(outerVariable); // Uncaught ReferenceError: outerVariable is not defined


//Closure ->  is the combination of a function and the lexical environment within which that function was declared.
//        -> enable functions to remember their surroundings
// To find the lexical scope, use chrome dev tools and console.dir(greeter);
function outerFunction(){
  var message = 'howdy';
  function greet() {
      console.log(message);
  }
  return greet;
}

var greeter = outerFunction();
console.log(greeter());


/* Use Case for Closure
Data privacy/encapsulation: Creating private variables not accessible from outside
Function factories: Creating functions with preset parameters
Module patterns: Organizing code with private and public parts
Memoization/caching: Storing calculation results for reuse
Currying and partial application: Breaking down complex functions
Managing asynchronous operations: Preserving context in callbacks
Stateful functions: Functions that remember previous calls
*/

//Complex Closure Example
function createAdvancedCache() {
  // Private variables in closure scope
  const cache = new Map();
  const accessLog = new Map();
  const expirationTimes = new Map();
  let hitCount = 0;
  let missCount = 0;
  let evictionCount = 0;
  let maxSize = 100;
  let defaultTTL = 3600000; // 1 hour in milliseconds
  let evictionPolicy = 'LRU'; // Default policy: Least Recently Used

  // Private methods
  const recordAccess = (key) => {
    accessLog.set(key, Date.now());
  };

  const isExpired = (key) => {
    if (!expirationTimes.has(key)) return false;
    return Date.now() > expirationTimes.get(key);
  };

  const evictItems = () => {
    if (cache.size <= maxSize) return;

    // Find items to evict based on policy
    let itemsToEvict = [];

    if (evictionPolicy === 'LRU') {
      // Sort by access time (oldest first)
      itemsToEvict = [...accessLog.entries()]
        .sort((a, b) => a[1] - b[1])
        .slice(0, cache.size - maxSize + 1)
        .map(entry => entry[0]);
    } else if (evictionPolicy === 'FIFO') {
      // Get oldest entries based on insertion order in Map
      itemsToEvict = [...cache.keys()].slice(0, cache.size - maxSize + 1);
    } else if (evictionPolicy === 'TTL') {
      // Remove expired items first
      for (const [key, expTime] of expirationTimes.entries()) {
        if (Date.now() > expTime) {
          itemsToEvict.push(key);
        }
      }

      // If still need to evict more, use LRU
      if (cache.size - itemsToEvict.length > maxSize) {
        const additionalEvictions = [...accessLog.entries()]
          .sort((a, b) => a[1] - b[1])
          .slice(0, cache.size - maxSize - itemsToEvict.length + 1)
          .map(entry => entry[0]);

        itemsToEvict = [...itemsToEvict, ...additionalEvictions];
      }
    }

    // Perform eviction
    for (const key of itemsToEvict) {
      cache.delete(key);
      accessLog.delete(key);
      expirationTimes.delete(key);
      evictionCount++;
    }
  };

  // The actual computation function that uses all the cached data
  const computeExpensiveResult = (fn, args, options = {}) => {
    // Calculate unique key for the function and its arguments
    const key = JSON.stringify({ fn: fn.toString(), args });

    // Handle expired items
    if (cache.has(key) && isExpired(key)) {
      cache.delete(key);
      accessLog.delete(key);
      expirationTimes.delete(key);
    }

    // Check if result is cached
    if (cache.has(key)) {
      hitCount++;
      recordAccess(key);
      return cache.get(key);
    }

    // Calculate new result
    missCount++;
    const result = fn(...args);

    // Cache the result
    cache.set(key, result);
    recordAccess(key);

    // Set expiration if applicable
    const ttl = options.ttl !== undefined ? options.ttl : defaultTTL;
    if (ttl !== null) {
      expirationTimes.set(key, Date.now() + ttl);
    }

    // Check if we need to evict items
    evictItems();

    return result;
  };

  // Public API - leveraging closures to access private state
  return {
    // Execute with caching
    execute: function(fn, ...args) {
      return computeExpensiveResult(fn, args);
    },

    // Execute with options
    executeWithOptions: function(options, fn, ...args) {
      return computeExpensiveResult(fn, args, options);
    },

    // Configure cache
    configure: function(options = {}) {
      if (options.maxSize !== undefined) maxSize = options.maxSize;
      if (options.defaultTTL !== undefined) defaultTTL = options.defaultTTL;
      if (options.evictionPolicy !== undefined) {
        const validPolicies = ['LRU', 'FIFO', 'TTL'];
        if (validPolicies.includes(options.evictionPolicy)) {
          evictionPolicy = options.evictionPolicy;
        } else {
          throw new Error(`Invalid eviction policy. Must be one of: ${validPolicies.join(', ')}`);
        }
      }
      return this;
    },

    // Clear cache
    clear: function() {
      cache.clear();
      accessLog.clear();
      expirationTimes.clear();
      return this;
    },

    // Get stats
    getStats: function() {
      return {
        size: cache.size,
        hits: hitCount,
        misses: missCount,
        hitRatio: hitCount / (hitCount + missCount || 1),
        evictions: evictionCount,
        memoryEstimate: JSON.stringify(Array.from(cache.entries())).length * 2,
        policy: evictionPolicy
      };
    },

    // Peek at a value without affecting stats
    peek: function(fn, ...args) {
      const key = JSON.stringify({ fn: fn.toString(), args });
      return cache.has(key) ? cache.get(key) : undefined;
    }
  };
}

// Usage example
const cache = createAdvancedCache().configure({
  maxSize: 50,
  defaultTTL: 30000, // 30 seconds
  evictionPolicy: 'LRU'
});

// Expensive calculation to be cached
function calculateFactorial(n) {
  console.log(`Calculating factorial for ${n}...`);
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// First call - will calculate
const result1 = cache.execute(calculateFactorial, 20);
console.log(`Result: ${result1}`);

// Second call - will use cached value
const result2 = cache.execute(calculateFactorial, 20);
console.log(`Result: ${result2}`);

// Call with different argument - will calculate new value
const result4 = cache.execute(calculateFactorial, 15);
console.log(`Result: ${result3}`);

// Short-lived cache item
const result5 = cache.executeWithOptions({ ttl: 1000 }, calculateFactorial, 30);
console.log(`Result: ${result4}`);

// Wait 2 seconds then try again (will recalculate due to expiration)
setTimeout(() => {
  const result5 = cache.execute(calculateFactorial, 30);
  console.log(`Result after timeout: ${result5}`);
  console.log('Cache stats:', cache.getStats());
}, 2000);

/*
The above example demonstrates:

Data privacy: All internal variables (cache, accessLog, hitCount, etc.) are protected within the closure scope and cannot be directly accessed or modified.
State persistence: The cache retains state between function calls through the enclosing closure, enabling it to track hits, misses, and access patterns.
Encapsulation: The implementation details (eviction algorithms, expiration checks) are hidden from consumers of the API.
Factory pattern with configuration: The closure allows the creation of multiple independent cache instances, each with their own private state.
Multiple closure scopes: The execution function creates additional closures for each cached function, preserving their calling context.
*/

// More Use Case for Closures
// State Encapsulation -> Create private variables inaccessible from outer scopes
// Functional Factories ->Generate specialized functions with preconfigured behavior
// Event Handler Context ->Maintain references to parent scope variables in asynchronous callbacks
// Memoization & Caching ->Store expensive computation results with automatic invalidation
// Module Pattern -> Implement namespacing and access control for complex systems

// Complex E.g. Smart Cache Manager
// This closure-based solution features LRU (Least Recently Used) eviction, time-based
// expiration, and size limits:

function createCacheSystem({ maxSize = 100, ttl = 30000 } = {}) {
    const cache = new Map();
    const accessTimes = new Map();
    let maintenanceTimeout = null;

    function executeMaintenance() {
      const now = Date.now();

      // Remove expired entries
      cache.forEach((value, key) => {
        if (now - accessTimes.get(key) > ttl) {
          cache.delete(key);
          accessTimes.delete(key);
        }
      });

      // Enforce LRU eviction
      if (cache.size > maxSize) {
        const entries = Array.from(accessTimes.entries())
          .sort((a, b) => a[1] - b[1])
          .slice(0, cache.size - maxSize);

        entries.forEach(([key]) => {
          cache.delete(key);
          accessTimes.delete(key);
        });
      }

      maintenanceTimeout = null;
      scheduleMaintenance();
    }

    function scheduleMaintenance() {
      if (!maintenanceTimeout && (cache.size >= maxSize * 0.9 || ttl)) {
        maintenanceTimeout = setTimeout(
          executeMaintenance,
          Math.min(ttl, 5000)
        );
      }
    }

    return {
      get(key) {
        if (cache.has(key)) {
          accessTimes.set(key, Date.now());
          return cache.get(key);
        }
        return undefined;
      },

      set(key, value) {
        cache.set(key, value);
        accessTimes.set(key, Date.now());
        scheduleMaintenance();
        return value;
      },

      delete(key) {
        cache.delete(key);
        accessTimes.delete(key);
      },

      getStats() {
        return {
          size: cache.size,
          hits: Array.from(accessTimes.values()).length,
          memoryUsage: process.memoryUsage().heapUsed // Node.js specific
        };
      }
    };
  }

  // Usage Example
  const productCache = createCacheSystem({
    maxSize: 5,
    ttl: 10000 // 10-second expiration
  });

  const fetchProduct = async (id) => {
    const cached = productCache.get(id);
    if (cached) return cached;

    const product = await database.query('SELECT * FROM products WHERE id = ?', [id]);
    productCache.set(id, product);
    return product;
  };

/*
Key Closure Features Demonstrated:

    Encapsulated State Management
        cache and accessTimes Maps remain private
        Maintenance timer reference (maintenanceTimeout) hidden from consumers

    Self-Optimizing Behavior
        Automatic cache pruning via closure-preserved configuration
        LRU eviction uses closure-accessed timestamp data

    Complex Lifetime Management
        Maintenance timer survives multiple get/set calls via closure
        Asynchronous cleanup preserves access to cache state

    Performance Optimization
        Memoization pattern prevents redundant database queries
        Maintenance scheduling avoids expensive frequent sweeps
*/

//Simple closure.
//This pattern is often used for creating private variables or maintaining state in functions
//such as counters, timers, caching mechanism.
function createCounter() {
    let count = 0; // This variable is part of the lexical scope of the inner function

    return function () {
      count++; // The inner function "closes over" the `count` variable
      console.log(`Current count: ${count}`);
    };
  }

  const counter = createCounter(); // `createCounter` returns the inner function

  counter(); // Output: Current count: 1
  counter(); // Output: Current count: 2
  counter(); // Output: Current count: 3


//Another example.
//Practical Applications:
// Private Variables: The count variable cannot be accessed directly from outside, providing encapsulation.
// State Preservation: The counter maintains its state between function calls.
// Function Factories: You can create multiple independent counters that don't interfere with each other.
function createCounter() {
    // This variable is defined in the lexical scope of createCounter
    let count = 0;

    // This function forms a closure because it "remembers" and can access
    // the count variable from its parent scope, even after createCounter finishes
    function counter() {
      count += 1;
      return count;
    }

    return counter;
  }

  // Create two independent counters
  const countA = createCounter();
  const countB = createCounter();

  console.log(countA()); // 1
  console.log(countA()); // 2
  console.log(countA()); // 3

  console.log(countB()); // 1
  console.log(countB()); // 2

  console.log(countA()); // 4 (continues from previous state)

  // Lexical scope defines how variable name are resolved in nested functin
  // Nested (child) functions have access to the scope of their parent function
  // This is often confused with closure, but lexical scope is only an important part of closure

// global scope
let x = 1;

const parentFunction = () => {
    //local sope
    let myValue = 2;
    console.log(myValue); // 2
    console.log(x); // 1

    const childFunction = () => {
        console.log(myValue); // 2
        console.log(x); // 1
    }
    //childFunction();
    return childFunction;
}

parentFunction();

const result = parentFunction();
console.log(result);

result();   //6, 3
result();   //11, 4
console.log(myValue); //reference error, private variable.

// The above is often confused with closure, but lexical scope is only important part of closure
// "A closure is a function having access to the parent scope even after the parent function has closed"
// A closure is created when we defined the function, not when a function is executed.

//IIFE
const privateCounter = (() => {\
    let count = 0;
    console.log(count);
    return () => {count +=1; console.log(count)}
})();

privateCounter(); // 1