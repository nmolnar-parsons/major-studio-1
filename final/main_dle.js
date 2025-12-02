// Stuff to add


    // landing page (maybe showing process of isolating faces from portraits)
    
    // intro page -> rework of page 2 of midterm
        //introduction to all possible sitters

    // page 3: all faces
        // Layout of all faces isolated from portraits
            // hover over face to see name
        // occupations, name length filters
        
    
    // page 4: game
        // "learn more" button which links back to page 3
        // add to win popup:
            // sitter history, and more portraits of sitter


// Define constant for incorrect color
var incorrect_color = "#B31942";

// Declare sitterData in a higher scope
let sitterData;


//Gallery
d3.csv("Data/highcount_Use_hosted.csv").then(function(data) {
    // Add a section below the game to show all portrait faces
    const galleryDiv = d3.select("#portrait-gallery");
    galleryDiv.append("h2").text("All Portraits");

    data.forEach(d => {
        const imageUrl = "Data/" + d.file_path;

        galleryDiv.append("img")
            .attr("src", imageUrl)
            .attr("alt", d.Sitter)
            .attr("class", "gallery-image")
            .attr("data-sitter", d.Sitter) // Add data attribute for sitter name
            .style("margin", "1px")
            .style("border-radius", "5px")
            .style("width", "40px")
            .style("height", "auto")
            .on("mouseover", function(event) {
                // Show tooltip with sitter name and EDANurl
                const tooltip = d3.select("#tooltip");
                tooltip.style("opacity", 1)
                    .html(`<div><strong>${d.Sitter}</strong></div><div style="font-size: 0.8em; color: #ccc;">${d.EDANurl}</div>`)
                    .style("left", `${event.clientX + 15}px`) // Use clientX for viewport-relative positioning
                    .style("top", `${event.clientY + 15}px`) // Use clientY for viewport-relative positioning
                    .style("z-index", 1000);

                // Highlight all images of the same sitter
                d3.selectAll(`.gallery-image[data-sitter='${d.Sitter}']`)
                    .style("outline", "3px solid #0A3161")
                    .style("outline-offset", "1px");

                //lower opacity of other images
                d3.selectAll(".gallery-image")
                    .filter(function() {
                        return d3.select(this).attr("data-sitter") !== d.Sitter;
                    })
                    .style("opacity", 0.75);
            })
            .on("mousemove", function(event) {
                // Update tooltip position on mouse move using viewport coordinates
                const tooltip = d3.select("#tooltip");
                tooltip.style("left", `${event.clientX + 15}px`)
                    .style("top", `${event.clientY + 15}px`);
            })
            .on("mouseout", function() {
                // Hide tooltip
                d3.select("#tooltip").style("opacity", 0);

                // Remove highlight from all images
                d3.selectAll(".gallery-image")
                    .style("outline", "none");
                // Reset opacity of all images
                d3.selectAll(".gallery-image")
                    .style("opacity", 1);
            });
    });

    // Add scroll event listener to hide tooltip when scrolling
    window.addEventListener("scroll", function() {
        d3.select("#tooltip").style("opacity", 0);
        
        // Also remove any highlights when scrolling
        d3.selectAll(".gallery-image")
            .style("outline", "none")
            .style("opacity", 1);
    });

});



// Global variables for game state
let gameData;
let sitters;
let guessCount = 0;

