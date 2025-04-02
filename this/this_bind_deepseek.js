https://chat.deepseek.com/a/chat/s/7e0ee362-0cb0-4961-bb0d-def8a37e793f
//Basic this Behaviour
const user = {
    name: 'Alice',
    greet: function() {
      console.log(`Hello, ${this.name}!`);
    }
  };

  user.greet(); // "Hello, Alice!" - `this` refers to the `user` object

  const greetFunc = user.greet;
  greetFunc(); // "Hello, undefined!" - `this` lost context

//Using bind() to Fix Context
const car = {
    brand: 'Tesla',
    getBrand: function() {
        return this.brand;
    }
};

const unboundGetBrand = car.getBrand; //link to getBrand function
console.log(unboundGetBrand());       // this refers to global object

const boundGetBrand = unboundGetBrand.bind(car); // bind this to car object
console.log(boundGetBrand()); // "Tesla"

//Practical UI Component Example
class Button {
    constructor(text) {
      this.text = text;
      this.element = document.createElement('button');
      this.element.textContent = text;

      // Without bind, this would be the DOM element in the handler
      this.element.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick() {
      console.log(`Button "${this.text}" was clicked`);
    }
  }

  const myButton = new Button('Click Me');
  document.body.appendChild(myButton.element);

//Partial Function Application with bind()
function multiply(a, b) {
    return a * b;
  }

  // Create a new function with the first argument preset to 2
  const double = multiply.bind(null, 2);
  console.log(double(5)); // 10
  console.log(double(10)); // 20

  // Another practical example - formatting dates
  function formatDate(date, format) {
    // Implementation would go here
    return `${date.toISOString()} formatted as ${format}`;
  }

  const formatAsUTC = formatDate.bind(null, new Date(), 'UTC');
  console.log(formatAsUTC()); // Uses the bound date and format

//Event Handler with Multiple Objects
function logConnection() {
    console.log(`${this.device} connected to ${this.network}`);
  }

  const homeNetwork = { network: 'Home WiFi' };
  const officeNetwork = { network: 'Office LAN' };

  const laptop = { device: 'Laptop' };
  const phone = { device: 'Smartphone' };

  // Create bound functions for different contexts
  const logHomeLaptop = logConnection.bind({ ...laptop, ...homeNetwork });
  const logOfficePhone = logConnection.bind({ ...phone, ...officeNetwork });

  logHomeLaptop(); // "Laptop connected to Home WiFi"
  logOfficePhone(); // "Smartphone connected to Office LAN"

//Advance Using bind() with setTimeout
class Countdown {
    constructor(start) {
      this.count = start;
    }

    start() {
      const timer = setInterval(function() {
        if (this.count > 0) {
          console.log(this.count--);
        } else {
          console.log('Liftoff!');
          clearInterval(timer);
        }
      }.bind(this), 1000); // Bind maintains the Countdown instance as `this`
    }
  }

  const countdown = new Countdown(5);
  countdown.start(); // Logs 5, 4, 3, 2, 1, Liftoff!

//Practical bind() in Function Programming
// Data processing pipeline where we want to maintain context
const dataProcessor = {
    factor: 10,
    process(items) {
      return items
        .filter(this.isValid.bind(this))
        .map(this.transform.bind(this));
    },
    isValid(item) {
      return item.value > this.factor;
    },
    transform(item) {
      return { ...item, value: item.value / this.factor };
    }
  };

  const data = [
    { id: 1, value: 5 },
    { id: 2, value: 15 },
    { id: 3, value: 25 }
  ];

  console.log(dataProcessor.process(data));
  // Output: [{ id: 2, value: 1.5 }, { id: 3, value: 2.5 }]