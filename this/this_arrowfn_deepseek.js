//https://chat.deepseek.com/a/chat/s/0f5f9e9a-dd75-416d-ab79-58667ccaa39f
// In obj method, this refers to the object
// alone this referes to global object
// In a function, this refers to the global object
// In a function strict mode, this is undefined
// In an event, this refers to the element receive event
// Methods like call(), apply() and bind() can refer this to any object
// However, arrow functions do not have their own this binding. Therefore, their this value cannot be set by bind(), apply() or call() methods, nor does it point to the current object in object methods.
var greeting = 'hi';

const obj = {
  greeting: 'hey',

  fo() {
    const greeting = 'hola';

      const arrowFo = () => {
        console.log(this.greeting);
      };

      arrowFo();
  },
};

obj.fo(); //logs: hey

///
var greeting = 'hi';

const obj2 = {
  greeting: 'hey',

  fo() {
    const greeting = 'hola';

    const fo2 = function () {
      const greeting = 'hello';

      const arrowFo = () => {
        console.log(this.greeting);
      };

      arrowFo();
    };
    fo2();
  },
};

obj2.fo(); //logs: hi