/*
  Exercise 2
  JavaScript quirks and tricks
*/

var schoolName = "Parsons";
var schoolYear = 1936;

// Task
// What is the value of test3?
var test1;
if (1 == true) {
  test1 = true;
} else {
  test1 = false;
}

var test2;
if (1 === true) {
  test2 = true;
} else {
  test2 = false;
}

var test3 = test1 === test2; 
// value of test 3 is false:
// test3 is set equal to the comparison of test 1 and test2 
// == is a type converting operator (loose equality) and will find a correct match between 1 and true. 
// === does not convert types (strict equality) and will not find a match between 1 and true.
// therefore test1 is true and test 2 is false. Strict comparison of these results in false, which means test3 is false.



// Task
// Change this code so test4 is false and test5 is true. Use console.log() to confirm your cod works.

var test4 = 0 === "";
var test5 = 1 == "1";

console.log("test4 is", test4, "and test 5 is", test5);

// Task
// What are the values of p, q, and r? Research what is going on here.
var w = 0.1;
var x = 0.2;
var y = 0.4;
var z = 0.5;
// all are typeof = number
// this is a floating point precision issue
// decimal fractions cannot be represneted exactly as binary fractions? Not sure why but this seems to be the case


var p = w + x; // expected 0.3, actual 0.30000000000000004

var q = z - x; // actually gives 0.3. Not sure why this one works when the others don't

var r = y - w; // same as p, expected 0.3, actual 0.30000000000000004