// Extract game initialization into a reusable function
function initializeGame(data) {
    // Reset game state
    guessCount = 0;
    
    //get list of unique sitters
    sitters = Array.from(new Set(data.map(d => d.Sitter)));
    //organize sitter list alphabetically
    sitters.sort();
    console.log(sitters);

    // Select a random EDANurl
    const edanUrls = Array.from(new Set(data.map(d => d.EDANurl)));
    const randomEDANurl = edanUrls[Math.floor(Math.random() * edanUrls.length)];
    console.log("Random EDANurl: " + randomEDANurl);

    // Assign the data for the selected EDANurl to the higher scoped sitterData
    sitterData = data.find(d => d.EDANurl === randomEDANurl);
    console.log(sitterData);
    if (!sitterData) {
        console.error("No data found for the selected random EDANurl.");
        return;
    }

    //calculate number of portraits per sitter
    const sitterCounts = {};
    data.forEach(d => {
        if (sitterCounts[d.Sitter]) {
            sitterCounts[d.Sitter]++;
        } else {
            sitterCounts[d.Sitter] = 1;
        }
    });
    console.log("Sitter counts:", sitterCounts);

    //put sitter face in <div id="face-image"></div>
    const face_div = d3.select("#face-image");
    face_div.selectAll("*").remove(); // Clear previous image

    const imageUrl = sitterData.file_path;

    // Create an image element to load the image
    const tempImage = new Image();
    tempImage.src = "Data/" + imageUrl;
    tempImage.onload = function() {
        const aspectRatio = tempImage.width / tempImage.height;
        const height = 520; // Fixed height
        const width = height * aspectRatio; // Calculate width based on aspect ratio

        face_div.append("img")
            .attr("src", "Data/" + imageUrl)
            .attr("alt", sitterData.Sitter)
            .attr("width", width)
            .attr("height", height);
    };

    //and consolelog their occupation, gender, and initials
    console.log("Sitter: " + sitterData.Sitter);


    //add an input element under the image for user to type guess
        // input box gives all possible sitter names and narrows down as user types in guess
        // use <div id="input-boxes"></div> for input boxes
    const input_div = d3.select("#input-boxes");
    input_div.selectAll("*").remove(); // Clear previous input elements
    
    input_div.append("input")
        .attr("type", "text")
        .attr("id", "input-datalist")
        .attr("class", "form-control")
        .attr("placeholder", "Your guess here, please:")
        .attr("font-style", "italic")
        .attr("list", "sitter-names"); // Link to the datalist

    // Create a datalist element and populate it with sitter names
    const datalist = input_div.append("datalist")
        .attr("id", "sitter-names");

    sitters.forEach(sitter => {
        datalist.append("option")
            .attr("value", sitter);
    });

    // Clear and reset result boxes
    const result_div = d3.select("#guess_result");
    result_div.selectAll("*").remove(); // Clear previous result boxes
    
    for (let i = 0; i < 6; i++) {
        const resultBox = result_div.append("div")
            .attr("class", "result-box")
            .attr("id", "result-box-" + (i + 1));

        // Update hint categories to include "length-of-name" instead of "portraits"
        ["name", "occupation", "first-initial", "last-initial", "length-of-name"].forEach(hint => {
            resultBox.append("div")
                .attr("class", i === 0 ? "hint-box active" : "hint-box inactive")
                .attr("id", `result-box-${i + 1}-${hint}`);
        });
    }

    // Reset reset button text
    d3.select("#reset").text("give up?");

    // Remove any blue filter from gallery images
    d3.selectAll(".gallery-image").style("filter", null);

    // Load sitter information from Sitter_Info.json and set up event listener
    d3.json("Data/sitter_info.json").then(function(sitterInfoData) {
        // Add event listener for the input box
        d3.select("#input-datalist").on("change", function() {
            const userGuess = this.value;

            // Validate that the input is in the sitters list
            if (!sitters.includes(userGuess)) {
                // Don't clear the input, just return without processing
                return;
            }

            // Find the guessed sitter in Sitter_Info.json
            const guessedSitter = sitterInfoData.find(sitter => sitter.name === userGuess);
            const isCorrect = guessedSitter && guessedSitter.name === sitterData.Sitter;

            // Update the corresponding result box
            if (guessCount < 6) {
                const resultBoxId = `#result-box-${guessCount + 1}`;

                // Remove active/inactive classes from current row
                d3.selectAll(`${resultBoxId} .hint-box`)
                    .classed("active", false)
                    .classed("inactive", false);

                // Update the name hint
                d3.select(`${resultBoxId}-name`)
                    .text(userGuess)
                    .style("color", isCorrect ? "#0A3161" : incorrect_color);

                if (isCorrect) {
                    // Mark all hints as correct with actual values
                    const targetSitter = sitterInfoData.find(sitter => sitter.name === sitterData.Sitter);

                    d3.select(`${resultBoxId}-occupation`)
                        .text(targetSitter.occupation)
                        .style("background-color", "#0A3161")
                        .style("color", "white");

                    d3.select(`${resultBoxId}-first-initial`)
                        .text(targetSitter.first_initial)
                        .style("background-color", "#0A3161")
                        .style("color", "white");

                    d3.select(`${resultBoxId}-last-initial`)
                        .text(targetSitter.last_initial)
                        .style("background-color", "#0A3161")
                        .style("color", "white");

                    d3.select(`${resultBoxId}-length-of-name`)
                        .text("just right!")
                        .style("background-color", "#0A3161")
                        .style("color", "white");

                    // Change reset text to "play again?"
                    d3.select("#reset").text("play again?");
                    
                    // Disable the input box
                    d3.select("#input-datalist").attr("disabled", true);

                    // Prevent highlighting the next result box
                    guessCount = 6; // Set guessCount to max to stop further guesses

                    // Apply a blue filter to all images of the guessed sitter in the "All Portraits" section
                    d3.selectAll(`.gallery-image[data-sitter='${sitterData.Sitter}']`)
                        .style("filter", "brightness(0.5) saturate(1.5) hue-rotate(200deg)");


                    // Show popup with thumbnail, sitter name, artist name, occupation, and date after 1.5 seconds
                    setTimeout(() => {
                        // Preload the portrait image before showing popup
                        const portraitImg = new Image();
                        portraitImg.onload = function() {
                            const popupContent = `
                                <button id="close-popup" class="close-btn">&times;</button>
                                <div>
                                    <img src="${sitterData.thumbnail}" alt="${sitterData.Sitter}" style="max-width: 100%; border-radius: 10px;">
                                    <h2>${sitterData.Sitter}</h2>
                                    <p>Artist: ${(sitterData.Artist || "Unknown").replace(/\\u00e9/g, 'é')}</p>
                                    <p>Date: ${sitterData.Clean_Date || "Unknown"}</p>
                                    <p style="font-size: 12px;">${targetSitter.description || "No description available"}</p>
                                </div>
                            `;
                            d3.select("#sitter-popup-content").html(popupContent);
                            d3.select("#sitter-popup").classed("hidden", false);
                            
                            // Disable scrolling when popup is shown
                            d3.select("body").style("overflow", "hidden");
                            
                            // Add event listener for the close button
                            d3.select("#close-popup").on("click", function() {
                                d3.select("#sitter-popup").classed("hidden", true);
                                // Re-enable scrolling when popup is closed
                                d3.select("body").style("overflow", "auto");
                            });
                        };
                        portraitImg.src = sitterData.thumbnail;
                    }, 1500);
                } else if (guessedSitter) {
                    // Compare and update each hint
                    const targetSitter = sitterInfoData.find(sitter => sitter.name === sitterData.Sitter);

                    const occupationMatch = guessedSitter.occupation === targetSitter.occupation;
                    const firstInitialMatch = guessedSitter.first_initial === targetSitter.first_initial;
                    const lastInitialMatch = guessedSitter.last_initial === targetSitter.last_initial;

                    const guessedLength = guessedSitter.length_of_name;
                    const realLength = targetSitter.length_of_name;
                    const lengthHint = guessedLength === realLength ? "just right!" : guessedLength < realLength ? "too short!" : "too long!";

                    d3.select(`${resultBoxId}-occupation`)
                        .text(guessedSitter.occupation)
                        .style("background-color", occupationMatch ? "#0A3161" : "#B31942") // Blue if correct, red if wrong
                        .style("color", "white");

                    d3.select(`${resultBoxId}-first-initial`)
                        .text(guessedSitter.first_initial)
                        .style("background-color", firstInitialMatch ? "#0A3161" : "#B31942") // Blue if correct, red if wrong
                        .style("color", "white");

                    d3.select(`${resultBoxId}-last-initial`)
                        .text(guessedSitter.last_initial)
                        .style("background-color", lastInitialMatch ? "#0A3161" : "#B31942") // Blue if correct, red if wrong
                        .style("color", "white");

                    d3.select(`${resultBoxId}-length-of-name`)
                        .text(lengthHint)
                        .style("background-color", lengthHint === "just right!" ? "#0A3161" : "#B31942") // Blue if correct, red if wrong
                        .style("color", "white");
                }

                // Fade in hints left to right over 1.5 seconds
                const hints = ["name", "occupation", "first-initial", "last-initial", "length-of-name"];
                const totalFadeDuration = hints.length * 300; // Total fade duration (300ms per hint)
                hints.forEach((hint, index) => {
                    d3.select(`${resultBoxId}-${hint}`)
                        .style("opacity", 0) // Start hidden
                        .transition()
                        .delay(index * 300) // Delay each hint by 300ms
                        .duration(300) // Fade in over 300ms
                        .style("opacity", 1); // Fully visible
                });

                // Fade in the next result box after all hints are loaded
                setTimeout(() => {
                    if (guessCount < 6 && !isCorrect) {
                        const nextResultBoxId = `#result-box-${guessCount + 1}`;
                        d3.select(`#result-box-${guessCount + 1}`)
                            .style("opacity", 0) // Start hidden
                            .transition()
                            .duration(500) // Fade in over 500ms
                            .style("opacity", 1); // Fully visible

                        d3.selectAll(`${nextResultBoxId} .hint-box`)
                            .classed("inactive", false)
                            .classed("active", true);
                    }
                }, totalFadeDuration);

                guessCount++;

                // If out of guesses, display the "give up" popup after 500ms
                if (guessCount >= 6 && !isCorrect) {
                    setTimeout(() => {
                        if (sitterData) {
                            d3.select("#sitter-name").text(`The sitter is: ${sitterData.Sitter}`);
                            d3.select("#sitter-popup").classed("hidden", false);
                        } else {
                            console.error("Sitter data is not available.");
                        }
                    }, 1700); // Delay of 500ms
                }

                // Only clear the input box after a successful guess
                this.value = "";
            }
        });
    });
}

