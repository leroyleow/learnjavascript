let x = 1;
if (x === 1) {
  let x = 2;
  console.log(x); //Expected output 2
}
console.log(x); //Expected output 1

//The scope of a variable declared with let is one of the following curly-brace-enclosed syntaxes that most closely contains the let declaration:
//E.g. Block statement, swtich statement, try...catch, one of the for statement

/* let vs var
 @ let declarations are scoped to blocks as well as functions.
 @ let declarations can only be accessed after the place of declaration is reached (see temporal dead zone). For this reason, let declarations are commonly regarded as non-hoisted.
 @ let declarations do not create properties on globalThis when declared at the top level of a script.
 @ let declarations cannot be redeclared by any other declaration in the same scope.
 @ let begins declarations, not statements. That means you cannot use a lone let declaration as the body of a block (which makes sense, since there's no way to access the variable).
*/
// Temporal dead zone(TDZ)
//TDZ starts at beginning of scope. The term "temporal" is used because the zone depends on the order of execution (time) rather than the order in which the code is written (position).
console.log(bar); //"undefinded"
console.log(foo); //"ReferenceError: Cannot access 'foo' before init"
var bar = 1;
let foo = 2; //End of TDZ for foo

{
  // TDZ starts at beginning of scope
  const func = () => console.log(letVar); // OK

  // Within the TDZ letVar access throws `ReferenceError`

  let letVar = 3; // End of TDZ (for letVar)
  func(); // Called outside TDZ!
}

{
  typeof i; // ReferenceError: Cannot access 'i' before initialization
  let i = 10;
}

{
  let foo;
  let foo; // SyntaxError: Identifier 'foo' has already been declared
}

function varTest() {
  var x = 1;
  {
    var x = 2; // same variable!
    console.log(x); // 2
  }
  console.log(x); // 2
}

function letTest() {
  let x = 1;
  {
    let x = 2; // different variable
    console.log(x); // 2
  }
  console.log(x); // 1
}
