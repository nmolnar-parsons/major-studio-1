d3.json('./data.json')
  .then(json => {
    // execute the display images function
    displayImages(json);
  });

// function to create all DOM elements
function displayImages(json) {
  // select a <div> with an id of "app"; this is where all images will be added
  let app = d3.select('#app');

  // sort the JSON data; date descending
  let data = json.sort((a, b) => (b.date > a.date) ? 1 : -1);
  // date ascending
  // let data = json.sort((a, b) => (a.date > b.date) ? 1 : -1);

  // define "cards" for each item
  let card = app.selectAll('div.card')
    .data(data)
    .join('div')
    .attr('class', 'card');

  // create a div with a class of "image" and populate it with an <img/> tag that contains the filepath
  card.append('div')
    .attr('class', 'image')
    .append('img')
    .attr('src', d => {
      // all images are in the "images" folder which needs to be added to the filename
      return './images/' + d.filename;
    });

  // create a paragraph that will hold the object date
  card.append('p')
    .attr('class', 'object-date')
    .text(d => d.date);

  // create a heading tag that will be the object title
  card.append('h2')
    .attr('class', 'title')
    .text(d => d.title);







  // click on a portrait
  // call vibrant function which gets palette from that portrait
  // set the background color of the body to the first color in the palette


  //function that clicks on an image and gets the source
  // this is slightly functional, but not all images clicked work?
  // I think this is due to how Vibrant looks for color in the image
  d3.selectAll("img").on("click", function(event, d) {
  let imgSrc = d3.select(this).attr("src");
  console.log(imgSrc);

  Vibrant.from(imgSrc).getPalette(function(err, palette) {
    console.log(palette); 
    colors =[]
    for (let swatch in palette) {
      console.log(swatch, palette[swatch].getHex());
      colors.push(palette[swatch].getHex());
      const div = document.createElement("div");
      div.className = 'swatch';
      div.style.backgroundColor = palette[swatch].getHex();
      let element = document.getElementById("palette_container");
      element.appendChild(div);

    }
    //console.log(colors);
    document.body.style.backgroundColor = colors[0];
  });
});
}

// Code from Vibrant example:
// Vibrant.from('images/FS-5461_07.jpg').getPalette(function(err, palette) {
//   colors =[]
//   for (let swatch in palette) {
//     console.log(swatch, palette[swatch].getHex());
//     colors.push(palette[swatch].getHex());
//     const div = document.createElement("div");
//     div.className = 'swatch';
//     div.style.backgroundColor = palette[swatch].getHex();
//   }
//   console.log(colors);
//   document.body.style.backgroundColor = colors[0];
// });


