//https://www.phind.com/search/cm8xw4mtb0000356noompfl58
const myPromise = new Promise((resolve, reject) => {
    // Asynchronous operation here
    if (/* operation successful */) {
      resolve('Success');
    } else {
      reject('Error');
    }
  });

//Promise Chaining
myPromise
  .then((value) => {
    // Handle success
    console.log(value);
  })
  .catch((error) => {
    // Handle error
    console.error(error);
  });

//Promise Composition
//Running multiple promises concurrently
// Running multiple promises concurrently
Promise.all([promise1, promise2])
  .then(([result1, result2]) => {
    // Handle all results
  })
  .catch(error => console.error('Error:', error));

//Create a basic promise
// Create a basic Promise
const myPromise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve("Operation successful!");
      } else {
        reject("Operation failed!");
      }
    }, 1000);
  });

  // Chain handlers
  myPromise2
    .then(result => {
      console.log("Success:", result);
      return "Next operation";
    })
    .then(nextResult => {
      console.log("Second success:", nextResult);
    })
    .catch(error => {
      console.error("Error:", error);
    });


//Simulating a fetch-like operation
function fetchData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true;
        if (success) {
          resolve({
            status: 200,
            data: { message: "API response" }
          });
        } else {
          reject(new Error("Network error"));
        }
      }, 1000);
    });
  }

  // Modern async/await syntax
  async function getData() {
    try {
      const response = await fetchData();
      console.log('Response:', response.data.message);

      // Chain another operation
      const processData = await processResponse(response.data);
      console.log('Processed:', processData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Helper function to simulate processing
  function processResponse(data) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Processed: ${data.message}`);
      }, 500);
    });
  }

  getData();

// Promise Pitfall
//Avoid Promise Hell
// ❌ Wrong - Nested promises
promise.then(value => {
    return promise2.then(result => {
      return promise3.then(final => {
        // Deep nesting makes code hard to read
      });
    });
  });

  // ✅ Correct - Flat chain
  promise
    .then(value => promise2)
    .then(result => promise3)
    .catch(error => console.error('Error:', error));

//Missing Return in Promise Chain [Wrong]
function processData() {
    return fetch('/api/data')
      .then(response => {
        const data = response.json();
        // Missing return statement
      })
      .then(result => {
        console.log(result); // result will be undefined
      });
  }

//[Correct]
function processData() {
    return fetch('/api/data')
      .then(response => response.json()) // Return the promise
      .then(data => {
        console.log('Processing:', data);
        return data; // Return processed data
      });
  }

//Nested Promise [Wrong]
function processData() {
    return fetch('/api/data')
      .then(response => {
        response.json()
          .then(data => {
            fetch(`/api/more/${data.id}`)
              .then(moreResponse => {
                moreResponse.json()
                  .then(finalData => {
                    console.log('Final:', finalData);
                  });
              });
          });
      });
  }

//[Correct]
function processData() {
    return fetch('/api/data')
      .then(response => response.json())
      .then(data =>
        fetch(`/api/more/${data.id}`)
          .then(moreResponse => moreResponse.json())
      )
      .catch(error => console.error('Error:', error));
  }

//Unhandled Promise Rejections
function fetchData() {
    fetch('/api/data')
      .then(response => {
        if (!response.ok) throw new Error('Invalid response');
        return response.json();
      });
  }

  // Usage without error handling
  fetchData(); // Unhandled rejection if API fails

//[Correct]
function fetchData() {
    return fetch('/api/data')
      .then(response => {
        if (!response.ok) throw new Error('Invalid response');
        return response.json();
      })
      .catch(error => {
        console.error('API Error:', error);
        throw error; // Re-throw to allow caller to handle
      });
  }

  // Usage with proper error handling
  fetchData()
    .catch(error => {
      // Global error handler
      console.error('Global Error Handler:', error);
    });




