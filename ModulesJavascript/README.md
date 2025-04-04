# Modules, introduction

As our application grows, we need to split our code into smaller, more manageable pieces. This is where modules come in. A module is a self-contained unit of code that encapsulates functionality, data, and behavior.

## What is a module?
A module is just a file. One script is one module.

## Why use modules?
- **Encapsulation**: Modules help us encapsulate functionality, data, and behavior within a single unit, which makes it easier to manage and reuse code.
- **Reusability**: Modules allow us to reuse code across different parts of our application or even different applications.
- **Maintainability**: Modules make our code more organized and easier to understand, which makes it easier to maintain and update.

## How to use modules?
* export keyword labels variables and functions that should be accessible from outside the current module.
* import allows the import of functionality from other modules.

```javascript
//sayHi.js
export function sayHi() {
    console.log("Hello!");
}
```

```javascript
//main.js
import { sayHi } from './sayHi.js';

alert(sayHi); // this will log the function definition
sayHi(); // this will log "Hello!"
```

```html
<script type="module" src="main.js"></script>
<script type="module">
    import { sayHi } from './sayHi.js';

    document.body.innerHTML = sayHi('John');
</script>
```
## Basic Module Concepts
Modules have 3 key characteristics:
1. Independent/Self-contained: Each module operates within its own scope
2. Specific: Focuses on performing a single task or related group of tasks
3. Reusable: Can be easily integrated into different parts of your application

## Core Module Features
### Alway "use strict"
Modules always work in strict mode. E.g assign to an undeclared variable will give an error
```html
<script type="module">
    a = 5; //error
</script>
```
### Module-level scope
Each module has its own top-level scope. Top-level variable and functions from a module are not seen in other scripts

```javascript
//hello.js
import {user} from './user.js';

document.body.innerHTML = user; // John

//user.js
export let user = "John";

//index.html
<!doctype html>
<script type="module" src="hello.js"></script>
```

Here are 2 scripts on the same page, both type="module". They don't see each other's top-level variables.
```html
<script type="module">
  // The variable is only visible in this module script
  let user = "John";
</script>

<script type="module">
  alert(user); // Error: user is not defined
</script>
```
<b>Note:</b> In the browser, we can make a variable window-level global by explicitly assigning it to a window property. e.g. window.user = "John"
Then all script will see it both with type="module" and without it.

### A module code is evaluated only the first time when imported

If the same module is imported into multiple other modules, its code is executed only once, upon the first import. Then its exports are given to all further importers.

First, if executing a module code brings side-effects, like showing a message, then importing it multiple times will trigger it only once – the first time:

```javascript
// 📁 alert.js
alert("Module is evaluated!");

// Import the same module from different files

// 📁 1.js
import `./alert.js`; // Module is evaluated!

// 📁 2.js
import `./alert.js`; // (shows nothing)
```
There’s a rule: top-level module code should be used for initialization, creation of module-specific internal data structures. If we need to make something callable multiple times – we should export it as a function, like we did with sayHi above.

```javascript
// admin.js
export let admin = {
    name: "John"
};

// 1.js
import {admin} from './admin.js';
admin.name = "Pete";

//2.js
import {admin} from './admin.js';
alert(admin.name); //Pete

//Both 1.js and 2.js reference the same admin object
//Changes made in 1.js are visible in 2.js
```

<b>Such behavior is actually very convenient, because it allows us to configure modules</b>
In other words, a module can provide a generic functionality that needs a setup. E.g. authentication needs credentials. Then it can export a configuration object expecting the outer code to assign to it.

Here’s the classical pattern:

1. A module exports some means of configuration, e.g. a configuration object.
2. On the first import we initialize it, write to its properties. The top-level application script may do that.
3. Further imports use the module.
```javascript
// 📁 admin.js
export let config = { };

export function sayHi() {
  alert(`Ready to serve, ${config.user}!`);
}

// 📁 init.js
import {config} from './admin.js';
config.user = "Pete";

// 📁 another.js
import {sayHi} from './admin.js';

sayHi(); // Ready to serve, Pete!
```

### In a module, "this" is undefined
```javascript
<script>
  alert(this); // window
</script>

<script type="module">
  alert(this); // undefined
</script>
```
### Named Exports(multiple export):
There are 2 ways to export functionality from modules
1. Named Exports(multiple exports):
```javascript
// utils.js
export function formatName(name){
  return name.toUpperCase();
}
export const VERSION = '1.0';
```

2. Default Export(single primary export)
```javascript
// mainCalculator.js
export default function calculate(a, b) {
    return a + b;
}
```

# Build Tools
In real-life, browser modules are rarely used in their “raw” form. Usually, we bundle them together with a special tool such as Webpack and deploy to the production server.

