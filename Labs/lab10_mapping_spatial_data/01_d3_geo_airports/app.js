// code from:
// https://observablehq.com/@d3/world-airports?collection=@d3/d3-geo

/*** global variable/s ***/
const width = 1000;

/*** helper function ***/
function height(projection, outline) {
  const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
  const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
  
  projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
  return dy;
}

/*** our draw function ***/
function drawMap(world, data) {
  const land = topojson.feature(world, world.objects.land); //unpack geojson data 
  const graticule = d3.geoGraticule10(); //creates grid line/arcs on map
  const outline = { type: "Sphere" };
  // projection options in d3 geo:
  // https://github.com/d3/d3-geo-projection
  const projection = d3.geoArmadillo();
  const path = d3.geoPath(projection);

  const svg = d3.select('body')
    .append("svg")
    .attr("viewBox", [0, 0, width, height(projection, outline)]);

  const defs = svg.append("defs");

  defs.append("path")
      .attr("id", "outline")
      .attr("d", path(outline));

  defs.append("clipPath")
    .attr("id", "clip")
    .append("use")
    .attr("xlink:href", new URL("#outline", location));

  const g = svg.append("g")
    .attr("clip-path", `url(${new URL("#clip", location)})`);

  g.append("use")
    .attr("xlink:href", new URL("#outline", location))
    .attr("fill", "#064273"); //"sea color"

  g.append("path")
    .attr("d", path(graticule))
    .attr("stroke", "#1983daff") //gridlines color
    .attr("fill", "none");

  g.append("path")
    .attr("d", path(land))
    .attr("fill", "#077c13ff"); //land color

  svg.append("use")
    .attr("xlink:href", new URL("#outline", location))
    .attr("stroke", "#000") //not sure what this is. maybe for tooltip
    .attr("fill", "none");

  svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("transform", d => `translate(${projection([d.longitude, d.latitude])})`) // translates lat long to projection position
    .attr("r", 3)
    .append("title")
    .text(d => d.name);
}

/*** load data ***/
async function loadData() {
  const world = await d3.json('data/land-50m.json');
  const airports = await d3.csv('data/airports.csv');

  drawMap(world, airports)
}

loadData();