//Founding Father Face wordle game:
    //load a random face from  PortPaint_use["thumbnail"]
    //get "target" information about face/sitter - occupation, gender, first and last initial

    //


//read data from PortPaint_Use.csv
d3.csv("Data/PortPaint_Use.csv").then(function(data) {
    console.log(data);
    //get list of unique sitters
    const sitters = Array.from(new Set(data.map(d => d.Sitter)));
    console.log(sitters);

    //from this list of sitters, select a random sitter
    const randomSitter = sitters[Math.floor(Math.random() * sitters.length)];
    console.log(randomSitter);

    //put sitter face in <div id="face-image"></div>
    face_div = d3.select("#face-image");
    const sitterData = data.filter(d => d.Sitter === randomSitter);
    console.log(sitterData);
    const imageUrl = sitterData[0].face_urls;
    face_div.append("img")
        .attr("src", imageUrl)
        .attr("alt", randomSitter)
        .attr("width", 200)
        .attr("height", 200);
    //and consolelog their occupation, gender, and initials
    console.log("Occupation: " + sitterData[0].Occupation);
    console.log("Gender: " + sitterData[0].Gender);
    console.log("Initials: " + sitterData[0].first_initial + ". " + sitterData[0].last_initial +".");


    //add an input element under the image for user to type guess
        // input box gives all possible sitter names and narrows down as user types in guess
        // use <div id="input-boxes"></div> for input boxes
    const input_div = d3.select("#input-boxes");
    input_div.append("input")
        .attr("type", "text")
        .attr("id", "sitter-guess")
        .attr("placeholder", "Type your guess here");
    


});
// Grab image