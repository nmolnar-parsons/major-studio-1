//Founding Father Face wordle game:
    //load a random face from  PortPaint_use["thumbnail"]
    //get "target" information about face/sitter - occupation, gender, first and last initial

    //


// Define constant for incorrect color
var incorrect_color = "#B31942";

// Declare sitterData in a higher scope
let sitterData;

//read data from PortPaint_Use.csv
d3.csv("Data/highcount_Use_hosted.csv").then(function(data) {
    console.log(data);

    //get list of unique sitters
    const sitters = Array.from(new Set(data.map(d => d.Sitter)));
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
    face_div = d3.select("#face-image");


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

    // Add five "result" boxes below, each containing five "hint-box" divs
    const result_div = d3.select("#guess_result");
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

    // Track the number of guesses made
    let guessCount = 0;

    // Load sitter information from Sitter_Info.json
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

                guessCount++;
                
                // Activate the next row if available
                if (guessCount < 6) {
                    const nextResultBoxId = `#result-box-${guessCount + 1}`;
                    d3.selectAll(`${nextResultBoxId} .hint-box`)
                        .classed("inactive", false)
                        .classed("active", true);
                }
                
                // Only clear the input box after a successful guess
                this.value = "";
            }
        });
    });

});


document.addEventListener("DOMContentLoaded", function() {
    d3.select("#reset").on("click", function() {
        // Check if the text is "play again?"
        const resetText = d3.select("#reset").text();
        
        if (resetText === "play again?") {
            // Just reload the page without showing popup
            location.reload();
        } else {
            // Reveal the current sitter in the popup (give up scenario)
            if (sitterData) {
                d3.select("#sitter-name").text(`The sitter is: ${sitterData.Sitter}`);
                d3.select("#sitter-popup").classed("hidden", false);
            } else {
                console.error("Sitter data is not available.");
            }
        }
    });

    // Close the popup and reset the game when the close button is clicked
    d3.select("#close-popup").on("click", function() {
        d3.select("#sitter-popup").classed("hidden", true);
        location.reload(); // Reset the game by reloading the page
    });
});

// hints should be visually aligned so switching from one guest to next, everything is aligned
// color all digits of the date green or red if correct or not