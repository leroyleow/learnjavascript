//this in method
const user = {
  name: "Alice",
  greet: function () {
    console.log(`Hello, my name is ${this.name}`);
  },
};

user.greet(); // Output: "Hello, my name is Alice"

//this in event handler
const button = document.getElementById("myButton");
button.addEventListener("click", function () {
  console.log(this); // 'this' refers to the button element
  this.classList.toggle("active");
});

//this with call, apply and bind
function introduce(greeting) {
  console.log(`${greeting}, I am ${this.name}`);
}

const person1 = { name: "Bob" };
const person2 = { name: "Carol" };

introduce.call(person1, "Hello"); // Output: "Hello, I am Bob"
introduce.apply(person2, ["Hi"]); // Output: "Hi, I am Carol"

const bobIntroduce = introduce.bind(person1);
bobIntroduce("Hey"); // Output: "Hey, I am Bob"

//Problem with this in traditional functions
const team = {
  members: ["Jane", "Jim"],
  leader: "John",
  describeTeam: function () {
    console.log(`Team leader: ${this.leader}`);

    // Problem: 'this' changes context inside the callback
    this.members.forEach(function (member) {
      // 'this' is undefined or window here, not the team object
      console.log(`${member} reports to ${this.leader}`);
    });
  },
};

team.describeTeam();
// Output:
// "Team leader: John"
// "Jane reports to undefined"
// "Jim reports to undefined"

//Solve the above problem
const teamsln = {
  members: ["Jane", "Jim"],
  leader: "John",
  describeTeam: function () {
    console.log(`Team leader: ${this.leader}`);

    // Solution: Arrow function inherits 'this' from parent scope
    this.members.forEach((member) => {
      console.log(`${member} reports to ${this.leader}`);
    });
  },
};

teamsln.describeTeam();
// Output:
// "Team leader: John"
// "Jane reports to John"
// "Jim reports to John"
