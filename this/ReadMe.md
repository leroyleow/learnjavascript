# Execution Context

## Global Execution Context 
1. Simple: Global Execution Context
 * What it is:
   * When your JavaScript code initially runs, the JavaScript engine creates a global execution context.
   * This is the default environment where your code starts executing.
   * In a browser, the global execution context creates the window object (or global in Node.js).
   * It also sets the this keyword to refer to this global object

```javascript
    var greeting = "Hello";
    console.log(greeting);
    console.log(this); // In a browser, this will log the window object
```
Explanation:
   * The JavaScript engine creates the global execution context.
   * It then goes through the code, setting up variables (greeting) and making the window object available.
   * The console.log statements are executed within this global context.

2. Function Execution Context
 * What it is:
   * Whenever a function is called, a new function execution context is created.
   * This context is specific to that function and has its own set of variables and data.
   * When the function finishes executing, its execution context is removed.

```javascript
    function greet(name) {
      var message = "Hello, " + name;
      console.log(message);
    }

    greet("Alice");
```
* Explanation:
   * The global execution context is created first.
   * When greet("Alice") is called, a new function execution context is created for the greet function.
   * Inside this function context, the name parameter and the message variable are created.
   * The console.log statement is executed within this function context.
   * Once the greet function finishes, its execution context is removed.

3. Execution Context with Scope Chains
 * What it is:
   * JavaScript uses scope chains to determine the accessibility of variables.
   * When a variable is accessed within a function, the JavaScript engine first looks for it in the function's execution context.
   * If it's not found, it goes up the scope chain to the parent execution context, and so on, until it reaches the global execution context.
```javascript
    var globalVar = "Global";

    function outerFunction() {
      var outerVar = "Outer";

      function innerFunction() {
        var innerVar = "Inner";
        console.log(innerVar);
        console.log(outerVar);
        console.log(globalVar);
      }

      innerFunction();
    }

    outerFunction();
```
 * Explanation:
   * The global execution context contains globalVar.
   * When outerFunction is called, its execution context is created, containing outerVar.
   * When innerFunction is called, its execution context is created, containing innerVar.
   * Inside innerFunction, when console.log is executed:
     * innerVar is found in its own execution context.
     * outerVar is found by going up the scope chain to outerFunction's execution context.
     * globalVar is found by going up the scope chain to the global execution context.
### Key Components of an Execution Context:
 * Variable Environment: Stores variables and function declarations.
 * Scope Chain: Determines the accessibility of variables.
 * this Keyword: Refers to the current execution context.


## Execution Context, Scope Chain, JavaScript Internals
Web Search := "javascript execution context visual" 
 * Key Features:
   * Visual representations of the global execution context and function execution contexts.
   * Diagrams showing the scope chain and how variables are resolved.
   * Explanations of the "this" keyword and how it works in different contexts.
Promise visaulization := "javascript promise visualization"
 * Key Features:
   * Visual representation of the microtask queue.
   * Visual representation of the order of promise resolution.
   * Visual representation of how promises interact with the call stack, and event loop.

## Call Stack, DOM API, PROMISE

JavaScript and how it handles tasks.
1. Call Stack:
 * The call stack is a data structure that tracks the execution of function calls in your JavaScript code.
 * It operates on a "Last In, First Out" (LIFO) principle.
 * When a function is called, it's pushed onto the call stack.
 * When a function finishes executing, it's popped off the call stack.
 * If a function calls another function, the new function is pushed on top of the existing one.
2. DOM API (Document Object Model API):
 * The DOM API allows JavaScript to interact with the structure and content of a web page.
 * Many DOM operations, like fetching data or handling user interactions, are asynchronous.
 * For example, addEventListener to handle a click, or fetch to get data from a server.
 * When an asynchronous DOM operation is initiated, the browser's Web APIs handle it outside the main JavaScript execution thread.
 * Once the operation is complete, a callback function is placed in the task queue (also called the callback queue).
3. Promises:
 * Promises are objects that represent the eventual completion (or failure) of an asynchronous operation.
 * They provide a cleaner and more structured way to handle asynchronous code compared to traditional callbacks.
 * When a promise is resolved or rejected, its associated callback functions are placed in the microtask queue.
 * The microtask queue has a higher priority than the task queue. Meaning that the event loop will empty the microtask queue before it pulls tasks from the task queue.
How They Interact:
Here's a breakdown of how these components work together:
 * Call Stack and Initial Execution:
   * The JavaScript engine starts executing code, and functions are pushed onto the call stack.
   * If a function encounters an asynchronous operation (like a DOM API call or a promise), it delegates that operation to the browser's Web APIs.
 * Web APIs and Queues:
   * The Web APIs handle the asynchronous operation in the background.
   * Once the operation is complete:
     * For DOM API events or setTimeout and similar functions, a callback is placed in the task queue.
     * For promises, the .then() or .catch() callbacks are placed in the microtask queue.
 * Event Loop:
   * The event loop continuously monitors the call stack and the queues.
   * When the call stack is empty, the event loop checks the microtask queue.
   * If there are tasks in the microtask queue, they are moved to the call stack and executed.
   * After the microtask queue is empty, the event loop checks the task queue.
   * If there are tasks in the task queue, they are moved to the call stack and executed.
   * This process repeats.
```javascript
    console.log("Start");

    setTimeout(() => {
      console.log("Timeout");
    }, 0);

    Promise.resolve().then(() => {
      console.log("Promise");
    });

    console.log("End");
```

## Web Resource - Event Loop
Visualize Javascript event loop, call stack, queues (including the microtask queue), and related concepts:-
1. Loupe by Philip Roberts:
 * URL: http://latentflip.com/loupe/ [latentflip.com]
 * Description: This is a classic and highly recommended tool. It provides a clear and interactive visualization of the call stack, event queue, and how asynchronous operations are handled. You can paste JavaScript code and see it execute step by step, which is incredibly helpful for understanding the event loop.
 * Key Features:
   * Visualizes the call stack, event queue, and heap.
   * Shows how asynchronous operations (like setTimeout, fetch) are queued and processed.
   * Allows you to step through code execution.
2. JavaScript Visualizer 9000:
 * URL: https://js9000.app/ [js9000.app]
 * Description: This is another very effective tool that helps visualize the execution of JavaScript code. It is more general than Loupe, and can visualize many aspects of javascript, but also effectively shows the call stack, and asynchronous operations.
 * Key Features:
   * Detailed visualization of the call stack and execution context.
   * Shows how variables and objects are stored in memory.
   * Supports stepping through code and inspecting values.
   * Visualizes asynchronous operations.

