/*
The for…of statement executes a loop that operates on a sequence of values sourced from an iterable object. Iterable
objects include instances of built-ins such as Array, String, TypedArray, Map, Set, NodeList (and other DOM collections)
, and the arguments object, generators produced by generator functions, and user-defined iterables.
*/
const array1 = ["a", "b", "c", "d", "e"];

for(const element of array1) {
    console.log(element);
}

const iterable = "boo";

for (const value of iterable) {
  console.log(value);
}

const iterableta = new Uint8Array([0x00, 0xff]);

for (const value of iterableta) {
  console.log(value);
}

const imap = new Map([
    ["a", 1],
    ["b", 2],
    ["c", 3],
  ]);

  for (const entry of imap) {
    console.log(entry);
  }
  // ['a', 1]
  // ['b', 2]
  // ['c', 3]

  for (const [key, value] of imap) {
    console.log(value);
  }
  // 1
  // 2
  // 3

  function foo() {
    for (const value of arguments) {
      console.log(value);
    }
  }

  foo(1, 2, 3);
  // 1
  // 2
  // 3

const articleParagraphs = document.querySelectorAll("article > p");
for (const paragraph of articleParagraphs) {
  paragraph.classList.add("read");
}

/*
The for…in statement iterates over all enumerable properties of an object that are keyed by strings
(ignoring ones keyed by Symbols), including inherited enumerable properties.
*/
const object = { a: 1, b: 2, c: 3 };

for (const property in object) {
  console.log(`${property}: ${object[property]}`);
}

// Expected output:
// "a: 1"
// "b: 2"
// "c: 3"

//The following function illustrates the use of Object.hasOwn(): the inherited properties are not displayed.
const triangle = { a: 1, b: 2, c: 3 };

function ColoredTriangle() {
  this.color = "red";
}

ColoredTriangle.prototype = triangle;

const obj = new ColoredTriangle();

for (const prop in obj) {
  if (Object.hasOwn(obj, prop)) {
    console.log(`obj.${prop} = ${obj[prop]}`);
  }
}

// Logs:
// "obj.color = red"

// Changing the prototype during iteration
const objc = { a: 1, b: 2 };

for (const prop in objc) {
  console.log(`obj.${prop} = ${objc[prop]}`);
  Object.setPrototypeOf(objc, { c: 3 });
}


let user = {
    name: "John",
    age: 30,
    isAdmin: true
  };

  for (let key in user) {
    // keys
    alert( key );  // name, age, isAdmin
    // values for the keys
    alert( user[key] ); // John, 30, true
  }