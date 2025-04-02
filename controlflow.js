//Any value that is not false, undefined, null, 0, NaN, or an empty string ('') actually returns true
// when tested as a conditional statement
let cheese = "Cheddar";

if (cheese) {
  console.log("Yay! Cheese available for making cheese on toast.");
} else {
  console.log("No cheese on toast for you today.");
}

function getRectArea(width, height) {
    if (isNaN(width) || isNaN(height)) {
      throw new Error("Parameter is not a number!");
    }
  }

  try {
    getRectArea(3, "A");
  } catch (e) {
    console.error(e);
    // Expected output: Error: Parameter is not a number!
  }

//Throw a user-defined error
function isNumeric(x) {
    return ["number", "bigint"].includes(typeof x);
  }

  function sum(...values) {
    if (!values.every(isNumeric)) {
      throw new TypeError("Can only add numbers");
    }
    return values.reduce((a, b) => a + b);
  }

  console.log(sum(1, 2, 3)); // 6
  try {
    sum("1", "2");
  } catch (e) {
    console.error(e); // TypeError: Can only add numbers
  }

//Throw an existing object
function readFilePromise(path) {
    return new Promise((resolve, reject) => {
      readFile(path, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  try {
    const data = await readFilePromise("foo.txt");
    console.log(data);
  } catch (err) {
    console.error(err);
  }

//Throw a custom error
class CustomError extends Error {
    constructor(message, code, details = {}) {
      // Pass message to parent Error constructor
      super(message);

      // Maintain proper stack trace for where our error was thrown
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError);
      }

      // Custom properties
      this.name = 'CustomError';
      this.code = code;
      this.details = details;
      this.timestamp = new Date();
    }
  }

  // Example usage:
  function riskyOperation(param) {
    if (!param) {
      throw new CustomError('Missing required parameter', 'MISSING_PARAM');
    }

    if (typeof param !== 'string') {
      throw new CustomError('Parameter must be a string', 'INVALID_TYPE', {
        expectedType: 'string',
        receivedType: typeof param
      });
    }

    // Proceed with operation if all checks pass
    return `Operation completed with: ${param}`;
  }

  // Using the custom error in a try-catch
  try {
    // This will throw our custom error
    const result = riskyOperation(null);
    console.log(result);
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(`CustomError caught: ${error.code} - ${error.message}`);
      console.error('Details:', error.details);
    } else {
      console.error('Unexpected error:', error);
    }
  }
  finally {
    console.log('This code will always run.');
  }