// /*PLANNING:
// - Get Column Data
// - 0-255 (0 is black, 255 is white)
// - Scale amplitude based on 0-255 (0 silent, 255 loudest)
// - Each value represents pixel in row
// - 720 rows, 240 tones
// --------------------
// - (formerly 72) 24 discrete oscillators per octave.
// - 2 "photocells" per octave
// - 12 oscillators -> bandpass filter -> amplitude control
// - 2 bandpass filters/amplitude controls per octave
// */ 
"use strict";
//AJAX on page load to get frequencies
$.get("/frequencies.json", generateSynths);
fluid.registerNamespace("virtual_ans");
let environment = flock.init();

//Create array of synth objects, one for each freq
let sinOscs = [];
function generateSynths(result) {
    let frequencyArray = result['frequency']
    frequencyArray = frequencyArray.reverse();

    let count = 0;
    for (let freq_hz in frequencyArray) {
        let synth_id = "sin" + (count + 1);
        let sinOsc = {

                synthDef: {
                    ugen: "flock.ugen.sinOsc",
                    id: synth_id,
                    freq: frequencyArray[freq_hz],
                    mul: 0.0
                }
        };
        sinOscs.push(flock.synth(sinOsc));
        count += 1
    }
}


//250 at a time seems to be the functional limit of the environment
// I will want to divide by octave and have seperate play functions with bp filters?


$("#play").on("submit", getJSON);

// AJAX gets pixel data
function getJSON(evt) {
    evt.preventDefault();
    let imgId = $("#img_id_in").val();
    $.get("/pixel_data.json", {"img_id": imgId}, playSynths);
}



// Function that unpacks a column data every second
function playSynths(result) {
    environment.start();

    let columnArray = result['column'];
    let columnNum = 0;

    // Get image duration for CSS Animation
    let timePerPixel = 250;
    let pixelWidth = columnArray.length;
    let imgDuration = (pixelWidth * timePerPixel) / 1000;

    document.getElementById("animated-elements")
            .style["animation-duration"] = imgDuration + 's';
    $('#animated-elements').css('animation-play-state', 'running');

    let interval = setInterval(function () {
        let pixelColumn = columnArray[columnNum];
        playPixelColumn(pixelColumn);
        columnNum += 1;

    $("#stop").on('click', function(){
        $('#animated-elements').css('animation-play-state', 'paused');
        clearInterval(interval);
        environment.stop();
    });
        // At end, clear interval and stop environment
        if (columnNum >= columnArray.length) {
            clearInterval(interval);
            environment.stop();
        }
    }, timePerPixel)
}


function playPixelColumn(pixelColumn) {
    let i = 1;
    for (let j=0; j<120; j++) {
        let synth_id = "sin" + i;
        let pixel = pixelColumn[j];
        let newMul;

        if (pixel > 50) {
            newMul = pixel / 2500; /* pixel val: 0-255, mul range: 0.00-0.05 */
        } else {
            newMul = 0.0;
        }

        sinOscs[j].set(synth_id+".mul", newMul);
        i+=1;
    }
}


