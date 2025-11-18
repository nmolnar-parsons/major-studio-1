//   Register to get your Mapbox access token https://docs.mapbox.com/help/glossary/access-token/
//   Code from https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/ 

mapboxgl.accessToken = ''; // replace with your own access token

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-73.96638, 40.78014],
  zoom: 13 //better zoom than 1 to start with
});

/*** load data ***/
async function loadData() {
  const airports = await d3.csv('data/airports.csv');

  // add markers to map
  airports.forEach(function(d) {

  // create a HTML element for each feature
  var el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el)
    .setLngLat([d.longitude, d.latitude])
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + d.name + '</h3>'))
    .addTo(map);
  });
}

loadData();