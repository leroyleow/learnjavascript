//https://www.phind.com/search/cm8y8cwlx0001356m819svoom
//Function borrowing is a powerful JavaScript feature that allows you to temporarily use a method from one object on another object without creating copies or implementing inheritance
//This technique is particularly useful for code reuse and avoiding method duplication.
// Example 1: Basic function borrowing
const person = {
    name: 'John',
    age: 30,
    greet: function() {
        return `Hello, my name is ${this.name} and I'm ${this.age} years old.`;
    }
};

const student = {
    name: 'Alice',
    age: 20
};

console.log('=== Basic Function Borrowing ===');
console.log(person.greet.call(student));

// Example 2: Array-like object borrowing
function convertToArray() {
    console.log('=== Converting Arguments to Array ===');
    const argsArray = Array.prototype.slice.call(arguments); //In JavaScript, a function can work with arguments even if no parameters are explicity defined in it declaration. This is possible because of arguments object, a builtin feature in non-arrow function
    return argsArray;
}

const result = convertToArray(1, 2, 3, 4, 5);
console.log(result);

// Example 3: Binding functions
const wizard = {
    name: 'Lord Parser',
    weapon: 'Syntax Staff'
};

const knight = {
    name: 'Sir Coder',
    weapon: 'Code Blade',
    attack: function() {
        return `${this.name} attacks with ${this.weapon}!`;
    }
};

console.log('\n=== Function Binding ===');
// Immediate execution with call()
console.log(knight.attack.call(wizard));

// Create bound function
const wizardAttack = knight.attack.bind(wizard);
console.log(wizardAttack());

// Using apply() with multiple arguments
const archer = {
    name: 'Master Arrowfunc',
    weapon: 'Lambda Longbow',
    attackMultiple: function(enemy1, enemy2, enemy3) {
        return `${this.name} attacks ${enemy1}, ${enemy2}, and ${enemy3} with ${this.weapon}!`;
    }
};

const enemies = ['Troll', 'Orc', 'Goblin'];
console.log('\n=== Using apply() ===');
console.log(archer.attackMultiple.apply(wizard, enemies));

// When would i use function borrowing?
//https://stackoverflow.com/questions/69892281/when-would-i-use-function-borrowing
//E.g.
nodes = document.getElementsByClassName('nodes');
result = [].prototype.map.call(nodes, someFunction);