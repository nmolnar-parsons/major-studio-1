//import cleaned data 


d3.csv("Project_2/Data/cleaned.csv").then(data => {


    //filter for George Washington and between 1780 and 1810
    var gwData = data.filter(d => 
        d.Sitter === "George Washington" &&
        +d.Clean_Date >= 1780 &&
        d.thumbnail // this checks that thumbnail is not empty, null, or undefined
    );

    console.log(gwData);


    //Group images by year
    const yearGroups = {};
    gwData.forEach(d => {
        const year = +d.Clean_Date;
        if (!yearGroups[year]) yearGroups[year] = [];
        yearGroups[year].push(d);
    });
    gwData.forEach(d => {
        const year = +d.Clean_Date;
        d.stackIndex = yearGroups[year].indexOf(d);
    });

    //dimensions
    const margin = ({top: 100, right: 50, bottom: 100, left: 100});
    const width = 1400;
    const height = 800;


    //x-axis for years
    const x_scale = d3.scaleLinear()
        .domain([1780,1810]) // set min and max years at 1780 and 1810
        .range([margin.left, width - margin.right]);





    const histogram = d3.select("#histogram")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "lightgray")
    
    
    const g = histogram.append("g");

    const imageBaseY = margin.top;
    const imageSpacing = 50;
    const imageWidth = 40;
    const imageHeight = 50;
    const borderSize = 2; // Adjust as needed

    const images = g.selectAll("image")
        .data(gwData)
        .enter()
        .append("g")
        .attr("class","image_group")
        .attr("href", d => d.thumbnail)
        // .attr("width", 50)
        // .attr("height", 50)
        .attr("transform", d => 
        `translate(${x_scale(+d.Clean_Date) - imageWidth/2}, ${imageBaseY + d.stackIndex * imageSpacing})`
    );
        
    images.append("rect")
        .attr("width", imageWidth)
        .attr("height", imageHeight)
        .attr("fill", "none")
        .attr("stroke", "#b53632ff")
        .attr("stroke-width", borderSize);

    // Add image
    images.append("image")
        .attr("href", d => d.thumbnail)
        .attr("width", imageWidth)
        .attr("height", imageHeight)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .on("click", (event, d) => {
            window.open(d.collectionsURL, "_blank");
        })
        .each(function(d) {
            this.addEventListener('error', function() {
                d3.select(this)
                .attr("href", "placeholder.png"); // path to your placeholder image
            });
        });

        // .on("click", (event, d) => {
        //     window.open(d.collectionsURL, "_blank");
        // });

    // Draw x-axis below the images
    const x_axis = d3.axisBottom(x_scale)
        .ticks(40)
        .tickFormat(d3.format("d"));

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, 30)`)
        //.attr("transform", `translate(0, ${imageBaseY + 5 + d3.max(gwData, d => d.stackIndex) * imageSpacing + 50})`)
        .call(x_axis)
        .selectAll('text')	
        .style('text-anchor', 'start')
        .attr('dx', '0.5em')
        .attr('dy', '1.5em')
        .attr('transform',"rotate(45)" );

    // zoom functionality copied from here https://observablehq.com/@d3/zoom
    histogram.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed));

    function zoomed({transform}) {
        g.attr("transform", transform);
    }

    const zoomBehavior = d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    histogram.call(zoomBehavior);

    document.getElementById("reset-button").onclick = function() {
        histogram.transition()
            .duration(500)
            .call(zoomBehavior.transform, d3.zoomIdentity);
    };



    // const gallery = d3.select("#thumbnail_gallery");
    // const thumbnails = gallery.selectAll("img")
    //     .data(data)
    //     .enter()
    //     .append("img")
    //     .attr("src", d => d.thumbnail)
    //     .attr("width", 150) // Set thumbnail width
    //     .attr("height", 150) // Set thumbnail height
    //     .style("margin", "10px")
    //     .style("cursor", "pointer")
    //     .on("click", (event, d) => {
    //         window.open(d.collectionsURL, "_blank"); // Assuming the CSV has a column 'full_image_url'
    //     });





});

d3.csv("Project_2/Data/Lifeline_dates.csv").then(data => {

});