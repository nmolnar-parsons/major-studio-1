//Generate barchart from sitter_counts data
// adapted from the lab example


let portraits;

//Load data
d3.json('sitter_count_test.json').then( data => {
    portraits = data
        .filter(d => d.Count > 2)
        .filter(d => !d.Sitter.includes("Unidentified"))
        .filter(d => !d.Sitter.includes("unidentified"))
        .filter(d => !d.Sitter.includes("Multiple Portraits"));
    displayData();
})

function displayData(){
  // define dimensions and margins for the graphic
  const margin = ({top: 100, right: 50, bottom: 100, left: 80});
  const width = 1400;
  const height = 700;

  // let's define our scales. 
  // yScale corresponds with amount of textiles per country
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(portraits, d => d.Count)+1])
    .range([height - margin.bottom, margin.top]); 

  // xScale corresponds with country names
  const xScale = d3.scaleBand()
    .domain(portraits.map(d => d.Sitter))
    .range([margin.left, width - margin.right]);

  // interpolate colors
  const sequentialScale = d3.scaleSequential()
    .domain([0, d3.max(portraits, d => d.Count)])
    .interpolator(d3.interpolateRgb("red", "blue"));

  // create an svg container from scratch
  const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // attach a graphic element, and append rectangles to it
  svg.append('g')
    .selectAll('rect')
    .data(portraits)
    .join('rect')
    .attr('x', d => {return xScale(d.Sitter) })
    .attr('y', d => {return yScale(d.Count) })
    .attr('height', d => {return yScale(0)-yScale(d.Count) })
    .attr('width', d => {return xScale.bandwidth() - 2 })
    .style('fill', d => {return sequentialScale(d.Count);});
 

  // Axes
  // Y Axis
  const yAxis =  d3.axisLeft(yScale).ticks(5)

  svg.append('g')
  .attr('transform', `translate(${margin.left},0)`)
  .call(yAxis);

  // X Axis
  const xAxis =  d3.axisBottom(xScale).tickSize(0);

  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll('text')	
    .style('text-anchor', 'end')
    .attr('dx', '-.6em')
    .attr('dy', '-0.1em')
    .attr('transform', d => {return 'rotate(-45)' });

  // Labelling the graph
  svg.append('text')
    .attr('font-family', 'sans-serif')
    .attr('font-weight', 'bold')
    .attr('font-size', 20)
    .attr('y', margin.top-20)
    .attr('x', margin.left)
    .attr('fill', 'black')
    .attr('text-anchor', 'start')
    .text('Number of Portraits by Sitter')
}