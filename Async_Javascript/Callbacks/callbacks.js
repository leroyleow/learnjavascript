// A callback function is a function that passed into another function as an argument which then invoked inside the outer function
//JavaScript functions are executed in the sequence they are called. Not in the sequence they are defined
function myDisplayer(some){
    document.getElementById("demo").innerHTML = some;
}

function myCalculator(num1, num2, myCallback) {
    let sum = num1 + num2;
    myCallback(sum);
}

myCalculator(5, 10, myDisplayer);

//Example 2
//Create an Array
const myNumbers = [4, 1, -20, -7, 5, 9, -6];

//Call removeNeg with a callback function
const posNumber = removeNeg(myNumbers, (x) => x >= 0);

//Display Results
document.getElementById("demo").innerHTML = posNumber;

// Keep only positive numbers
function removeNeg(numbers, callback) {
    const myArray = [];
    for (const x of numbers){
        if (callback(x)){
            myArray.push(x);
        }
    }
}

//https://claude.ai/chat/d050fab5-23bc-4a67-b431-5643d856542a
//https://chat.deepseek.com/a/chat/s/975f1b5d-20c2-4488-8f2e-d674a9c72a5e


//Since Javascript was single threaded, time-consuming operations were carried out asynchronously, away from the main thread to prevent it from blocking
//Initially, the 2 customary approaches to working with asynchronouse operations were:
// 1. Event - actions occuring on a web page
// 2. Callbacks - functions stored somewhere, to be called back later on.
// E.g
function getRequest(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
       if (this.state === 4 && this.status === 200) {
          callback(this.responseText);
       }
    }
    xhr.open('GET', url, false);
    xhr.send();
 }