One of the benefits of using bundlers – they give more control over how modules are resolved, allowing bare modules and much more, like CSS/HTML modules.

Build tools do the following:

1. Take a “main” module, the one intended to be put in <b>script type="module"</b> in HTML.
2. Analyze its dependencies: imports and then imports of imports etc.
3. Build a single file with all modules (or multiple files, that’s tunable), replacing native import calls with bundler functions, so that it works. “Special” module types like HTML/CSS modules are also supported.
4. In the process, other transformations and optimizations may be applied:
* Unreachable code removed.
* Unused exports removed (“tree-shaking”).
* Development-specific statements like console and debugger removed.
* Modern, bleeding-edge JavaScript syntax may be transformed to older one with similar functionality using Babel.
* The resulting file is minified (spaces removed, variables replaced with shorter names, etc).

If we use bundle tools, then as scripts are bundled together into a single file (or few files), import/export statements inside those scripts are replaced by special bundler functions. So the resulting “bundled” script does not contain any import/export, it doesn’t require type="module", and we can put it into a regular script:

```html
<!-- Assuming we got bundle.js from a tool like Webpack -->
<script src="bundle.js"></script>
```



# Examples
## From Phind
```javascript
  // calculator.js
  function add(a, b) {
      return a + b;
  }

  function multiply(a, b) {
      return a * b;
  }

  export { add, multiply };

  // main.js
  import { add, multiply } from './calculator.js';

  const sum = add(5, 3);      // 8
  const product = multiply(5, 3);  // 15
```

From Phind Complex E.g.
https://www.phind.com/search/cm924aan10000356mraw9w4a4

```javascript
// script1.js
import { functionFromScript2 } from './script2.js';
import { functionFromScript3 } from './script3.js';

console.log("This is from script1");
functionFromScript2();
functionFromScript3();

// script2.js
import { functionFromScript3 } from './script3.js';
console.log("This is from script2");

export function functionFromScript2() {
    console.log("Function from script2");
    functionFromScript3();
}

// script3.js
console.log("This is from script3");
export function functionFromScript3() {
    console.log("Function from script3");
}
```

## From Deepseek
https://chat.deepseek.com/a/chat/s/c74a9bcf-c4a2-4e2a-8fe4-24bbac96aaa6
```javascript
// init.js
console.log('Initializing application...');

export const config = {
  env: process.env.NODE_ENV || 'development',
  apiUrl: 'https://api.example.com'
};

// app.js
import { config } from './init.js';
// When app.js is imported, you'll see "Initializing application..." in console
```

## From Claud
https://claude.ai/chat/2a36fad0-1be6-4cd6-9675-43587e291ede

### Named vs Defaults
```javascript
// utils.js
// Named exports
export const PI = 3.14159;
export function square(x) {
  return x * x;
}

// Default export
export default class Calculator {
  add(a, b) { return a + b; }
  subtract(a, b) { return a - b; }
}

//main.js
// Different ways to import
import Calculator, { PI, square } from './utils.js';  // Import default and named exports
import * as Utils from './utils.js';                  // Import everything as a namespace
import { square as squareFunction } from './utils.js'; // Rename imports

const calc = new Calculator();
console.log(calc.add(5, 3));          // 8
console.log(PI);                      // 3.14159
console.log(square(4));               // 16
console.log(Utils.PI);                // 3.14159
console.log(squareFunction(4));       // 16
```
### Dynamic Imports
```javascript
// Dynamic import for lazy loading
async function loadModule() {
  try {
    const mathModule = await import('./math.js');
    console.log(mathModule.add(5, 3));
    console.log(mathModule.default(4, 2)); // Default export is accessed via .default
  } catch (error) {
    console.error('Failed to load module:', error);
  }
}

// Use when needed
loadModule();
```

Complex Example
```javascript
// logger.js
export default class Logger {
  log(message) {
    console.log(`[LOG]: ${message}`);
  }

  error(message) {
    console.error(`[ERROR]: ${message}`);
  }
}

//api-service.js
export default class ApiService {
  constructor(baseUrl, logger) {
    this.baseUrl = baseUrl;
    this.logger = logger;
  }

  async fetchData(endpoint) {
    this.logger.log(`Fetching data from ${endpoint}`);
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`);
      return await response.json();
    } catch (error) {
      this.logger.error(`Failed to fetch: ${error.message}`);
      throw error;
    }
  }
}

//app.js
// app.js
import Logger from './logger.js';
import ApiService from './api-service.js';

// Dependency injection
const logger = new Logger();
const api = new ApiService('https://api.example.com', logger);

// Using the modules
async function fetchUserData() {
  try {
    const data = await api.fetchData('users');
    logger.log('User data retrieved successfully');
    return data;
  } catch (error) {
    logger.error('Could not retrieve user data');
    return null;
  }
}

fetchUserData();
```

