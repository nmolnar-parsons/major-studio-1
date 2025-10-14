
//Load data

d3.csv("Data/unprocessed_nodrawing.csv").then(data => {
    console.log(data);

    //Create thumbnail gallery

    const gallery = d3.select("#thumbnail_gallery");

    const thumbnails = gallery.selectAll("img")
        .data(data)
        .enter()
        .append("img")
        .attr("src", d => d.thumbnail) // Assuming the CSV has a column 'thumbnail_url'
        .attr("alt", d => d.title) // Assuming the CSV has a column 'title'
        .attr("width", 150) // Set thumbnail width
        .attr("height", 150) // Set thumbnail height
        .style("margin", "10px")
        .style("cursor", "pointer")
        .on("click", (event, d) => {
            window.open(d.collectionsURL, "_blank"); // Assuming the CSV has a column 'full_image_url'
        });





});
