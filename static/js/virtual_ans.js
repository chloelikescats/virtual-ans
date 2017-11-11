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

    let count = 0;
    for (let freq_hz in frequencyArray) {
        let synth_id = "sin" + (count + 1);
        let sinOsc = {

                synthDef: {
                    ugen: "flock.ugen.sinOsc",
                    id: synth_id,
                    freq: frequencyArray[freq_hz],
                    mul: 0.05
                }
        };
        sinOscs.push(flock.synth(sinOsc));
        count += 1 
    }
    console.log("done loading freqs!");
}


//250 at a time seems to be the functional limit of the environment
// I will want to divide by octave and have seperate play functions with bp filters?

    virtual_ans.play = function () {  
        let i = 0;
        for (let sinOsc of sinOscs) {
            let synthName = sinOsc;
            i += 1;
        }
    };


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
    virtual_ans.play();

    let columnArray = result['column'];
    // I want to get next pixelColumn and set muls once every second (for now)
    let columnNum = 0;

    let interval = setInterval(function () {
        let pixelColumn = columnArray[columnNum];
        playPixelColumn(pixelColumn);

        columnNum += 1;
        if (columnNum > columnArray.length) {
            clearInterval(interval);

            //stop environment eventually, for now just set all mul to 0
            for (let i=0; i < 240; i++) {
                console.log(sinOscs[i]);
                sinOscs[i].options.synthDef.mul = 0;
            }
        }
    }, 1000)
}


function playPixelColumn(pixelColumn) {

    // let i = 0;
    // for (let pixel of pixelColumn) {
    for (let j=0; j<240; j++) {
        let pixel = pixelColumn[j];
        let newMul = pixel / 5000; /* pixel val: 0-255, mul range: 0.00-0.05 */

        let osc = sinOscs[j];
        // debugger;
        if (osc === undefined) {
            console.log(j);
        }
        sinOscs[j].options.synthDef.mul = newMul;
        // i += 1;
    }
}