//import cleaned data 




//improvements
//make qualitative work harder
    //highlights 
    //
// maybe do a rectangle with darker areas for higher concenration of portraits in that year range
//basically a heatmap of portraits along the timeline
// caurosel of portraits for each sitter when the bar is clicked
// double bind current year and what portrait is currently being shown?




let timeline_dates = null; // global variable


//get timeline dates globally
d3.json("Project_2/Data/dates.json").then(dates => {
    timeline_dates = dates;
});



d3.csv("Project_2/Data/portraits_with_cropXY.csv").then(data => {

    //sitter counts
    const sitterCounts = Array.from(d3.rollup(data, v => v.length, d => d.Sitter))
        .reduce((acc, [sitter, count]) => (acc[sitter] = count, acc), {});

    //filter for George Washington and between 1780 and 1810
    var gwData = data.filter(d => 
        d.Sitter === "George Washington" &&
        // !["unidentified", "Unidentified Woman", "Unidentified Man"].includes(d.Sitter)
        +d.Clean_Date >= 1780 && +d.Clean_Date <= 1810 &&
        d.thumbnail // this checks that thumbnail is not empty, null, or undefined
        // && sitterCounts[d.Sitter] >= 5
    );

    console.log(gwData);
    console.log(timeline_dates);

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
    const margin = ({top: 150, right: 50, bottom: 100, left: 100});
    const width = window.innerWidth*0.99;
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
        });

        // .on("click", (event, d) => {
        //     window.open(d.collectionsURL, "_blank");
        // });

    // Draw x-axis above the images
    const x_axis = d3.axisBottom(x_scale)
        .ticks(40)
        .tickFormat(d3.format("d"));

    // Calculate the bottom y position of the last stacked image
    const maxStackIndex = d3.max(gwData, d => d.stackIndex);
    const axisY = imageBaseY - 50; // 10px above the top of the images

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${axisY})`)
        .call(x_axis)
        .selectAll('text')	
        .style('text-anchor', 'start')
        .attr('dx', '0.5em')
        .attr('dy', '1.5em')
        .attr('transform',"rotate(45)" );

    //append rectangular timeline of Sitter's Life (in this case George Washington)
    const timelineHeight = 25;
    const timelineY = imageBaseY - timelineHeight - 55; // 30px above images, adjust as needed


    function draw_timeline(person, color, timelineY, timelineHeight, x_scale, g) {
        const dates = timeline_dates[person];
        if (!dates) return;

        // Find birth and death events
        const birth = dates.find(d => d.event === "Birth");
        const death = dates.find(d => d.event === "Death");
        if (!birth || !death) return;

        // Draw lifeline rectangle
        g.append("rect")
            .attr("x", x_scale(+birth.date.substring(0,4)))
            .attr("y", timelineY)
            .attr("class", "lifeline")
            .attr("width", x_scale(+death.date.substring(0,4)) - x_scale(+birth.date.substring(0,4)))
            .attr("height", timelineHeight)
            .attr("fill", color)
            .attr("opacity", 0.5)
            .on("click", () => {
                // Filter portraits for the clicked person
                const personData = data.filter(d => d.Sitter === person 
                    && +d.Clean_Date >= 1780 && +d.Clean_Date <= 1810 &&    
                    d.thumbnail // this checks that thumbnail is not empty, null, or undefined
                );


                // Recalculate stackIndex for this person's images
                const yearGroups = {};
                personData.forEach(d => {
                    const year = +d.Clean_Date;
                    if (!yearGroups[year]) yearGroups[year] = [];
                    yearGroups[year].push(d);
                });
                personData.forEach(d => {
                    const year = +d.Clean_Date;
                    d.stackIndex = yearGroups[year].indexOf(d);
                });

                // Fade out old images
                g.selectAll(".image_group")
                    .transition()
                    .duration(400)
                    .style("opacity", 0)
                    .remove();

                // Render new images, initially hidden
                const images = g.selectAll(null)
                    .data(personData)
                    .enter()
                    .append("g")
                    .attr("class", "image_group")
                    .attr("transform", d => 
                        `translate(${x_scale(+d.Clean_Date) - imageWidth/2}, ${imageBaseY + d.stackIndex * imageSpacing})`
                    )
                    .style("opacity", 0); // start hidden

                images.append("rect")
                    .attr("class", "portrait-border")
                    .attr("width", imageWidth)
                    .attr("height", imageHeight)
                    .attr("fill", "none")
                    .attr("stroke", "#b53632ff")
                    .attr("stroke-width", borderSize);

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
                                .attr("href", "placeholder.png");
                        });
                    });

                //remove old highlight borders
                g.selectAll("rect.lifeline")
                    .attr("stroke", null)
                    .attr("stroke-width", null);

                // add highlight border on lifeline
                g.selectAll("rect.lifeline")
                    .filter(function() {
                        return d3.select(this).attr("fill") === color;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 3);   

                // Fade in new images
                images.transition()
                    .duration(400)
                        .style("opacity", 1);

                    // Change the h2 text to the selected person
                const h2 = document.querySelector("h2");

                // Fade out
                h2.style.transition = "opacity 0.4s";
                h2.style.opacity = 0;

                // After fade out, change text and fade in
                setTimeout(() => {
                    h2.textContent = person;
                    h2.style.opacity = 1;
                }, 400); // match your image transition duration
            });

        // Add timeline text at the right end
        g.append("text")
            .attr("x", x_scale(1780))
            .attr("y", timelineY + timelineHeight / 2 + 5)
            .attr("text-anchor", "start")
            .attr("fill", "black")
            .attr("font-size", "20px")
            .text(`${person} (${birth.date.substring(0,4)}-${death.date.substring(0,4)})`);
    }

    // Usage example inside your d3.csv().then(...):
    draw_timeline("George Washington", "#bb0d0de8", timelineY, timelineHeight, x_scale, g);
    draw_timeline("Benjamin Franklin", "#0d6ebb88", timelineY - 28, timelineHeight, x_scale, g); // offset Y for visibility
    draw_timeline("Thomas Jefferson", "#0dbb3de8", timelineY - 56, timelineHeight, x_scale, g); // offset Y for visibility
    
    //add ticks and labels to timeline
    // if (timeline_dates) {
    //     timeline_dates.forEach(date => {
    //         const xPos = x_scale(date.year);
    //         // Tick
    //         g.append("line")
    //             .attr("x1", xPos)
    //             .attr("y1", timelineY)
    //             .attr("x2", xPos)
    //             .attr("y2", timelineY + timelineHeight)
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 1);
    //         // Label
    //         g.append("text")
    //             .attr("x", xPos)
    //             .attr("y", timelineY - 5) // position above the timeline
    //             .attr("text-anchor", "middle")
    //             .attr("font-size", "10px")
    //             .text(date.label);
    //     });
    // }


    

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

