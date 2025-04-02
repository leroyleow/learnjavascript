//Stack - LIFO
//using array
const mystack = [];
mystack.push('a');
mystack.push('b');
console.log(mystack);
mystack.push('c');
console.log(mystack);
mystack.pop();
console.log(mystack);

// Maximally Efficient Stack: O(1) time for push/pop

//using linked list
class StackNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Stack {
    constructor() {
        this.top = null;
        this.size = 0;
    }

    push(data) {
        const newNode = new StackNode(data);
        if (!this.top) {
            this.top = newNode;
        } else {
            newNode.next = this.top; //LIFO
            this.top = newNode;
        }
        this.size++;
    }

    pop() {
        if(this.size == 0) {
            return null;
        }
        const poppedNode = this.top;
        this.top = this.top.next;
        this.size--;
        return poppedNode.data;
    }
    getTop() {
        return this.top.data;
    }
}

const myNewStack = new Stack();
myNewStack.push('a');
myNewStack.push('b');
myNewStack.push('c');
console.log(myNewStack.size);
console.log(myNewStack.top);
console.log(myNewStack.pop());
console.log(myNewStack.pop());
console.log(myNewStack.pop());
console.log(myNewStack.pop());
console.log(myNewStack.size);


//Queue : FIFO, tracking requests for a limited resource, graph algorithms
const queue = [];
queue.push('a');
queue.push('b');
queue.push('c');
console.log(queue);
queue.shift();
console.log(queue);

// Maximally Efficient Queue: O(1) time for enqueue/dequeue

class QueueNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }

    enqueue(data) {
        if(this.size == 0){
            this.front = this.rear = new QueueNode(data);
            this.size++;
        }
        else {
            this.rear.next = new QueueNode(data);
            this.rear = this.rear.next; //set rear to be the last node
            this.size++;
        }
    }
    // a -> b -> c
    // F         B
    // a -> b -> c -> d
    // F              B

    dequeue() {
        if(this.size == 0) {
            return null;
        }
        
        const dequeuedNode = this.front;

        if(this.size === 1) {
            this.rear = null;
        }

        this.front = this.front.next;
        this.size--;
        return dequeuedNode.data; dequeuedNode.data;
    }
}

const myQueue = new Queue();

myQueue.enqueue('a');
myQueue.enqueue('b');
myQueue.enqueue('c');
console.log(myQueue);
console.log(myQueue.dequeue());
console.log(myQueue.dequeue());
console.log(myQueue.dequeue());
console.log(myQueue);
