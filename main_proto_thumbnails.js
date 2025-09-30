//Generate barchart from sitter_counts data
// adapted from the lab example


//filtering:
  //filtering on the fly 
  //

let portraits;
let grouped;
const minCount = 4;

const tooltip = d3.select("#tooltip"); //make sure tooltip is selected
chosen_decade = 1790; // set decade for filtering

//Load data
d3.csv('check_dates.csv').then( data => {
    portraits = data
        .filter(d => !d.Sitter.includes("Unidentified"))
        .filter(d => !d.Sitter.includes("unidentified"))
        .filter(d => !d.Sitter.includes("Multiple Portraits"))
        //.filter(d => d.Clean_Date >= 1770 && d.Clean_Date <= 1790); old filter for testing
    // const date_filted = portraits.filter(d=>{
    //   const year = +d.Clean_Date;
    //   return year >= chosen_decade && year < chosen_decade + 10;
    // })
    // have not made this function yet. When I do, change portraits to date_filtered
    grouped = d3.group(portraits, d => d.Sitter);
    grouped = new Map(Array.from(grouped).filter(([sitter, arr]) => arr.length >= minCount).sort((a, b) => b[1].length - a[1].length));
    console.log(grouped)
    d3.select('#viz').selectAll('*').remove(); // Clear previous chart
    displayData();


    function click_text(event, d){ //takes an event and data (we have piped in the array so data is hanlded)
      const sitterName = d[0]; // take first element from d, i.e. sitter
      displayThumbnails(sitterName, portraits);
      console.log(sitterName)
    }
    // add click to bar
    d3.selectAll('rect').on("click", click_text);


})

function displayData(){
  // define dimensions and margins for the graphic
  const margin = ({top: 100, right: 50, bottom: 100, left: 80}); // this is unused?
  const width = window.innerWidth - 100;
  const height = 400;
  
  const container = d3.select('#viz')
    .attr('width', width)
    .attr('height', height)

  const sitters = Array.from(grouped.keys());
  const maxCount = d3.max(grouped, ([,arr]) => arr.length);

  //Scales
  const xScale = d3.scaleBand()
    .domain(sitters) // look at all sitters
    .range([margin.left, width - margin.right]) //display across the page
    .padding(0.1); // add padding

  const yScale = d3.scaleLinear()
    .domain([0, maxCount]) // from 0 to max count of portraits
    .range([height - margin.bottom, margin.top]); // from bottom to top of page
  
  const sequentialScale = d3.scaleSequential()
    .domain([0, d3.max(Array.from(grouped.values()), arr => arr.length)])
    .interpolator(d3.interpolateRgb("red", "blue"));

  // attach a graphic element, and append rectangles to it
  container.append('g')
    .selectAll('rect')
    .data(Array.from(grouped.entries()))
    .join('rect')
    .attr('x', ([sitter, arr]) => xScale(sitter))
    .attr('y', ([, arr]) => yScale(arr.length))
    .attr('height', ([, arr]) => yScale(0) - yScale(arr.length))
    .attr('width', xScale.bandwidth() - 2)
    .style('fill', ([, arr]) => sequentialScale(arr.length)); // use scale to generate color
 
  // Axes
  // Y Axis
  const yAxis =  d3.axisLeft(yScale).ticks(5)

  container.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxis);

  // X Axis
  const xAxis =  d3.axisBottom(xScale).tickSize(0);

  // add x axis and rotate text (from lab example)
  container.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll('text')	
    .style('text-anchor', 'end')
    .attr('dx', '-.6em')
    .attr('dy', '-0.1em')
    .attr('transform', d => {return 'rotate(-45)' });

  // Labelling the graph
  container.append('text')
    .attr('font-family', 'sans-serif')
    .attr('font-weight', 'bold')
    .attr('font-size', 20)
    .attr('y', margin.top-20)
    .attr('x', margin.left)
    .attr('fill', 'black')
    .attr('text-anchor', 'start')
    .text(`Portraits of the Revolutionary Era, from 1780 to 1810`);

  //y-axis label
  container.append("text")
    .attr("transform", "rotate(-90)")
    .attr("font-family", "sans-serif")
    .attr("font-size", 15)
    .attr("y", 30)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Portraits");
  
};




