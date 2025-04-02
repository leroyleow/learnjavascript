/*
To determine which object this refers to; use the following precedence of order
Precedence Object
1. bind()
2. apply() and call()
3. Object methods
4. Global scope
*/
//https://claude.ai/chat/914769d6-a127-47f3-b821-909b5e6cfc9f
// Let's create a practical example with a shopping cart

// ShoppingCart constructor function
function ShoppingCart(customerName) {
    this.customerName = customerName;
    this.items = [];
    this.total = 0;
  }

  // Add methods to the prototype
  ShoppingCart.prototype.addItem = function(name, price, quantity = 1) {
    console.log(`Adding ${quantity} ${name}(s) to ${this.customerName}'s cart`);
    this.items.push({ name, price, quantity });
    this.calculateTotal();
    return this; // for method chaining
  };

  ShoppingCart.prototype.removeItem = function(name) {
    const index = this.items.findIndex(item => item.name === name);
    if (index !== -1) {
      console.log(`Removing ${this.items[index].name} from ${this.customerName}'s cart`);
      this.items.splice(index, 1);
      this.calculateTotal();
    }
    return this;
  };

  ShoppingCart.prototype.calculateTotal = function() {
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return this.total;
  };

  ShoppingCart.prototype.checkout = function() {
    console.log(`\n----- ${this.customerName}'s Receipt -----`);
    console.log(`Items:`);
    this.items.forEach(item => {
      console.log(`  ${item.name} x ${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`);
    });
    console.log(`Total: $${this.total.toFixed(2)}`);
    console.log(`Thank you for shopping with us, ${this.customerName}!`);
    console.log(`--------------------------------\n`);
  };

  // Create a cart for Alice
  const aliceCart = new ShoppingCart("Alice");
  aliceCart.addItem("Laptop", 1299.99);
  aliceCart.addItem("Mouse", 29.99);
  aliceCart.addItem("Keyboard", 89.99);

  // Create a cart for Bob
  const bobCart = new ShoppingCart("Bob");
  bobCart.addItem("Headphones", 199.99);
  bobCart.addItem("Phone Case", 19.99, 2);

  // Problem: When we pass a method as a callback, we lose the 'this' context
  const checkoutButton = {
    carts: [aliceCart, bobCart],

    // This function will have the wrong 'this' context when called as a callback
    processCheckout: function() {
      console.log("Processing checkout...");

      // The 'this' below will refer to whatever calls the function, not to checkoutButton
      this.carts.forEach(cart => cart.checkout());
    }
  };

  // Example 1: Losing 'this' context
  console.log("EXAMPLE 1 - Losing context:");
  try {
    // Simulate a button click handler receiving just the function
    const processCheckoutFunction = checkoutButton.processCheckout;

    // This fails because 'this' is now the global object (or undefined in strict mode)
    // and does not have a 'carts' property
    processCheckoutFunction();
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  // Example 2: Solution using bind()
  console.log("\nEXAMPLE 2 - Using bind():");
  // Create a new function with 'this' bound to checkoutButton
  const boundProcessCheckout = checkoutButton.processCheckout.bind(checkoutButton);

  // Now it works correctly regardless of how it's called
  boundProcessCheckout();

  // Example 3: Practical use case in event handlers (simulated)
  console.log("\nEXAMPLE 3 - Event handler simulation:");
  function simulateEventHandler(callback) {
    console.log("Button clicked, executing callback...");
    // In real DOM events, 'this' would be the DOM element
    callback();
  }

  // Without bind, this would fail
  simulateEventHandler(checkoutButton.processCheckout.bind(checkoutButton));

  // Example 4: Partial application with bind
  console.log("\nEXAMPLE 4 - Partial application:");
  function applyDiscount(discountPercent, itemName) {
    const index = this.items.findIndex(item => item.name === itemName);
    if (index !== -1) {
      const originalPrice = this.items[index].price;
      const discountedPrice = originalPrice * (1 - discountPercent/100);
      this.items[index].price = discountedPrice;
      console.log(`Applied ${discountPercent}% discount to ${itemName} for ${this.customerName}`);
      console.log(`  Original price: $${originalPrice.toFixed(2)}`);
      console.log(`  New price: $${discountedPrice.toFixed(2)}`);
      this.calculateTotal();
    }
  }

  // Create a 20% discount function bound to aliceCart
  const apply20PercentDiscount = applyDiscount.bind(aliceCart, 20);

  // Now we can apply a 20% discount to any item in Alice's cart
  apply20PercentDiscount("Laptop");
  apply20PercentDiscount("Keyboard");

  // Final checkout for both carts
  console.log("\nFinal Checkouts:");
  aliceCart.checkout();
  bobCart.checkout();

//Another this in event handler
//https://claude.ai/chat/914769d6-a127-47f3-b821-909b5e6cfc9f
// Let's create a simple task manager application
// This example demonstrates common issues with 'this' in event handlers

document.addEventListener('DOMContentLoaded', function() {
    class TaskManager {
      constructor(containerId) {
        this.containerId = containerId;
        this.tasks = [];
        this.nextId = 1;

        // Get DOM elements
        this.container = document.getElementById(containerId);
        this.taskInput = document.getElementById('taskInput');
        this.addButton = document.getElementById('addButton');
        this.taskList = document.getElementById('taskList');
        this.clearButton = document.getElementById('clearButton');
        this.countDisplay = document.getElementById('count');

        // Initialize
        this.setupEventListeners();
        this.updateTaskCount();
      }

      setupEventListeners() {
        // PROBLEM 1: 'this' in event handlers
        // This will NOT work correctly because 'this' will refer to the button element, not the class instance
        // this.addButton.addEventListener('click', this.addTask);

        // SOLUTION 1: Using bind() to fix 'this'
        this.addButton.addEventListener('click', this.addTask.bind(this));

        // SOLUTION 2: Arrow function preserves lexical 'this'
        // Arrow functions don't have their own 'this' context, so they use the encolosing scope's 'this' value
        //https://stackoverflow.com/questions/66518020/javascript-this-keyword-and-arrow-function
        this.clearButton.addEventListener('click', () => {
          this.clearAllTasks();
        });

        // Handle Enter key in the input field
        this.taskInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.addTask();
          }
        });
      }

      addTask() {
        const text = this.taskInput.value.trim();
        if (text) {
          const task = {
            id: this.nextId++,
            text: text,
            completed: false,
            createdAt: new Date()
          };

          this.tasks.push(task);
          this.renderTask(task);
          this.taskInput.value = '';
          this.updateTaskCount();
        }
      }

      renderTask(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.className = 'task-item';

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.className = 'task-checkbox';

        // PROBLEM 2: Event handler on dynamically created element
        // This won't work correctly - 'this' will refer to the checkbox
        // checkbox.addEventListener('change', this.toggleTaskStatus);

        // SOLUTION: Use bind to fix 'this'
        checkbox.addEventListener('change', this.toggleTaskStatus.bind(this, task.id));

        // Create task text
        const span = document.createElement('span');
        span.textContent = task.text;
        span.className = task.completed ? 'completed' : '';

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-btn';

        // SOLUTION: Alternative approach using data attributes and event delegation
        deleteBtn.dataset.id = task.id;

        // Add elements to list item
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        // Add list item to list
        this.taskList.appendChild(li);
      }

      toggleTaskStatus(taskId, event) {
        // The 'this' here is bound to the TaskManager instance
        // taskId is the pre-bound parameter
        // event is the event object passed by the event listener

        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
          task.completed = event.target.checked;

          // Update the UI
          const li = this.taskList.querySelector(`li[data-id="${taskId}"]`);
          const span = li.querySelector('span');
          span.className = task.completed ? 'completed' : '';

          this.updateTaskCount();
        }
      }

      // Using event delegation for delete buttons
      handleDeleteClick(event) {
        // Check if the clicked element is a delete button
        if (event.target.classList.contains('delete-btn')) {
          const taskId = parseInt(event.target.dataset.id);
          this.deleteTask(taskId);
        }
      }

      deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);

        // Remove from DOM
        const li = this.taskList.querySelector(`li[data-id="${taskId}"]`);
        if (li) {
          this.taskList.removeChild(li);
        }

        this.updateTaskCount();
      }

      clearAllTasks() {
        this.tasks = [];
        this.taskList.innerHTML = '';
        this.updateTaskCount();
      }

      updateTaskCount() {
        const completed = this.tasks.filter(task => task.completed).length;
        const total = this.tasks.length;
        this.countDisplay.textContent = `${completed}/${total} completed`;
      }
    }

    // Setup event delegation for delete buttons at the container level
    document.getElementById('app').addEventListener('click', function(event) {
      if (event.target.classList.contains('delete-btn')) {
        const taskId = parseInt(event.target.dataset.id);
        taskManager.deleteTask(taskId);
      }
    });

    // Initialize the task manager
    const taskManager = new TaskManager('app');

    // DEMONSTRATION: Different approaches to logging
    const logButton = document.getElementById('logButton');

    // 1. Regular function - 'this' will be the button
    logButton.addEventListener('click', function() {
      console.log("Regular function 'this':", this); // 'this' is the button
      console.log("Tasks:", taskManager.tasks); // Have to reference taskManager explicitly
    });

    // 2. Arrow function - 'this' is from surrounding scope
    logButton.addEventListener('click', () => {
      console.log("Arrow function 'this':", this); // 'this' is from lexical scope (likely window or the global scope)
      console.log("Tasks:", taskManager.tasks);
    });

    // 3. Bound function - 'this' is explicitly bound
    const logTasks = function() {
      console.log("Bound function 'this':", this);
      console.log("My tasks:", this.tasks); // Can use 'this' to reference tasks
    };

    logButton.addEventListener('click', logTasks.bind(taskManager));
  });

  // HTML structure this code expects:
  /*
  <div id="app">
    <h1>Task Manager</h1>
    <div class="input-container">
      <input type="text" id="taskInput" placeholder="Add a new task...">
      <button id="addButton">Add</button>
    </div>
    <ul id="taskList"></ul>
    <div class="controls">
      <span id="count">0/0 completed</span>
      <button id="clearButton">Clear All</button>
      <button id="logButton">Log Tasks</button>
    </div>
  </div>

  <style>
    .completed { text-decoration: line-through; color: #888; }
    .task-item { margin: 8px 0; display: flex; align-items: center; }
    .task-checkbox { margin-right: 8px; }
    .delete-btn { margin-left: auto; border: none; background: none; color: red; cursor: pointer; }
  </style>
  */