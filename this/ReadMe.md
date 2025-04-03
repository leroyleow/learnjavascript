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

## this
In layman’s terms, this points to the owner of the function call, I repeat, the function call, and NOT the function itself. 
The same function can have different owners in different scenarios. The 4 rules 

### 1. Default binding | Direct invocation
```javascript
function myFunction() {
    console.log(this)
}
myFunction();           // Window {}
```
### 2. Implict binding | Method invocation
```javascript
function myFunction() {
    console.log(this)     
  }
 
const obj = {
  someKey: 1, 
  myFunction: myFunction,
}

obj.myFunction();   
// {someKey: 1, myFunction: ƒ}. ie. obj
```

### 2a.Nested Function
When a function is nested inside a method of an object, the context of the inner function depends only on its invocation type and not on the outer function’s context.

```javascript
const obj = {
  someKey: 1, 
  outer: function() {
    function inner(){
       console.log(this);
    }     
    inner();
  },
}

obj.outer();      // Window {}
```

### 2b. Method separated from the object
When we copy an object method to a new variable, we are creating a reference to the function.
```javascript
function myFunction() {
  console.log(this);
}

const obj = {
  someKey: 1,
  myFunction: myFunction,
}

const newFunction = obj.myFunction;
newFunction();    // Window {}
```

### Explicit binding | Indirect invocation
In this method, we can force a function to use a certain object as its this. Explicit binding call(), apply(), and bind(). call(): Pass in the required object as the first parameter during the function call. The actual parameters are passed after the object. apply(): Similar to call() with a difference in the way the actual arguments are passed. Here, the actual arguments are passed as an array. bind(): In this method, you create a new function with a fixed this. These types of functions created using bind() are commonly known as bound functions.

#### Function.prototype.call()
* Syntax 
call(thisArg)
call(thisArg, arg1)
call(thisArg, arg1, arg2, /*...,*/, argN)

#### Function.prototype.apply()
* Syntax
apply(thisArg)
apply(thisArg, argsArray)

thisArgs -> the value of this provide for the call to function. If the function is not in "strict mode", "nuill" and "undefined" will be replace with global object.

Do not use call(), apply()  to chain constructors (for example, to implement inheritance). This invokes constructor function as plain function, which means new.target. is undefined

#### Function.prototype.bind()
* Syntax
bind(thisArg, arg1, arg2, /* …, */ argN)

#### More Example
```javascript
const numbers = [5, 6, 2, 3, 7];

const max = Math.max.apply(null, numbers);

console.log(max);
// Expected output: 7

const min = Math.min.apply(null, numbers);

console.log(min);
// Expected output: 2
```

#### More Examples

```javascript
function myFunction(param1, param2) {
    console.log(this)     
  }
 
const obj = {
  someKey: 1, 
}

const param1 = 1, param2 = 2;
myFunction.call(obj, param1, param2)       // {someKey: 1}
myFunction.apply(obj, [param1, param2])    // {someKey: 1}

const boundFunction = myFunction.bind(obj);
boundFUnction();    //{someKey: 1}
```

### New Binding | Constructor invocation
#### 4a. Function without Return
```javascript
function myFunction(){
  // JS internally creates an object and refers it as this
  
  // User explicitly adds required properties and methods to the object
  this.someKey = 1;
  this.inner = function(){
    console.log(this);
  }
  
  // JS internally returns the object
}

const obj = new myFunction();
obj.inner()           // {someKey: 1, inner: ƒ} with myFunction prototype
```

#### 4b Function with Return
```javascript
function myFunction(){
  return {
    someKey: 1,
  }
}

const obj = new myFunction();
console.log(obj);    // {someKey: 1} without myFunction prototype
```

## Arrow Functions
Arrow functions use “lexical scoping” to figure out what the value of this should be. Lexical scoping is a fancy way of saying it uses “this” from the outer function in which it is defined.
Simply put, when an arrow function is invoked, JS literally takes the this value from the outer function where the arrow function is declared. I repeat, the outer function, NOT the outer object in which it is defined.

a. If the outer function is a normal function, this depends upon the type of binding of the outer function.

b. If the outer function is an arrow function, JS again checks for the next outer function and this process continues till the global object.

```javascript
function outer(){ 
    let inner = () => { 
      console.log(this);
    };
    inner()
  } 

const objA = {
  someKey: 1,
  outer : outer, 
};
const objB = {
  someKey: 2,
}

// In this example, each time when inner function is called, 
// JS simply takes the this value from outer function
outer();            // Window {}
objA.outer();       // {someKey: 1, outer: ƒ} --> objA
outer.call(objB)    // {someKey: 2} --> objB
```
```javascript
const myFunction = () => {
  console.log(this);
}

const objA = {
  myFunction: myFunction,
  inner: () => {
    console.log(this);
  }
}

const objB = {}

myFunction();                   // Window {}
objA.myFunction()               // Window {}
objA.inner()                    // Window {}
myFunction.call(objB);          // Window {}
const objC = new myFunction()   // myFunction is not a constructor
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

