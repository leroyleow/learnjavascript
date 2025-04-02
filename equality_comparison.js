/*
 the == operator does the type conversion of the operands before comparison, whereas the === operator compares the
 values and the data types of the operands. The Object.is() method determines whether two values are the same value:
 Object.is(value1, value2).

 Object.is() is not equivalent to the == operator. The == operator applies various coercions to both sides (if they are
 not the same type) before testing for equality (resulting in such behavior as "" == false being true), but Object.is()
 doesn’t coerce either value.

Object.is() is also not equivalent to the === operator. The only difference between Object.is() and === is in their
treatment of signed zeros and NaN values. The === operator (and the == operator) treats the number values -0 and +0 as
equal but treats NaN as not equal to each other.

=== — strict equality (triple equals)
== — loose equality (double equals)
*/
const num = 0;
const obj = new String("0");
const str = "0";

console.log(num === num);
console.log(obj === obj);
console.log(str === str);

console.log(num === obj);
console.log(num == obj);

console.log("5" === "5");
console.log("5" === 5);

// Object.is() static method determines whether 2 value are the same value
// Case 1: Evaluation result is the same as using ===
Object.is(25, 25); // true
Object.is("foo", "foo"); // true
Object.is("foo", "bar"); // false
Object.is(null, null); // true
Object.is(undefined, undefined); // true
Object.is(window, window); // true
Object.is([], []); // false
const foo = { a: 1 };
const bar = { a: 1 };
const sameFoo = foo;
Object.is(foo, foo); // true
Object.is(foo, bar); // false
Object.is(foo, sameFoo); // true

// Case 2: Signed zero
Object.is(0, -0); // false
Object.is(+0, -0); // false
Object.is(-0, -0); // true

// Case 3: NaN
Object.is(NaN, 0 / 0); // true
Object.is(NaN, Number.NaN); // true