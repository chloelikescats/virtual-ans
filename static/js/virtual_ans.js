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
    $('#play').css("display", "none");
    $('#stop').css("display", "block");
    $('#stop').css("top", "608px");
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
    let timePerPixel = 230;
    let pixelWidth = columnArray.length;
    let imgDuration = (pixelWidth * timePerPixel) / 1000;

    if ($("#animated-reset").length != 0) {
        //Replace id on animated elements with animated-play if id is animated-reset
        $('#animated-reset').attr('id', 'animated-play');
    }

    document.getElementById("animated-play")
            .style["animation-duration"] = imgDuration + 's';
    $('#animated-play').css('animation-play-state', 'running');

    let interval = setInterval(function () {
        let pixelColumn = columnArray[columnNum];
        playPixelColumn(pixelColumn);
        columnNum += 1;

    $("#stop").on('submit', function(evt){
        evt.preventDefault();
        $('#stop').css("display", "none");
        $('#stop').css("top", "0");
        $('#play').css("display", "block");

        //Pause animated-play
        $('#animated-play').css('animation-play-state', 'paused');
        //Clear the interval (next play press, no prior pixel data will remain)
        clearInterval(interval);
        //Stop the flocking environment
        environment.stop();
        // let currentPosition = -((imgDuration / pixelWidth) * columnNum);
        //This needs to select the resetAnimation animation
        // keyframes.appendRule("0% {-left:" + currentPosition + "px}");
        //Replace id on animated elements with animated-reset
        $('#animated-play').attr('id', 'animated-reset');
        //Set animated-reset to 'running'
        $('#animated-reset').css('animation-play-state', 'running');
    });
        // At end, clear interval and stop environment
        if (columnNum >= columnArray.length) {
            clearInterval(interval);
            environment.stop();
            $('#animated-play').attr('id', 'animated-reset');
            //Set animated-reset to 'running'
            $('#animated-reset').css('animation-play-state', 'running');
            $('#stop').css("top", "0");
            $('#stop').css("display", "none");
            $('#play').css("display", "block");


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


