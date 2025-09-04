/*
  Exercise 3
  DOM manipulation with vanilla JS
*/

// Task
// What does DOM stand for?
// The DOM is the document object model, which is how the browser interprets the HTML. Works as a tree?


// Task
// Open the file index.html in your browser. Open the index.html file in VS Code, right-click the tab and select "Open in Browser"
// If you are working locally, navigate to the excercise directory and start a python http server `python3 -m http.server 900`, press Control-c to stop the server 

// Task
// Delete the div with the class rectangle from index.html and refresh the preview.

//remove the div with class rectangle removes the rectangle that is included by default when the page loads.
//removing this div does not break the functionality of the add element button


// Task
// What does the following code do?
const viz = document.body.querySelector(".viz"); // .querySelector selects an element with the class "viz"
const button = document.body.querySelector("#button"); //.querySelector selects an with the ID button
// above are constants so will not be re-defined or written over

console.log(viz, viz.children); // logs to console what has been selected

const addChildToViz = () => {
  const newChild = document.createElement("div");
  newChild.className = "rectangle";
  newChild.style.height = Math.random() * 100 + "px"; //31-33: create a new div with class rectangle and height
  viz.appendChild(newChild); // append new div to div with class viz selected above
};

// Task
// Modify index.html to make this event listener work
button.addEventListener("click", addChildToViz);
//this works by default?


// Task
// Where can you see the results of the console.log below? How is it different from in previous exercises?

function drawIrisData() {
  window
    .fetch("./iris_json.json")
    .then(data => data.json())
    .then(data => {
      console.log(data);
    });
}

drawIrisData();

// Task
// Modify the code above to visualize the Iris dataset in the preview of index.html.
// Feel free to add additional CSS properties in index.html, or using JavaScript, as you see fit.