function displayThumbnails(sitterName, data){
  // right now I want to display all the thumbnails for a given sitter. Will keep sitter fixed for now


  //reset scroll position
  document.getElementById('thumbnail_gallery_container').scrollLeft = 0;
  
  // filter data according to sitter, and trim thumbnails that are missing
  const portraits = data.filter(d => 
    d.Sitter === sitterName && 
    d.thumbnail &&   // thumbail exists
    d.thumbnail.trim() !== "");


  // set up dimensions first.

  const thumb_width = (200);
  const thumb_height = 190;
  console.log(thumb_width)
  console.log(thumb_height)

  const number_columns = portraits.length
  const svg_width = number_columns * thumb_width; // width of SVG is changed to reflect number of thumbnails
  const width = Math.max(window.innerWidth - 100, svg_width);

  const height = 400
  const margin = ({top: 20, right: 20, bottom: 20, left: 20});

  const container = d3.select('#thumbnail_gallery')
    .html("") // clear previous
    .attr('width', svg_width)
    .attr('height', thumb_height)
  

  // Gallery is a grid of thumbnails of fixed width and height
  // number of colums should be responsive to the width of the window
  




  //add thumbnails to container
  // x and y position are based on the index of each thumbail
  // width and height should be fixed to display evenly across the container
  const thumb_group = container.append('g')
    .selectAll('g')
    .data(portraits)
    .join('g')
    .attr("transform", (_, i) => {
      const x = i * (thumb_width- 40);
      const y = 0;
      return `translate(${x},${y})`;
    });


    function tooltip_mouseover(event, d){
      const title = d.title ? d.title : "Untitled";
      const artist = d.Artist ? d.Artist : "Unknown";
      const year = d.Clean_Date ? d.Clean_Date : "Unknown Date";
      tooltip
        .html(`Title: ${title}<br/>Artist: ${artist}<br/>Year: ${year}`)
        .style("opacity", 1)
        .style("left", (event.pageX + 10) + "px") // position tooltip near mouse
        .style("top", (event.pageY - 28) + "px");
    }

    thumb_group.append("image")
      .attr("width", 200)
      .attr("height", thumb_height)
      .attr("href", d => d.thumbnail) // link to the thumbnail image
      .attr("alt", d => d.Sitter) // alt text
      .attr("class", "thumbnail-image")
      .on("mouseover", function(event, d) { tooltip_mouseover(event, d); })
      .on("mousemove", function(event, d) { tooltip_mouseover(event, d); }) // update position as mouse moves
      .on("mouseout", function() {tooltip.style("opacity", 0)})
      //add functionality for enlarging image on click
      .on("click", function(event,d){
        console.log(d.thumbnail);
        d3.select("#enlarge_thumbnail").attr("src", d.thumbnail); // select source from thumbail
        
        const title = d.title ? d.title : "Untitled";
        const artist = d.Artist ? d.Artist : "Unknown";
        const year = d.Clean_Date ? d.Clean_Date : "Unknown";
        const link = d.collectionsURL ? `<a href="${d.collectionsURL}" target="_blank" style="color:##1f60e2ff;">Link to Collection</a>` : "";
        const collection = d.unitCode

        d3.select("#enlarge_info").html(
          `<strong>${title}</strong> <br>
          Artist: ${artist}<br>
          Year: ${year}<br>
          Collection: ${d.unitCode}<br>
          ${link}`
        );
        d3.select("#enlarge_modal").style("display", "flex"); // make modal visible
      })


    d3.select("#enlarge_modal").on("click", function() {
      d3.select(this).style("display", "none");
    });
    d3.select("#enlarge_thumbnail").on("click", function(event) {
      event.stopPropagation();
    });

    // add sitter name as title to the gallery
    d3.select('#thumbnail_gallery_container')
      .selectAll('h3')
      .data([sitterName]) // bind single data point
      .join('h3')
      .text(d => d) // set text to sitter name
      .style('text-align', 'center')
      .attr('x', (width / 2))
      .attr('y', margin.top);
  
}



