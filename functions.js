//Default parameters
//function fnName(param1 = defaultValue1, /* …, */ paramN = defaultValueN) {
function multiply(a, b = 1) {
  return a * b;
}

console.log(multiply(5, 2));
// Expected output: 10

console.log(multiply(5));
// Expected output: 5

//Rest parameters
//A function definition can only have 1 rest parameter.
//The rest parameter must be the last parameter in the function definition
//The rest parameter cannot have default value.
function sum(...theArgs) {
  let total = 0;
  for (const arg of theArgs) {
    total += arg;
  }
  return total;
}

console.log(sum(1, 2, 3));
// Expected output: 6

console.log(sum(1, 2, 3, 4));
// Expected output: 10

function myFun(a, b, ...manyMoreArgs) {
  console.log("a", a);
  console.log("b", b);
  console.log("manyMoreArgs", manyMoreArgs);
}

myFun("one", "two", "three", "four", "five", "six");

// Console Output:
// a, one
// b, two
// manyMoreArgs, ["three", "four", "five", "six"]

//Complex example of rest parameters
/*
  The processOrders function uses a rest parameter ...orders to accept any number of order
  objects.

It processes each order using map, creating a new structure with additional information.

Within the mapping, it uses reduce to transform the items array into an object for easier
access.

After processing individual orders, it generates a summary using another reduce operation.

The function returns an object containing both the processed orders and the summary.
  */
function processOrders(customer, ...orders) {
  const processedOrders = orders.map((order, index) => {
    const { id, items, total } = order;
    const processedItems = items.reduce((acc, item) => {
      const { name, quantity, price } = item;
      const subtotal = quantity * price;
      acc[name] = { quantity, price, subtotal };
      return acc;
    }, {});

    return {
      orderId: id,
      customerName: customer,
      orderNumber: index + 1,
      items: processedItems,
      totalAmount: total,
      processingDate: new Date().toISOString(),
    };
  });

  const summary = processedOrders.reduce(
    (acc, order) => {
      acc.totalOrders++;
      acc.totalAmount += order.totalAmount;
      acc.itemsSold += Object.keys(order.items).length;
      return acc;
    },
    { totalOrders: 0, totalAmount: 0, itemsSold: 0 }
  );

  return { processedOrders, summary };
}

const result = processOrders(
  "John Doe",
  {
    id: "ORD001",
    items: [
      { name: "Widget", quantity: 2, price: 10 },
      { name: "Gadget", quantity: 1, price: 20 },
    ],
    total: 40,
  },
  {
    id: "ORD002",
    items: [{ name: "Gizmo", quantity: 3, price: 15 }],
    total: 45,
  },
  {
    id: "ORD003",
    items: [
      { name: "Widget", quantity: 1, price: 10 },
      { name: "Gadget", quantity: 2, price: 20 },
    ],
    total: 50,
  }
);

console.log(JSON.stringify(result, null, 2));

//Complex rest parameters
//Data prcessing pipeline that demonstrates the power of REST parameters
function processData(processor, ...dataPoints) {
  // Validate we have data to process
  if (dataPoints.length === 0) {
    return { error: "No data provided" };
  }

  // Apply the processor to each data point
  const results = dataPoints.map(processor);

  // Calculate statistics
  const sum = results.reduce((acc, val) => acc + val, 0);
  const average = sum / results.length;
  const min = Math.min(...results);
  const max = Math.max(...results);

  // Return processed data with statistics
  return {
    processedData: results,
    statistics: {
      count: results.length,
      sum,
      average,
      min,
      max,
    },
    rawData: dataPoints,
  };
}

// Example usage:
const normalizeData = (value) => (value - 50) / 25;
const result3 = processData(normalizeData, 25, 50, 75, 100, 125);
console.log(result3);
/* Output:
  {
    processedData: [-1, 0, 1, 2, 3],
    statistics: {
      count: 5,
      sum: 5,
      average: 1,
      min: -1,
      max: 3
    },
    rawData: [25, 50, 75, 100, 125]
  }
  */

//Arrow Function
//Rest parameters, default parameters, and destructuring within params are supported, and always require parentheses:
const materials = ["Hydrogen", "Helium", "Lithium", "Beryllium"];

console.log(materials.map((material) => material.length));
// Expected output: Array [8, 6, 7, 9]

//IIFE Immediately-Invoke Function is a function that is executed immediately after it is created
//Use case -> simply want to call a function in order to get an output, but that’s it — we’ll never want
// to use it again and don’t want our program to ever be able to accidentally access it.
// Use case : Creating private scope, Avoding global namespace pollution, Execute async code in a controlled environment, Module pattern implemnatin, 1 time init
(function () {
  var x = 20;
  var y = 20;
  var answer = x + y;
  console.log(answer);
})();

