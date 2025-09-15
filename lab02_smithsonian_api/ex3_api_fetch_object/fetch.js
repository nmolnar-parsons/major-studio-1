// Smithsonian API example code
// check full API documentation here: https://edan.si.edu/openaccess/apidocs/


// put your API key here;
const apiKey = "";  

// Access to individual objects by ID
const objectBaseURL = "https://api.si.edu/openaccess/api/v1.0/content/";

//fetches content based on id of an object.
function fetchContentDataById(id) {
  let url = objectBaseURL + id + "?api_key="+apiKey;
  return window //add a return to get data out
  .fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("Here's the content data of the specified object:", data.response);
    return data;
  })
  .catch(error => {
    console.log(error);
  })
}

fetchContentDataById("ld1-1643399887910-1643399927269-1");


// Task 1: Find a different object on https://collections.si.edu/search/ and retrieve the data with the code above

//Airacomet
fetchContentDataById("edanmdm:nasm_A19450016000"); 


// Make sure to check the box "Only return results with CC0 media" when searching
// Task 2: Write the result into a variable and explore different variables through the Console


//with help from Theo 
function temp(id) {
  fetchContentDataById(id).then(data => {
    console.log("temp",data);
  });
}
temp("edanmdm:nasm_A19450016000");



// ASYNC V1: await
// ASYNC V2: .then()
// Theo helped me think through below: 

async function tempAwait() {
  let data = await fetchContentDataById("edanmdm:nasm_A19600335000") //await is neater than using a bunch of .then()
  // await requires using async function
  console.log(data);
  return data;
}

function tempThen() {
  return fetchContentDataById("edanmdm:nasm_A19600335000")
    .then(data => data);
}
let pageData;

tempAwait().then(data => {
  console.log("example variable:", data);
  pageData = data;
});

