//https://chat.deepseek.com/a/chat/s/adcb25f1-935f-4bc9-a3d1-50472c6726f8
//Consuming Promises using .then(), .catch() and .finally()
myPromise
  .then(value => {
    // Handle successful fulfillment
    console.log(value);
  })
  .catch(error => {
    // Handle rejection
    console.error(error);
  })
  .finally(() => {
    // Always executes
    console.log('Operation completed');
  });

//Promise Chaining
doFirstThing()
  .then(result => doSecondThing(result))
  .then(newResult => doThirdThing(newResult))
  .catch(error => console.error(error));

//E.g. Resolve promise after a certain time
//https://www.perplexity.ai/search/act-as-javascript-expert-expla-HqDZCax2S9G7rBycsuQHzA
function resolveAfter(value, delay) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(value), delay);
    });
  }

  // Usage
  resolveAfter('Hello, World!', 2000).then((result) => {
    console.log(result); // Logs "Hello, World!" after 2 seconds
  });


