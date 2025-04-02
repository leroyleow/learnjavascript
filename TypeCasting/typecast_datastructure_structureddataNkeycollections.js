//explain JSON
//https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON

//structure data enable google to search for the page
//https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

//Map object holds key-value pairs and remembers the original insertion order of the key
//A key in the Map may only occur once.
//A Map object is iterated by key-value pairs — a for...of loop returns a 2-member array of [key, value] for each iteration
const map1 = new Map();
map1.set("a",1);
map1.set("b",2);
map1.set("c",3);

console.log(map1); //Map { 'a' => 1, 'b' => 2, 'c' => 3 }
console.log(map1.get("a")); //Map { 'a' => 1

map1.set("a", 97);
console.log(map1.get("a")); //Map { 'a' => 1

console.log(map1.size);

//The correct usage for storing data in a Map is through the set(key, value)
const contacts = new Map();
contacts.set("Jessie", { phone: "213-555-1234", address: "123 N 1st Ave" });
contacts.has("Jessie"); // true
contacts.get("Hilary"); // undefined
contacts.set("Hilary", { phone: "617-555-4321", address: "321 S 2nd St" });
contacts.get("Jessie"); // {phone: "213-555-1234", address: "123 N 1st Ave"}
contacts.delete("Raymond"); // false
contacts.delete("Jessie"); // true
console.log(contacts.size); // 1

//chaining in map
const chainmap = new Map();
chainmap.set('1', 'str1').set(1, 'num1').set(true, 'bool1');

//Iteration over Maps
let recipeMap = new Map([
    ['cucumber', 500],
    ['tomatoes', 350],
    ['onion',    50]
  ]);

  // iterate over keys (vegetables)
  for (let vegetable of recipeMap.keys()) {
    console.log(vegetable); // cucumber, tomatoes, onion
  }

  // iterate over values (amounts)
  for (let amount of recipeMap.values()) {
    console.log(amount); // 500, 350, 50
  }

  // iterate over [key, value] entries
  for (let entry of recipeMap) { // the same as of recipeMap.entries()
    console.log(entry); // cucumber,500 (and so on)
  }

  //OR
  recipeMap.forEach( (value, key, map) => {
    console.log(`${key}: ${value}`); // cucumber: 500 etc
  });

//Set object lets you store unique values of any type, whether primitive values or object references.
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
//A.difference(B), A.intersection(B), A.symmetricDifference(B), A.union(B), A.isDisjointFrom(B), A.isSubsetOf(B), A.isSupersetOf(B),
const a = new Set([1, 2, 3]);
const b = new Map([
  [1, "one"],
  [2, "two"],
  [4, "four"],
]);
console.log(a.union(b)); // Set(4) {1, 2, 3, 4}

const mySet1 = new Set();

mySet1.add(1); // Set(1) { 1 }
mySet1.add(5); // Set(2) { 1, 5 }
mySet1.add(5); // Set(2) { 1, 5 }
mySet1.add("some text"); // Set(3) { 1, 5, 'some text' }
const o = { a: 1, b: 2 };
mySet1.add(o);

mySet1.add({ a: 1, b: 2 }); // o is referencing a different object, so this is okay

mySet1.has(1); // true
mySet1.has(3); // false, since 3 has not been added to the set
mySet1.has(5); // true
mySet1.has(Math.sqrt(25)); // true
mySet1.has("Some Text".toLowerCase()); // true
mySet1.has(o); // true

mySet1.size; // 5

mySet1.delete(5); // removes 5 from the set
mySet1.has(5); // false, 5 has been removed

mySet1.size; // 4, since we just removed one value

mySet1.add(5); // Set(5) { 1, 'some text', {...}, {...}, 5 } - a previously deleted item will be added as a new item, it will not retain its original position before deletion

console.log(mySet1); // Set(5) { 1, "some text", {…}, {…}, 5 }

//Iterating over a Set
const set = new Set(['red', 'green', 'blue']);
for (const x of set) {
  console.log(x);
}

