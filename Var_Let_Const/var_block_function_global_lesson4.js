//Local Scope
{
  let x = 2;
}
// x can NOT be used here

{
  var y = 2;
}
// x CAN be used here

// code here can NOT use carName

function myFunction() {
  let carName = "Volvo";
  // code here CAN use carName
}

// code here can NOT use carName

//automatically Global
myFunction();

// code here can use carName

function myFunction() {
  carName = "Volvo";
}
