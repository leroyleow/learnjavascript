// Recursion -> For problems that contains smaller instances of the same problem
//Base Case -> Recursion Case

const factorial = (n) => {
    if (n === 0 || n === 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

console.log(factorial(5)); // Output: 120
console.log(factorial(4));
console.log(factorial(3));

