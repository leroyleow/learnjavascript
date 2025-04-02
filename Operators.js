//Comparsion different type
console.log(2 < 12);
console.log(2 < "12");
console.log(2 > "John");

//Nullish Coalescing Operator(??)
let name = null;
let text = "missing";
let result = name ?? text;
console.log(result);

//Optional Chaining Operator(?.)
const car = {type: "Flat", model:"500", color:"white"};
console.log(car?.name);

//Comma Operators(,) evaluates each of its operands (from left to right) and returns the value of last operand
//This is commonly used to provide multiple updaters to a for loop's arguments
let x = 1;

x = (x++, x);
console.log(x);

x = (2, 3)
console.log(x);

//Complex Example
let y, z;
let result2 = (z += 5, y *=2, z+y);
console.log(result2); //15

//data transformation pipeline using functional programming pattern or reducer pattern.
//1. Multiple accumulator properties updated sequentially within a single reducer callback
//2. The peak tracking line (value > acc.peak && (acc.peak = value, acc.peakTime = timestamp)) uses logical AND short-circuiting combined with comma-separated mutations
//3. TSeven distinct operations execute before returning the modified acc object, avoiding temporary variables.
const processMetrics = (data) =>
    data.reduce(
      (acc, { timestamp, value }) => (
        // Side effect: Update rolling average
        acc.rollingSum += value,
        acc.rollingAvg = acc.rollingSum / ++acc.count,

        // Side effect: Track peak values
        (value > acc.peak && (acc.peak = value, acc.peakTime = timestamp)),

        // Final expression: Build enriched data object
        acc.entries.push({
          timestamp,
          value,
          delta: value - acc.prevValue,
          rollingAvg: acc.rollingAvg
        }),
        acc.prevValue = value,
        acc
      ),
      // Initial accumulator value
      {
        rollingSum: 0,
        rollingAvg: 0,
        count: 0,
        peak: -Infinity,
        peakTime: null,
        prevValue: null,
        entries: []
      }
    );

// Reducer Pattern = Reducer Function + Iteration Process + Accumulation + Initial Value + Final Result.
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const sum = numbers.reduce((acc, currentvalue) => {
    return acc + currentvalue;
}, 0);

console.log(sum); // 45s
