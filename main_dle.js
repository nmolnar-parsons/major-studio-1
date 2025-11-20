//Founding Father Face wordle game:
    //load a random face from  PortPaint_use["thumbnail"]
    //get "target" information about face/sitter - occupation, gender, first and last initial

    //


// Define constant for incorrect color
var incorrect_color = "#B31942";

// Declare sitterData in a higher scope
let sitterData;

//read data from PortPaint_Use.csv
d3.csv("Data/highcount_Use.csv").then(function(data) {
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
    const imageUrl = sitterData.face_urls;
    face_div.append("img")
        .attr("src", imageUrl)
        .attr("alt", sitterData.Sitter)
        .attr("width", 400)
        .attr("height", 350);
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
    for (let i = 0; i < 5; i++) {
        const resultBox = result_div.append("div")
            .attr("class", "result-box")
            .attr("id", "result-box-" + (i + 1));

        // Add five hint-box divs for each result-box
        ["name", "occupation", "first-initial", "last-initial", "portraits"].forEach(hint => {
            resultBox.append("div")
                .attr("class", "hint-box")
                .attr("id", `result-box-${i + 1}-${hint}`);
        });
    }

    // Track the number of guesses made
    let guessCount = 0;

    // Load sitter information from Sitter_Info.json
    d3.json("Data/Sitter_Info.json").then(function(sitterInfoData) {
        // Add event listener for the input box
        d3.select("#input-datalist").on("change", function() {
            const userGuess = this.value;

            // Find the guessed sitter in Sitter_Info.json
            const guessedSitter = sitterInfoData.find(sitter => sitter.name === userGuess);
            const isCorrect = guessedSitter && guessedSitter.name === sitterData.Sitter;

            // Update the corresponding result box
            if (guessCount < 5) {
                const resultBoxId = `#result-box-${guessCount + 1}`;

                // Update the name hint
                d3.select(`${resultBoxId}-name`)
                    .text(userGuess)
                    .style("color", isCorrect ? "green" : incorrect_color);

                if (isCorrect) {
                    // Mark all hints as correct
                    d3.select(`${resultBoxId}-occupation`).text("Correct!").style("color", "green");
                    d3.select(`${resultBoxId}-first-initial`).text("Correct!").style("color", "green");
                    d3.select(`${resultBoxId}-last-initial`).text("Correct!").style("color", "green");
                    d3.select(`${resultBoxId}-portraits`).text("Correct!").style("color", "green");

                    // Show the "Correct!" popup
                    d3.select("#sitter-name").text("Correct!").style("color", "green");
                    d3.select("#sitter-popup").classed("hidden", false);
                } else if (guessedSitter) {
                    // Compare and update each hint
                    const targetSitter = sitterInfoData.find(sitter => sitter.name === sitterData.Sitter);

                    const occupationMatch = guessedSitter.occupation === targetSitter.occupation;
                    const firstInitialMatch = guessedSitter.first_initial === targetSitter.first_initial;
                    const lastInitialMatch = guessedSitter.last_initial === targetSitter.last_initial;

                    const guessedPortraits = guessedSitter.number_of_portraits;
                    const realPortraits = targetSitter.number_of_portraits;
                    let comparisonSign = guessedPortraits < realPortraits ? ">" : guessedPortraits > realPortraits ? "<" : "=";
                    const portraitMatch = guessedPortraits === realPortraits;

                    d3.select(`${resultBoxId}-occupation`)
                        .text(guessedSitter.occupation)
                        .style("color", occupationMatch ? "green" : incorrect_color);

                    d3.select(`${resultBoxId}-first-initial`)
                        .text(guessedSitter.first_initial)
                        .style("color", firstInitialMatch ? "green" : incorrect_color);

                    d3.select(`${resultBoxId}-last-initial`)
                        .text(guessedSitter.last_initial)
                        .style("color", lastInitialMatch ? "green" : incorrect_color);

                    d3.select(`${resultBoxId}-portraits`)
                        .text(`${comparisonSign} ${guessedPortraits}`)
                        .style("color", portraitMatch ? "green" : incorrect_color);
                } else {
                    // No match found
                    d3.select(`${resultBoxId}-occupation`).text("No match").style("color", incorrect_color);
                    d3.select(`${resultBoxId}-first-initial`).text("No match").style("color", incorrect_color);
                    d3.select(`${resultBoxId}-last-initial`).text("No match").style("color", incorrect_color);
                    d3.select(`${resultBoxId}-portraits`).text("No match").style("color", incorrect_color);
                }

                guessCount++;
            }

            // Clear the input box for the next guess
            this.value = "";
        });
    });

});

// Add event listener to reset the game when the title is clicked
document.addEventListener("DOMContentLoaded", function() {
    d3.select("#reset").on("click", function() {
        // Reveal the current sitter in the popup
        if (sitterData) {
            d3.select("#sitter-name").text(`The sitter is: ${sitterData.Sitter}`);
            d3.select("#sitter-popup").classed("hidden", false);
        } else {
            console.error("Sitter data is not available.");
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