function resetGame() {
    // Close any open popups
    d3.select("#sitter-popup").classed("hidden", true);
    d3.select("body").style("overflow", "auto");
    
    // Initialize a new game with the existing data
    if (gameData) {
        initializeGame(gameData);
    }
}

//Game - Modified to use the new architecture
d3.csv("Data/highcount_Use_hosted.csv").then(function(data) {
    console.log(data);
    
    // Store data globally for reset functionality
    gameData = data;
    
    // Initialize the first game
    initializeGame(data);
});

document.addEventListener("DOMContentLoaded", function() {
    d3.select("#reset").on("click", function() {
        // Check if the text is "play again?"
        const resetText = d3.select("#reset").text();
        
        if (resetText === "play again?") {
            // Reset the game instead of reloading the page
            resetGame();
        } else {
            // Reveal the current sitter in the popup (give up scenario)
            if (sitterData) {
                // Disable the input box when give up is pressed
                d3.select("#input-datalist").attr("disabled", true);
                
                // Load sitter info to get occupation data
                d3.json("Data/sitter_info.json").then(function(sitterInfoData) {
                    const targetSitter = sitterInfoData.find(sitter => sitter.name === sitterData.Sitter);
                    
                    // Preload the portrait image before showing popup
                    const portraitImg = new Image();
                    portraitImg.onload = function() {
                        // Create complete popup content similar to the winning scenario
                        const popupContent = `
                            <button id="close-popup" class="close-btn">&times;</button>
                            <div>
                                <img src="${sitterData.thumbnail}" alt="${sitterData.Sitter}" style="max-width: 100%; border-radius: 10px;">
                                <h2>${sitterData.Sitter}</h2>
                                <p>Artist: ${(sitterData.Artist || "Unknown").replace(/\\u00e9/g, 'é')}</p>
                                <p>Date: ${sitterData.Clean_Date || "Unknown"}</p>
                                <p>${targetSitter.occupation || "Unknown"}</p>
                            </div>
                        `;
                        
                        // Set the complete popup content
                        d3.select("#sitter-popup-content").html(popupContent);
                        
                        // Show the popup
                        d3.select("#sitter-popup").classed("hidden", false);
                        
                        // Disable scrolling when popup is shown
                        d3.select("body").style("overflow", "hidden");
                        
                        // Re-attach the close button event listener
                        d3.select("#close-popup").on("click", function() {
                            d3.select("#sitter-popup").classed("hidden", true);
                            // Re-enable scrolling when popup is closed
                            d3.select("body").style("overflow", "auto");
                        });
                    };
                    portraitImg.src = sitterData.thumbnail;
                });

                // Update the reset button text to "play again?"
                d3.select("#reset").text("play again?");
            } else {
                console.error("Sitter data is not available.");
            }
        }
    });
});

// Add event listener to hide the popup when clicking outside of it
document.addEventListener("click", function(event) {
    const popup = d3.select("#sitter-popup");
    const popupContent = d3.select("#sitter-popup-content");

    if (!popupContent.node().contains(event.target) && !popup.classed("hidden")) {
        popup.classed("hidden", true);
        // Re-enable scrolling when popup is closed
        d3.select("body").style("overflow", "auto");
    }
});

// hints should be visually aligned so switching from one guest to next, everything is aligned
// color all digits of the date green or red if correct or not