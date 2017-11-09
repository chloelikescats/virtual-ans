/*PLANNING:
- Get Column Data
- 0-255 (0 is white, 255 is black)
- Scale amplitude based on 0-255 (0 loudest, 255 silent)
- Each value represents pixel in row
- 720 rows, 240 tones
--------------------
- (formerly 72) 24 discrete oscillators per octave.
- 2 "photocells" per octave
- 12 oscillators -> bandpass filter -> amplitude control
- 2 bandpass filters/amplitude controls per octave
*/ 

//AJAX on page load to get frequencies
$.get("/frequencies.json", generateSynths);

//Create array of synth objects, one for each freq
function generateSynths(result) {
    let synths = [];
    // console.log(result);
    let frequencyArray = result['frequency']

    count = 1
    for (let freq_hz in frequencyArray) {
        synth_id = "sin" + count;
        console.log(synth_id)
        let sin_osc = {
            synthDef: {
                ugen: "flock.ugen.sinOsc",
                // not sure if will work:
                id: synth_id,
                freq: frequencyArray[freq_hz],
                mul: 0.00
            }

        }
            synths.push(sin_osc)
            count += 1
    }
    let allSynths = synths;
}

//250 at a time seems to be the functional limit of the environment
fluid.registerNamespace("virtual_ans");

// I will want to divide by octave and have seperate play functions with bp filters
    virtual_ans.play = function () {
        let counter = 0;
        while (counter < 240){
            let sin_osc = flock.synth(allSynths[counter]);
            counter+=1;
        }

    };

// AJAX gets pixel data
$.get("/pixel_data.json", playSynths);
// Function that unpacks a column data every second
function playSynths(result) {
    let columnArray = result['pixel_column']

    // I want to get next pixelColumn and set muls once every second (for now)
    let columnNum = 0;

    let interval = setInterval(function () {
        let pixelColumn = columnArray[columnNum];
        playPixelColumn(pixelColumn);

        columnNum += 1;
        if (columnNum > columnArray.length) {
            clearInterval(interval);
            //stop environment.
        }
    }, 1000)

}

function playPixelColumn(pixelColumn) {
    count = 1;
    for (let pixel in pixelColumn) {
        let newMul = pixel / 5000; /* pixel val: 0-255, mul range: 0.00-0.05 */
        synth_id = "sin" + count;

        //not sure if setting id this way will work...
        sin_osc.set(synth_id + ".mul", newMul);
        count += 1;
    }
}
// Set each synth's mul based on pixel data
// Once all each column has been played, stop virtual_ans
