// Limitations of callbacks and events
// event handlers are merely callbacks and events (passed into addEventListener() or assigned to event-handlers properties such as onclick)
// the issue with callbacks is where we need to execute an asynchronous task upon the completion of another asynchronous task -> nest async tasks / callback hell
//https://www.youtube.com/watch?v=Xs1EMmBLpn4

// E.g. https://www.codeguage.com/courses/advanced-js/promises-introduction
function getJSON(url, callback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
       if (this.state === 4 && this.status === 200) {
          try {
             var json = JSON.parse(this.responseText);
             callback(json);
          }
          catch (e) {
             errorCallback(e);
          }
       }
    }
    xhr.open('GET', url, false);
    xhr.send();
 }

/*
json 1st level
{
 "gallery": "/gallery/p1",
 "name": "Learn Javascript",
 "price": 2.5
}

json 2nd level for /gallery/p1
[
  "/static/images/i1.png",
  "/static/images/i2.png",
  "/static/images/i3.png"
]
*/
getJSON('/products/p1', function(product) {
    getJSON(product.gallery, function(gallery)  {});
});

// Solution 1: replacing each anonymous callback with a named callback
// Solution 2: Promise -> A promise is an a means of placeholding the success or failure of a given task. Usually, this task is an asynchronous task
//                     -> Benefit of promise is that we can pass the object around a program, with different segments handling the eventual resolution of the underlying async task in different ways.
// Promise() constructor accepts a single argument which is a function enscapsulating the code for the async operation, so Promise() constructor has control over when and how to execute the code contained in the function. -> executor function
// Promise() constructor calls executor function with 2 arguments, both functions. [resolve, reject]
// Promise state: Prending, Fulfilled, Rejected. Fulfilled -> resolved, Rejected -> rejected
// value of promise -> outcome of operation [result / reason]
// Promise = executor function + state + value
var timePromise = new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve("Time is up!");
    }, 2000);
});

// then() method on the promise object is invoked when it gets resolved or rejected
// then() method instructs the promise object something like: "perform that async operation and then, once it completes, do this"
// syntax -> promise.then(onFulfilled, onRejected)
var timePromise2 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve("Time is up!");
    }, 2000);
});

timePromise2.then(
    function(value) {
        console.log(value); //Write "Time is up!" after resolve
    });

//Annoymous Promise
new Promise(function(succeed, reject){
    setTimeout(function() {
        succeed("Time is up!");
    });
})
.then(function(value){
    console.log(value); //Write "Time is up!" after resolve
});

//Important If a promise is unsettled and we invoke then() on it, there's no point of executing the callback sent to then() at this stage
//          The only way out is to store the given callback within the promise and fire it as soon as the promise is settled (by calling resolve() or reject() in executor)
//Every promise object internally maintains 2 callback queues: 1 holding all the functions to fire on resolution and the other holding all the function to fire on rejection
//With the invocation of then() while a promise is still unsettle, these queues fill up;
//When the resolve() parameter of the executor is called, it first checks for any callbacks present in successCallbackQueue; dequeuing and executing them if they exist. Then, as we know, it sets [[PromiseState]] to 'fulfilled' and [[PromiseValue]] to its argument
//On the other hand, reject() first checks for any callbacks present in failureCallbackQueue; dequeuing and executing them if they exist; and then sets [[PromiseState]] to 'rejected' and [[PromiseValue]] to its argument.
//E.g.
var promise = new Promise(function(resolve, reject) {
    resolve('Hello');
 });

 promise.then(function(value) {
    console.log(value);
 });

 console.log('Bye');