let single = "single-quoted";
let double = "double-quoted";

let backticks = `backticks`;

//Backtick allow string interpolation, allow multiple lines
function sum(a, b) {
  return a + b;
}

alert(`1 + 2 = ${sum(1, 2)}.`); // 1 + 2 = 3.

let guestList = `Guests:
* John
* Pete
* Mary
`;

alert(guestList); // a list of guests, multiple lines

//string.includes, string.startsWith, string.endsWith, string.slic(0, 5), string.substring(0,5),
var a; //javascript predefined to unedfined

let num1 = 255; // integer
let num2 = 255.0; // floating-point number with no fractional part
let num3 = 0xff; // hexadecimal notation
let num4 = 0b11111111; // binary notation
let num5 = 0.255e3; // exponential notation

console.log(num1 === num2); // true
console.log(num1 === num3); // true
console.log(num1 === num4); // true
console.log(num1 === num5); // true

//BigInt
let lrgNum = BigInt(Number.MAX_SAFE_INTEGER);
let smallNum = BigInt(Number.MIN_SAFE_INTEGER);

console.log(lrgNum);
console.log(smallNum);
console.log(Number.isSafeInteger(lrgNum));

let anotherlrgNum = 983458n;
