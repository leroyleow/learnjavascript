function foo() {
  var x = 1;

  function bar() {
    var y = 2;
    console.log(x); //1 funtion bar close over x
    console.log(y); //2 y is in scope
  }

  bar();
  console.log(x); //1 x is in scope
  console.log(y); //'Reference error' y is not scope
}

foo();

//block statements -> try...catch, switch, do not create scope for var
for (var a of [1, 2, 3]);
console.log(a);

//Redeclaration - Duplicate variable declaration using var will not trigger an error, even in strict mode
var a = 1;
a = 2;
console.log(a);
var a;
console.log(a); //2, not undefined

//var declarations cannot be in the same scope as a let, const, class, or import declaration.
var c = 1;
let c = 2; //Syntax Error : Identifier 'c' has already declared

let d = 1;
{
  var d = 1; //Syntax Error: Identifier 'd' has already declared
}
