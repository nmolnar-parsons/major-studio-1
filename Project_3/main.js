//Founding Father Face wordle game:
    //load a random face from  PortPaint_use["thumbnail"]
    //get "target" information about face/sitter - occupation, gender, first and last initial

    //


//read data from PortPaint_Use.csv
d3.csv("Data/highcount_Use.csv").then(function(data) {
    console.log(data);

    //get list of unique sitters
    const sitters = Array.from(new Set(data.map(d => d.Sitter)));
    //organize sitter list alphabetically
    sitters.sort();
    console.log(sitters);

    // Get a list of unique EDANurls
    const edanUrls = Array.from(new Set(data.map(d => d.EDANurl)));

    // Select a random EDANurl
    const randomEDANurl = edanUrls[Math.floor(Math.random() * edanUrls.length)];
    console.log("Random EDANurl: " + randomEDANurl);

    // Get the data for the selected EDANurl
    const sitterData = data.find(d => d.EDANurl === randomEDANurl);
    console.log(sitterData);
    if (!sitterData) {
        console.error("No data found for the selected random EDANurl.");
        return;
    }

    //put sitter face in <div id="face-image"></div>
    face_div = d3.select("#face-image");
    const imageUrl = sitterData.face_urls;
    face_div.append("img")
        .attr("src", imageUrl)
        .attr("alt", sitterData.Sitter)
        .attr("width", 200)
        .attr("height", 200);
    //and consolelog their occupation, gender, and initials
    console.log("Sitter: " + sitterData.Sitter);
    console.log("Occupation: " + sitterData.Occupation);
    console.log("Initials: " + sitterData.first_initial + ". " + sitterData.last_initial + ".");
    console.log("Date: " + sitterData.Clean_Date);


    //add an input element under the image for user to type guess
        // input box gives all possible sitter names and narrows down as user types in guess
        // use <div id="input-boxes"></div> for input boxes
    const input_div = d3.select("#input-boxes");
    input_div.append("input")
        .attr("type", "text")
        .attr("id", "sitter-guess")
        .attr("placeholder", "Type your guess here")
        .attr("list", "sitter-names"); // Link to the datalist

    // Create a datalist element and populate it with sitter names
    const datalist = input_div.append("datalist")
        .attr("id", "sitter-names");

    sitters.forEach(sitter => {
        datalist.append("option")
            .attr("value", sitter);
    });

    //add five "result" boxes below, add to <div id="guess_result"></div>
    const result_div = d3.select("#guess_result");
    for (let i = 0; i < 5; i++) {
        result_div.append("div")
            .attr("class", "result-box")
            .attr("id", "result-box-" + (i + 1))
            .text("Guess " + (i + 1) + ": ");
    }

    // Track the number of guesses made
    let guessCount = 0;

    // Add event listener for the input box
    d3.select("#sitter-guess").on("change", function() {
        const userGuess = this.value;

        // Check if the guess matches the sitter for the random EDANurl
        const isCorrect = userGuess === sitterData.Sitter;

        // Update the corresponding result box
        if (guessCount < 5) {
            const resultBox = d3.select("#result-box-" + (guessCount + 1));
            resultBox.text(`Guess ${guessCount + 1}: ${userGuess} - `);

            if (isCorrect) {
                resultBox.append("span").text(`Correct!`).style("color", "green");
            } else {
                const sitterInfo = data.find(d => d.Sitter === userGuess);
                if (sitterInfo) {
                    // Compare and color-code each attribute against the specific sitter data
                    const occupationMatch = sitterInfo.Occupation === sitterData.Occupation;
                    const firstInitialMatch = sitterInfo.first_initial === sitterData.first_initial;
                    const lastInitialMatch = sitterInfo.last_initial === sitterData.last_initial;

                    // Compare Clean_Date and determine arrow direction
                    const guessedDate = parseInt(sitterInfo.Clean_Date, 10);
                    const realDate = parseInt(sitterData.Clean_Date, 10);
                    let cleanDateHint = sitterInfo.Clean_Date;
                    let arrow = "";

                    if (!isNaN(guessedDate) && !isNaN(realDate)) {
                        if (guessedDate < realDate) {
                            arrow = "→"; // Guessed date is smaller
                        } else if (guessedDate > realDate) {
                            arrow = "←"; // Guessed date is larger
                        }
                    }

                    const cleanDateMatch = sitterInfo.Clean_Date === sitterData.Clean_Date;

                    resultBox.append("span").html(`
                        Occupation: <span style="color: ${occupationMatch ? 'green' : 'red'}">${sitterInfo.Occupation}</span>, 
                        Initials: <span style="color: ${firstInitialMatch ? 'green' : 'red'}">${sitterInfo.first_initial}.</span> 
                        <span style="color: ${lastInitialMatch ? 'green' : 'red'}">${sitterInfo.last_initial}.</span>, 
                        Date: <span style="color: ${cleanDateMatch ? 'green' : 'red'}">${cleanDateHint} ${arrow}</span>
                    `);
                } else {
                    resultBox.append("span").text(`No match found.`).style("color", "red");
                }
            }

            guessCount++;
        }

        // Clear the input box for the next guess
        this.value = "";
    });

});

// hints should be visually aligned so switching from one guest to next, everything is aligned
// color all digits of the date green or red if correct or not