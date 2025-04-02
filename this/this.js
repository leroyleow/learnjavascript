/*
In an object method, this refers to the object.
Alone, this refers to the global object.
In a function, this refers to the global object.
In a function, in strict mode, this is undefined.
In an event, this refers to the element that received the event.
Methods like call(), apply(), and bind() can refer this to any object
https://www.w3schools.com/js/js_this.asp
*/
//"this" in method
let user = {
    name: "John",
    age: 30,

    sayHi() {
      alert( user.name ); // leads to an error
    }

  };


  let admin = user;
  user = null; // overwrite to make things obvious

  admin.sayHi(); // TypeError: Cannot read property 'name' of null

//if we used this.name instead of user.name inside alert, it will work.
let user2 = {
    name: "John",
    age: 30,
    sayHi() {
      alert( this.name ); // John
    }
};

let user3 = { name: "John"};
let admin3 = { name: "Admin" };

function sayHi() {
    alert( this.name );
  }

  // use the same function in two objects
  user.f = sayHi;
  admin.f = sayHi;

  // these calls have different this
  // "this" inside the function is the object "before the dot"
  user.f(); // John  (this == user)
  admin.f(); // Admin  (this == admin)

  admin['f'](); // Admin (dot or square brackets access the method – doesn't matter)

//Arrow function have no "this". If we reference this from such a function, it’s taken from the outer “normal” function.
//For instance, here arrow() uses this from the outer user.sayHi() method:
let user = {
    firstName: "Ilya",
    sayHi() {
      let arrow = () => alert(this.firstName);
      arrow();
    }
  };

  user.sayHi(); // Ilya