//Complex Example
/*
  Creates a complete state management library similar to Redux
Maintains a private scope for internal implementation details
Exposes only a controlled public API
Provides middleware support, subscriptions, and time-travel debugging
Prevents direct state mutation through proper encapsulation

The IIFE pattern here gives us several advantages:

Complete data privacy for internal variables
Protection against global namespace pollution
Immediate initialization of the module
Clear separation between public and private functionality

This pattern is especially useful for creating reusable libraries, utilities, or modules where you need to maintain
internal state while exposing a clean interface.
  */
const StateManager = (function () {
  // Private variables
  const states = {};
  let listeners = [];
  let middleware = [];
  const history = [];
  const MAX_HISTORY = 50;

  // Private utility functions
  function validateState(state) {
    if (typeof state !== "object" || Array.isArray(state) || state === null) {
      throw new Error("State must be a non-null object");
    }
    return true;
  }

  function applyMiddleware(state, action) {
    return middleware.reduce((processedState, middlewareFn) => {
      return middlewareFn(processedState, action);
    }, state);
  }

  function notifyListeners(state, action) {
    listeners.forEach((listener) => listener(state, action));
  }

  function addToHistory(state, action) {
    history.push({ state: { ...state }, action, timestamp: Date.now() });
    if (history.length > MAX_HISTORY) {
      history.shift();
    }
  }

  // Public API
  return {
    // Initialize a new state branch
    createStore: function (namespace, initialState = {}) {
      if (states[namespace]) {
        throw new Error(`Store with namespace "${namespace}" already exists.`);
      }

      validateState(initialState);
      states[namespace] = { ...initialState };
      return namespace;
    },

    // Update state with action
    dispatch: function (namespace, action) {
      if (!states[namespace]) {
        throw new Error(`Store with namespace "${namespace}" does not exist.`);
      }

      if (!action || typeof action.type !== "string") {
        throw new Error("Action must have a type property");
      }

      const currentState = states[namespace];
      const newState = { ...currentState, ...action.payload };
      const processedState = applyMiddleware(newState, action);

      // Update state
      states[namespace] = processedState;

      // Record in history
      addToHistory(processedState, action);

      // Notify subscribers
      notifyListeners(processedState, action);

      return processedState;
    },

    // Get current state
    getState: function (namespace) {
      if (!states[namespace]) {
        throw new Error(`Store with namespace "${namespace}" does not exist.`);
      }

      // Return a copy to prevent direct mutations
      return { ...states[namespace] };
    },

    // Subscribe to state changes
    subscribe: function (callback) {
      if (typeof callback !== "function") {
        throw new Error("Listener must be a function");
      }

      listeners.push(callback);

      // Return unsubscribe function
      return function unsubscribe() {
        listeners = listeners.filter((listener) => listener !== callback);
      };
    },

    // Add middleware
    use: function (middlewareFn) {
      if (typeof middlewareFn !== "function") {
        throw new Error("Middleware must be a function");
      }

      middleware.push(middlewareFn);

      // Return function to remove middleware
      return function remove() {
        middleware = middleware.filter((mw) => mw !== middlewareFn);
      };
    },

    // Time travel debugging
    getHistory: function () {
      return [...history];
    },

    // Reset a store to initial state
    resetStore: function (namespace) {
      if (!states[namespace]) {
        throw new Error(`Store with namespace "${namespace}" does not exist.`);
      }

      // Keep only the initial state values from history
      const initialState = history.find(
        (item) =>
          item.action.type === "INITIALIZE" &&
          item.action.namespace === namespace
      );

      if (initialState) {
        states[namespace] = { ...initialState.state };
        return { ...states[namespace] };
      }

      return null;
    },
  };
})();

// Usage example
const userStore = StateManager.createStore("users", {
  list: [],
  loading: false,
  error: null,
});

// Add logging middleware
StateManager.use((state, action) => {
  console.log(`Action: ${action.type}`, state);
  return state;
});

// Subscribe to changes
const unsubscribe = StateManager.subscribe((state, action) => {
  console.log(`State updated after ${action.type}`, state);
});

// Dispatch actions
StateManager.dispatch("users", {
  type: "FETCH_USERS",
  payload: { loading: true },
});

StateManager.dispatch("users", {
  type: "FETCH_USERS_SUCCESS",
  payload: {
    loading: false,
    list: [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
    ],
  },
});

// Get current state
const currentState = StateManager.getState("users");
console.log("Current state:", currentState);
