//empty object
let empty = {}; //object literal sytax

let user = {
  // an object
  name: "John",
  age: 30,
  "like birds": true,
};

user.IsAdmin = true; //add new property

delete user.age; //delete property

console.log(user["like birds"]);

//more empty object
const person = {};

//Add Properties
person.firstName = "John";
person.lastName = "Doe";
person.age = 50;
person.eyeColor = "blue";

//computed property
let fruit = prompt("Which fruit to buy?", "apple");

let bag = {
  [fruit]: 5, //[] is for multi words
};

alert(bag[fruit]);

//for..in loop to walk over all key of an object
let user = {
  name: "John",
  age: 30,
  isAdmin: true,
  GetUserName: function (a) {
    return name;
  },
  GetUserAge() {
    return age;
  },
};

for (let key in user) {
  alert(key);
  alert(user[key]);
}

//using function way
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;

  //define using way 1
  function GetCarYear() {
    return this.year;
  }
}
//define using way 2
Car.prototype.GetCarMake = () => this.make;

Car.prototype.displayCar = function () {
  const result = `A Beautiful ${this.year} ${this.make} ${this.model}`;
  console.log(result);
};

const myCar = new Car("Eagle", "Talon TSi", 1993);

// Dot notation
myCar.make = "Ford";
myCar.model = "Mustang";
myCar.year = 1969;

// Bracket notation
myCar["make"] = "Ford";
myCar["model"] = "Mustang";
myCar["year"] = 1969;

function showProps(obj, objName) {
  let result = "";
  for (const i in obj) {
    // Object.hasOwn() is used to exclude properties from the object's
    // prototype chain and only show "own properties"
    if (Object.hasOwn(obj, i)) {
      result += `${objName}.${i} = ${obj[i]}\n`;
    }
  }
  console.log(result);
}
//Anoth way to list prop for the above
function showPropsv2(obj, objName) {
  let result = "";
  Object.keys(obj).forEach((i) => {
    result += `${objName}.${i} = ${obj[i]}\n`;
  });
  console.log(result);
}

showProps(myCar, "myCar"); //make, model, year, GetCarYear will show but not GetCarMake as GetCarMake is in the prototype chain

// In JavaScript, objects have a special hidden property [[Prototype]] (as named in the specification), that is either null or references another object. That object is called “a prototype”:
// The property [[Prototype]] is internal and hidden, but there are many ways to set it
// Method 1 use special name __proto__
let animal = {
  eats: true,
};
let rabbit = {
  __proto__: animal,
  legs: 4,
};
let frog = {
  jump: true,
};
frog.__proto__ = animal;
