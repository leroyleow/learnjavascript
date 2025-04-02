//Here a complex example demonstrates chained promises, error handling and, prallel execution, retry logic.
// Simulate fetching user data from an API with a delay
function fetchUserData(userId) {
    return new Promise((resolve, reject) => {
      console.log(`Fetching data for user ${userId}...`);
      setTimeout(() => {
        const mockData = {
          id: userId,
          name: 'John Doe',
          preferences: { theme: 'dark' }
        };
        Math.random() > 0.2 ? resolve(mockData) : reject('Network Error');
      }, 1000);
    });
  }

  // Process user preferences with validation
  function processPreferences(data) {
    return new Promise((resolve) => {
      console.log('Processing preferences...');
      if (!data.preferences?.theme) {
        throw new Error('Invalid preferences format');
      }
      data.processed = true;
      resolve(data);
    });
  }

  // Retry wrapper function for unreliable operations
  function withRetry(fn, retries = 3) {
    return function(...args) {
      return fn(...args).catch(err => {
        return retries > 0
          ? withRetry(fn, retries - 1)(...args)
          : Promise.reject(`Failed after ${retries} retries: ${err}`);
      });
    };
  }

  // Complex example execution
  const userId = 123;

  // 1. Fetch user data
  fetchUserData(userId)
    // 2. Process data and handle errors
    .then(data => {
      return processPreferences(data);
    })
    // 3. Save processed data (with retry logic)
    .then(withRetry(processedData => {
      return new Promise((resolve, reject) => {
        console.log('Saving data...');
        setTimeout(() => {
          Math.random() > 0.5
            ? resolve({ ...processedData, saved: true })
            : reject('Database save failed');
        }, 500);
      });
    }))
    // 4. Final success handler
    .then(finalResult => {
      console.log('Success:', finalResult);
    })
    // 5. Global error handler
    .catch(err => {
      console.error('Error:', err);
    })
    // 6. Cleanup operations
    .finally(() => {
      console.log('Operation completed');
    });
