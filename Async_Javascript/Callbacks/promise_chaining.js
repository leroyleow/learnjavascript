//Chaining refers to the notion of subsequently calling then() on the promise returned by then().
//When we invoke then() on a promise p, with a given argument callback, a new promise is created and returned that only settles when the callback is fired (and this happens only once the main promise p settles).
//'doSomeAsyncTask(), then do this with the result; and once this is done; then further do this'.


//<<Returned promise's settlement>>
//There are basically three possible outcomes of firing the callback passed to then():
// * Returning a non-promise value
// * Throwing an exception
// * Returning a promise

// 1. A non-promise value
//If the callback returns a non-promise value - for example a number, a string, an array etc. - the returned promise is fulfilled with that value.
var p = new Promise(function(resolve, reject) {
    resolve("Data1");
});

var p2 = p.then(function(data) {
    // callback returns a non-promise value
    // in this case a string
    return "Data2";
});

console.log(p2); //Promise {<resolved>: "Data2"}

//E.g.
var p = new Promise(function(resolve, reject) {
    reject("Sorry");
});

var p2 = p.then(null, function(data) {
    // callback returns a non-promise value
    // in this case a string
    return "OK";
});

console.log(p2); //Promise {<resolved>: "OK"}

//2. Throwing an exception
// If the callback throws an exception - for example throw new Error("Sorry") - the returned promise is rejected with that value (or better to say, with that reason).
var p = new Promise(function(resolve, reject) {
    resolve("OK");
});

var p2 = p.then(function(data) {
    // callback throws an error
    throw "Sorry";
});

console.log(p2); //Promise {<rejected>: "Sorry"}

var p = new Promise(function(resolve, reject) {
    reject("Sorry");
});

var p2 = p.then(null, function(data) {
    // callback throws an error
    throw "Sorry again";
});

console.log(p2); // Promise {<rejected>: Sorry}

//3. A Promise Value
//In other words - if the returned promise fulfills, the derived promise fulfills too; if it's rejected, the derived promise is rejected too; and if it's pending, the derived promise is also put in the pending state.
var p = new Promise(function(resolve, reject) {
    resolve("OK");
});

var p2 = p.then(function(data) {
    // callback returns a promise
    return new Promise(function(resolve, reject) {
        resolve(data + " Bye");
    });
});

console.log(p2);

//Practical Example
var request1 = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "names.txt", true);
    xhr.onload = function(e) {
        if (this.status === 200) { resolve(this); }
    }
    xhr.send();
});

var request2 = request1.then(function(data) {
    // extract the filename from names.txt
    var filename = data.responseText.split("\n")[1];

    // second async operation
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", filename, true);
        xhr.onload = function(e) {
            if (this.status === 200) { resolve(this); }
        }
        xhr.send();
    });
});

request2.then(function(data) {
    alert(data.responseText);
});