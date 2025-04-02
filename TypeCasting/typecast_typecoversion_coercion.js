//Type conversion (or typecasting) means transfer of data from one data type to another. Implicit conversion happens when
//the compiler (for compiled languages) or runtime (for script languages like JavaScript) automatically converts data types.
//The source code can also explicitly require a conversion to take place.

//Type coercion is the automatic or implicit conversion of values from one data type to another (such as strings to numbers).
//Type conversion is similar to type coercion because they both convert values from one data type to another with one key
//difference — type coercion is implicit whereas type conversion can be either implicit or explicit.
const value1 = "5";
const value2 = 9;
let sum = value1 + value2;
console.log(sum); // Output: "59"

let sum2 = Number(value1) + value2;
console.log(sum2); // Output: 14

//Complex Example
const customObject = {
  valueOf() {
    return 15;
  }, //Primitive value for numeric context
  toString() {
    return "20";
  }, //Primitive value for string context
};

//Explicit conversion (Type conversion)
const explicitNumber = Number(customObject); //Uses valueOf() -> 15
console.log(explicitNumber); // Output: 15

//Explicit conversion (Type coercion)
const explicitString = customObject + ""; //Uses toString() -> 20
console.log(explicitString); // Output: "20"

//Implicit conversion
const implicitSum = value2 + customObject; //Uses valueOf() -> 15
console.log(implicitSum); // Output: 24

const ImplicitConcatenation = "Result:" + customObject;
console.log(ImplicitConcatenation); // Output: "Result:20"

//Key Notes:
//* Object → Primitive Conversion
//      JavaScript prioritizes valueOf() in numeric contexts and toString() in string contexts.
//* Operator-Specific Behavior
//      + operator favors string concatenation if any operand is a string
//      Loose equality (==) coerces both operands before comparison

let a = 7;
let b = '6';
let c = a + b;
console.log(c); // Output: "76"

let d = parseInt('bob', 10);
let e = isNaN(d);
console.log(e); // Output:

// type conversion comparison (implcit)
console.log(125 == '125'); // Output:  true
console.log(125 === '125'); // Output: false

// type conversion comparison (explcit)
let z = 1.015
console.log(z);
console.log(typeof z);
console.log(a.toString());
console.log(typeof a.toString());

let input = 25
console.log("The input value with its type is:",input,typeof(input))
console.log("Arithmetic operation before typecasting with its type is:", (10 + input), typeof((10 + input)))
let sInput = String(input)
console.log("After the type casting is done the type is:",sInput,typeof(sInput))
console.log("Arithmetic operation after typecasting with its type is:", (10 + sInput), typeof(10 + sInput))